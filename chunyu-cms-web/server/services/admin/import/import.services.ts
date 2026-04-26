import * as ExcelJS from 'exceljs';
import xlsx from 'node-xlsx';
import type { MultiPartData } from 'h3';
import { PaperServices } from '../paper/paper.services';
import { PatentServices } from '../patent/patent.services';
import { TopicServices } from '../topic/topic.services';

type ImportType = 'paper' | 'patent' | 'topic';

type ImportColumn = {
  key: string;
  label: string;
  required?: boolean;
};

type ImportPreviewRow = {
  rowNo: number;
  valid: boolean;
  errors: string[];
  data: Record<string, any>;
};

type ImportPreviewResult = {
  type: ImportType;
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
  rows: ImportPreviewRow[];
};

const paperService = new PaperServices();
const patentService = new PatentServices();
const topicService = new TopicServices();

const IMPORT_CONFIG: Record<
  ImportType,
  {
    label: string;
    filename: string;
    columns: ImportColumn[];
    sampleRow: Record<string, any>;
  }
> = {
  paper: {
    label: '论文',
    filename: '论文导入模板.xlsx',
    columns: [
      { key: 'title', label: '论文标题', required: true },
      { key: 'publishYear', label: '发表年份' },
      { key: 'keywords', label: '关键词' },
      { key: 'abstract', label: '摘要' },
      { key: 'isFeatured', label: '是否精选' },
      { key: 'status', label: '状态' }
    ],
    sampleRow: {
      title: '示例论文标题',
      publishYear: 2024,
      keywords: '针灸,脉诊',
      abstract: '这里填写论文摘要',
      isFeatured: '否',
      status: '发布'
    }
  },
  patent: {
    label: '专利',
    filename: '专利导入模板.xlsx',
    columns: [
      { key: 'title', label: '专利名称', required: true },
      { key: 'patentNo', label: '专利号' },
      { key: 'applicant', label: '申请人' },
      { key: 'applyYear', label: '申请年份' },
      { key: 'abstract', label: '摘要' },
      { key: 'status', label: '状态' }
    ],
    sampleRow: {
      title: '示例专利名称',
      patentNo: 'CN20260001',
      applicant: '成都中医药大学',
      applyYear: 2024,
      abstract: '这里填写专利摘要',
      status: '发布'
    }
  },
  topic: {
    label: '课题',
    filename: '课题导入模板.xlsx',
    columns: [
      { key: 'title', label: '课题名称', required: true },
      { key: 'topicNo', label: '课题编号' },
      { key: 'leader', label: '负责人' },
      { key: 'projectYear', label: '立项年份' },
      { key: 'source', label: '来源' },
      { key: 'abstract', label: '摘要' },
      { key: 'status', label: '状态' }
    ],
    sampleRow: {
      title: '示例课题名称',
      topicNo: 'TOPIC-2026-001',
      leader: '张教授',
      projectYear: 2024,
      source: '省部级课题',
      abstract: '这里填写课题摘要',
      status: '发布'
    }
  }
};

export class ImportServices {
  async downloadTemplate(type: string) {
    const config = this.getConfig(type);
    const workbook = new (ExcelJS as any).default.Workbook();
    const worksheet = workbook.addWorksheet(config.label);
    worksheet.addRow(config.columns.map(column => column.label));
    worksheet.addRow(config.columns.map(column => config.sampleRow[column.key] ?? ''));
    worksheet.columns = config.columns.map(() => ({ width: 22 }));
    return {
      filename: config.filename,
      buffer: await workbook.xlsx.writeBuffer()
    };
  }

  async preview(type: string, file: MultiPartData): Promise<ImportPreviewResult> {
    const config = this.getConfig(type);
    this.validateFile(file);

    const sheets = xlsx.parse(Buffer.from(file.data));
    const data = Array.isArray(sheets?.[0]?.data) ? sheets[0].data : [];
    const rawRows = data.slice(1).filter(row => this.hasMeaningfulCell(row));
    const rows = rawRows
      .filter(row => !this.isSampleRow(config.sampleRow, config.columns, row))
      .map((row, index) => this.buildPreviewRow(config.columns, row, index + 2, type as ImportType));

    return {
      type: type as ImportType,
      summary: {
        total: rows.length,
        valid: rows.filter(row => row.valid).length,
        invalid: rows.filter(row => !row.valid).length
      },
      rows
    };
  }

  async confirm(type: string, rows: ImportPreviewRow[] | undefined, userName = 'system') {
    const importType = this.getConfig(type);
    const importRows = Array.isArray(rows) ? rows : [];
    const failRows: Array<{ rowNo: number; reason: string }> = [];
    let successCount = 0;

    for (const row of importRows) {
      const rebuilt = this.buildPreviewRow(importType.columns, importType.columns.map(column => row?.data?.[column.key]), row.rowNo, type as ImportType);
      if (!rebuilt.valid) {
        failRows.push({
          rowNo: row.rowNo,
          reason: rebuilt.errors.join('；')
        });
        continue;
      }

      try {
        if (type === 'paper') {
          await paperService.add(rebuilt.data, userName);
        } else if (type === 'patent') {
          await patentService.add(rebuilt.data, userName);
        } else {
          await topicService.add(rebuilt.data, userName);
        }
        successCount += 1;
      } catch (error) {
        failRows.push({
          rowNo: row.rowNo,
          reason: error instanceof Error ? error.message : '导入失败'
        });
      }
    }

    return {
      successCount,
      failCount: failRows.length,
      failRows
    };
  }

  private buildPreviewRow(columns: ImportColumn[], row: any[], rowNo: number, type: ImportType): ImportPreviewRow {
    const data = columns.reduce<Record<string, any>>((result, column, index) => {
      result[column.key] = this.normalizeCell(row[index]);
      return result;
    }, {});
    const errors = this.validateRow(type, data);

    return {
      rowNo,
      valid: errors.length === 0,
      errors,
      data
    };
  }

  private validateRow(type: ImportType, data: Record<string, any>) {
    const errors: string[] = [];

    if (!data.title) {
      errors.push('标题不能为空');
    }

    if (type === 'paper') {
      const publishYear = this.normalizeYear(data.publishYear, '发表年份格式错误', errors);
      data.publishYear = publishYear;
      data.isFeatured = this.normalizeFeaturedValue(data.isFeatured, errors);
      data.status = this.normalizeStatusValue(data.status, errors);
      data.keywords = this.normalizeText(data.keywords);
      data.abstract = this.normalizeText(data.abstract);
    }

    if (type === 'patent') {
      data.applyYear = this.normalizeYear(data.applyYear, '申请年份格式错误', errors);
      data.status = this.normalizeStatusValue(data.status, errors);
      data.patentNo = this.normalizeText(data.patentNo);
      data.applicant = this.normalizeText(data.applicant);
      data.abstract = this.normalizeText(data.abstract);
    }

    if (type === 'topic') {
      data.projectYear = this.normalizeYear(data.projectYear, '立项年份格式错误', errors);
      data.status = this.normalizeStatusValue(data.status, errors);
      data.topicNo = this.normalizeText(data.topicNo);
      data.leader = this.normalizeText(data.leader);
      data.source = this.normalizeText(data.source);
      data.abstract = this.normalizeText(data.abstract);
    }

    data.title = this.normalizeText(data.title);

    return errors;
  }

  private normalizeCell(value: any) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return value.trim();
    return String(value).trim();
  }

  private normalizeText(value: any) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private normalizeYear(value: any, message: string, errors: string[]) {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    const year = Number(value);
    if (!Number.isInteger(year) || year < 0) {
      errors.push(message);
      return value;
    }

    return year;
  }

  private normalizeStatusValue(value: any, errors: string[]) {
    if (value === '' || value === null || value === undefined) {
      return '0';
    }

    const normalized = String(value).trim();
    if (normalized === '1' || normalized === '发布') return '1';
    if (normalized === '0' || normalized === '草稿') return '0';
    errors.push('状态仅支持“发布/草稿”或“1/0”');
    return normalized;
  }

  private normalizeFeaturedValue(value: any, errors: string[]) {
    if (value === '' || value === null || value === undefined) {
      return '0';
    }

    const normalized = String(value).trim();
    if (normalized === '1' || normalized === '是') return '1';
    if (normalized === '0' || normalized === '否') return '0';
    errors.push('是否精选仅支持“是/否”或“1/0”');
    return normalized;
  }

  private hasMeaningfulCell(row: any[]) {
    return Array.isArray(row) && row.some(cell => this.normalizeCell(cell) !== '');
  }

  private isSampleRow(sampleRow: Record<string, any>, columns: ImportColumn[], row: any[]) {
    return columns.every((column, index) => String(this.normalizeCell(row[index])) === String(sampleRow[column.key] ?? ''));
  }

  private validateFile(file: MultiPartData) {
    const filename = String(file.filename || '').toLowerCase();
    if (!filename.endsWith('.xlsx')) {
      throw createError({ statusCode: 400, message: '仅支持上传 .xlsx 文件' });
    }
  }

  private getConfig(type: string) {
    const config = IMPORT_CONFIG[type as ImportType];
    if (!config) {
      throw createError({ statusCode: 400, message: '不支持的导入类型' });
    }
    return config;
  }
}

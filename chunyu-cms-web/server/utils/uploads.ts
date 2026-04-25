import { existsSync } from 'fs';
import { resolve, sep } from 'path';

function resolveProjectRoot() {
  const cwd = process.cwd();
  if (existsSync(resolve(cwd, 'nuxt.config.ts'))) {
    return cwd;
  }

  const nestedProjectRoot = resolve(cwd, 'chunyu-cms-web');
  if (existsSync(resolve(nestedProjectRoot, 'nuxt.config.ts'))) {
    return nestedProjectRoot;
  }

  return cwd;
}

export function getUploadRoots(uploadPath = '/uploads') {
  const projectRoot = resolveProjectRoot();
  const normalizedUploadPath = uploadPath.replace(/^\/+/, '') || 'uploads';

  return Array.from(
    new Set([
      resolve(projectRoot, normalizedUploadPath),
      resolve(projectRoot, 'public', normalizedUploadPath),
      resolve(projectRoot, '.output', 'public', normalizedUploadPath)
    ])
  );
}

export function resolveUploadCandidates(relativePath: string, uploadPath = '/uploads') {
  const safeRelativePath = relativePath.replace(/^\/+/, '');

  return getUploadRoots(uploadPath).map(root => ({
    root,
    filePath: resolve(root, safeRelativePath)
  }));
}

export function isWithinUploadRoot(filePath: string, uploadRoot: string) {
  return filePath === uploadRoot || filePath.startsWith(`${uploadRoot}${sep}`);
}

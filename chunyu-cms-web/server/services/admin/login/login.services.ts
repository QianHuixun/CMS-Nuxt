import * as svgCaptcha from 'svg-captcha';
import { Storage } from 'unstorage';
import * as jwt from 'jsonwebtoken';
import {
  CAPTCHA_IMG_KEY,
  USER_DEPTID_KEY,
  USER_DEPTNAME_KEY,
  USER_NICKNAME_KEY,
  USER_PERMISSIONS_KEY,
  USER_ROLEKEYS_KEY,
  USER_ROLEKS_KEY,
  USER_TOKEN_KEY,
  USER_USERNAME_KEY,
  USER_VERSION_KEY
} from '~~/server/contants/redis.contant';
import { SharedServices } from '~~/server/services/admin/share/shared.services';
import { UserServices } from '~~/server/services/admin/system/user/user.services';
import { MenuServices } from '~~/server/services/admin/system/menu/menu.service';
import { AuthServices } from '~~/server/services/admin/auth/auth.services';
import { LogServices } from '~~/server/services/admin/monitor/log/log.services';
import { SysConfigServices } from '~~/server/services/admin/system/sysConfig/sys.config.services';

export class LoginServices {
  private userServices?: UserServices;
  private sharedServices?: SharedServices;
  private menuServices?: MenuServices;
  private authServices?: AuthServices;
  private logServices?: LogServices;
  private sysConfigServices?: SysConfigServices;

  private getUserServices() {
    if (!this.userServices) {
      this.userServices = new UserServices();
    }
    return this.userServices;
  }

  private getSharedServices() {
    if (!this.sharedServices) {
      this.sharedServices = new SharedServices();
    }
    return this.sharedServices;
  }

  private getMenuServices() {
    if (!this.menuServices) {
      this.menuServices = new MenuServices();
    }
    return this.menuServices;
  }

  private getAuthServices() {
    if (!this.authServices) {
      this.authServices = new AuthServices();
    }
    return this.authServices;
  }

  private getLogServices() {
    if (!this.logServices) {
      this.logServices = new LogServices();
    }
    return this.logServices;
  }

  private getSysConfigServices() {
    if (!this.sysConfigServices) {
      this.sysConfigServices = new SysConfigServices();
    }
    return this.sysConfigServices;
  }

  private getRedis() {
    return useStorage('redis') as Storage<string | number | null>;
  }

  /* 鍒涘缓楠岃瘉鐮佸浘鐗?*/
  async createImageCaptcha() {
    try {
      const { data, text } = svgCaptcha.createMathExpr({
        size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        color: true,
        background: '#ffffff',
        width: 115.5,
        height: 38
      });
      const uuid = this.getSharedServices().generateUUID();
      // 楠岃瘉鐮?鏈夋晥鏈?鍒嗛挓
      await this.getRedis().setItem(`${CAPTCHA_IMG_KEY}:${uuid}`, text, { ttl: 60 * 3 });
      return {
        img: data.toString(),
        uuid
      };
    } catch (error) {
      throw createError({ statusCode: 400, message: String(error) });
    }
  }

  async login(username: string, password: string, headers: any) {
    try {
      const user = await this.getAuthServices().validateUser(username, password, headers);
      const payload = { userId: user.userId, userName: user.userName, pv: 1 };
      const loginTime = await this.getSysConfigServices().findByConfigKey('loginTime');
      const token = (jwt as any).default.sign(payload, useRuntimeConfig().jwt.secret, {
        expiresIn: loginTime?.configValue ? Number(loginTime.configValue) * 1000 : '1d'
      });
      // 瀛樺偍瀵嗙爜鐗堟湰鍙凤紝闃叉鐧诲綍鏈熼棿 瀵嗙爜琚鐞嗗憳鏇存敼鍚?杩樿兘缁х画鐧诲綍
      await this.getRedis().setItem(`${USER_VERSION_KEY}:${user.userId}`, 1);
      // 瀛樺偍token, 闃叉閲嶅鐧诲綍闂锛岃缃畉oken杩囨湡鏃堕棿(1澶╁悗 token 鑷姩杩囨湡)锛屼互鍙婁富鍔ㄦ敞閿€token銆?
      await this.getRedis().setItem(`${USER_TOKEN_KEY}:${user.userId}`, token, {
        ttl: loginTime?.configValue ? Number(loginTime.configValue) : 60 * 60 * 24
      });
      // 璋冪敤瀛樺偍鍦ㄧ嚎鐢ㄦ埛鎺ュ彛
      await this.getLogServices().addLoginInfo(
        {
          headers,
          user
        },
        '鐧诲綍鎴愬姛',
        `${USER_TOKEN_KEY}:${user.userId}`
      );
      return { token };
    } catch (error) {
      throw createError({ statusCode: 400, message: (error as any).message || String(error) });
    }
  }

  async getInfo(userId: number | string) {
    const user = await this.getUserServices().findOneUserAllById(userId);
    if (!user) {
      throw createError({ statusCode: 400, message: '鐢ㄦ埛淇℃伅宸茶淇敼' });
    }
    const deptId = user.dept ? user.dept.deptId : '';
    const deptName = user.dept ? user.dept.deptName : '';
    const roleKeyArr: string[] = user.roles.map(role => role.roleKey);
    let permissions: string[] = [];
    if (!roleKeyArr.length) {
      permissions = [];
    } else if (roleKeyArr.find(roleKey => roleKey === 'admin')) {
      permissions = ['*:*:*'];
    } else {
      const roleIdArr = user.roles.map(role => role.roleId);
      permissions = await this.getMenuServices().getAllPermissionsByRoles(roleIdArr);
    }
    /* 灏嗙敤鎴蜂俊鎭€佹潈闄愭暟缁勩€佽鑹叉暟缁?瀛樻斁杩涘叆缂撳瓨 */
    const redis = this.getRedis();
    const promiseArr = [
      redis.setItem(`${USER_USERNAME_KEY}:${userId}`, user.userName),
      redis.setItem(`${USER_NICKNAME_KEY}:${userId}`, user.nickName),
      redis.setItem(`${USER_DEPTID_KEY}:${userId}`, deptId),
      redis.setItem(`${USER_DEPTNAME_KEY}:${userId}`, deptName),
      redis.setItem(`${USER_PERMISSIONS_KEY}:${userId}`, JSON.stringify(permissions)),
      redis.setItem(`${USER_ROLEKEYS_KEY}:${userId}`, JSON.stringify(roleKeyArr)),
      redis.setItem(`${USER_ROLEKS_KEY}:${userId}`, JSON.stringify(user.roles))
    ];
    await Promise.all(promiseArr);
    return {
      permissions,
      roles: roleKeyArr,
      user
    };
  }

  /* 鑾峰彇褰撳墠鐢ㄦ埛鐨勮彍鍗?*/
  async getRouterByUser(userId: number) {
    const user = await this.getUserServices().findOneUserAllById(userId);
    const isAdmin = user.roles.some(role => role.roleKey === 'admin');
    const roleIdArr = user.roles.map(role => role.roleId);
    if (!isAdmin && !roleIdArr.length) return [];
    return await this.getMenuServices().getMenuList(isAdmin, roleIdArr);
  }

  /* 閫€鍑虹櫥褰?*/
  async logout(userId: string) {
    const redis = this.getRedis();
    if (await redis.getItem(`${USER_TOKEN_KEY}:${userId}`)) {
      await redis.removeItem(`${USER_TOKEN_KEY}:${userId}`);
    }
  }
}

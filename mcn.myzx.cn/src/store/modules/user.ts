import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import { TOKEN_KEY, USER_INFO_KEY, NO_TYPE_TOKEN } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { LoginParams, UserModel } from '/@/api/sys/model/userModel';
import { deleteAccessToken, getAccessToken, getUserProfile } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 登录用户信息
    userInfo: null,
    // token
    token: undefined,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info;
      setAuthCache(TOKEN_KEY, info);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.user = null;
      this.token = '';
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<UserModel | null> {
      try {
        // 登录授权
        const { goHome = true, mode, ...loginParams } = params;
        const data = await getAccessToken(loginParams, mode);
        const token = data.type + ' ' + data.token;
        const userId = data.user_id;

        // 保存token
        this.setToken(token);
        localStorage.setItem('NOT_TYPE_TOKEN', data.token);
        // 获取登录用户信息
        const userInfo = await this.getUserInfoAction();

        const sessionTimeout = this.sessionTimeout;
        if (sessionTimeout) {
          this.setSessionTimeout(false);
        } else if (goHome) {
          userInfo.homePath =
            userInfo.organization_id === 0 ? PageEnum.BOSS_HOME : PageEnum.BASE_HOME;
          await router.replace(userInfo.homePath);
        }
        return userInfo;
      } catch (error) {
        //return Promise.reject(error);
      }
    },
    async getUserInfoAction(): Promise<UserInfo> {
      let userInfo = await getUserProfile();
      userInfo.homePath = '';
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      try {
        await deleteAccessToken();
      } catch {
        console.log('注销Token失败');
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      localStorage.clear();
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}

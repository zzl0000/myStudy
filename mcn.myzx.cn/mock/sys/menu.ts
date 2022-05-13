import { resultSuccess, resultError, getRequestToken, requestParams } from '../_util';
import { MockMethod } from 'vite-plugin-mock';
import { createFakeUserList } from './user';

// single
const dashboardRoute = {
  path: '/dashboard',
  name: 'Dashboard',
  component: 'LAYOUT',
  redirect: '/dashboard/analysis',
  meta: {
    title: 'routes.dashboard.dashboard',
    hideChildrenInMenu: true,
    icon: 'bx:bx-home',
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: '/dashboard/analysis/index',
      meta: {
        hideMenu: true,
        hideBreadcrumb: true,
        title: 'routes.dashboard.analysis',
        currentActiveMenu: '/dashboard',
        icon: 'bx:bx-home',
      },
    },
    {
      path: 'workbench',
      name: 'Workbench',
      component: '/dashboard/workbench/index',
      meta: {
        hideMenu: true,
        hideBreadcrumb: true,
        title: 'routes.dashboard.workbench',
        currentActiveMenu: '/dashboard',
        icon: 'bx:bx-home',
      },
    },
  ],
};

const sysRoute = {
  path: '/system',
  name: 'System',
  component: 'LAYOUT',
  redirect: '/system/account',
  meta: {
    icon: 'ion:settings-outline',
    title: 'routes.demo.system.moduleName',
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement',
      meta: {
        title: 'routes.demo.system.account',
        ignoreKeepAlive: true,
      },
      component: '/system/account/index',
    },
    {
      path: 'account_detail/:id',
      name: 'AccountDetail',
      meta: {
        hideMenu: true,
        title: 'routes.demo.system.account_detail',
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system/account',
      },
      component: '/system/account/AccountDetail',
    },
    {
      path: 'role',
      name: 'RoleManagement',
      meta: {
        title: 'routes.demo.system.role',
        ignoreKeepAlive: true,
      },
      component: '/system/role/index',
    },
    {
      path: 'menu',
      name: 'MenuManagement',
      meta: {
        title: 'routes.demo.system.menu',
        ignoreKeepAlive: true,
      },
      component: '/system/menu/index',
    },
  ],
};

const assistantRoute = {
  path: '/assistant',
  name: 'Assistant',
  component: 'LAYOUT',
  redirect: '/assistant/doctorScheduling',
  meta: {
    icon: 'carbon:user-role',
    title: '医助工作站',
  },
  children: [
    {
      path: 'doctorScheduling',
      name: 'Assistant',
      component: '/assistant/doctor-scheduling/index',
      meta: {
        title: '医生排班',
      },
    },
    {
      path: 'regOrder',
      name: 'AssistantRegOrder',
      component: '/assistant/registration/index',
      meta: {
        title: '挂号订单',
      },
    },
    {
      path: 'regOrderDetail',
      name: 'AssistantRegOrderDetail',
      component: '/assistant/registration/detail/index',
      meta: {
        hideMenu: true,
        title: '订单详情',
        ignoreKeepAlive: true,
        showMenu: false,
      },
    },
    {
      path: 'prescribeOrder',
      name: 'AssistantPrescribeOrder',
      component: '/assistant/prescription/index',
      meta: {
        title: '处方订单',
      },
    },
  ],
};

const serviceRoute = {
  path: '/service',
  name: 'Service',
  component: 'LAYOUT',
  redirect: '/service/patient',
  meta: {
    icon: 'carbon:user-role',
    title: '客服工作站',
  },
  children: [
    {
      path: 'patient',
      name: 'ServicePatient',
      component: '/service/patient/index',
      meta: {
        title: '患者线索收集',
      },
    },
    {
      path: 'scheduling',
      name: 'ServiceScheduling',
      component: '/service/scheduling/index',
      meta: {
        title: '医生排班',
      },
    },
    {
      path: 'reg',
      name: 'ServiceReg',
      component: '/service/reg/index',
      meta: {
        title: '预约挂号',
      },
    },
    {
      path: 'regDetail',
      name: 'ServiceRegDetail',
      component: '/service/reg/RegDetail',
      meta: {
        title: '挂号详情',
        hideMenu: true,
      },
    },
    {
      path: 'refund',
      name: 'ServiceRefund',
      component: '/service/refund/index',
      meta: {
        title: '退款审核',
      },
    },
  ],
};

const linkRoute = {
  path: '/link',
  name: 'Link',
  component: 'LAYOUT',
  meta: {
    icon: 'ion:tv-outline',
    title: 'routes.demo.iframe.frame',
  },
  children: [
    {
      path: 'doc',
      name: 'Doc',
      meta: {
        title: 'routes.demo.iframe.doc',
        frameSrc: 'https://vvbin.cn/doc-next/',
      },
    },
    {
      path: 'https://vvbin.cn/doc-next/',
      name: 'DocExternal',
      component: 'LAYOUT',
      meta: {
        title: 'routes.demo.iframe.docExternal',
      },
    },
  ],
};

export default [
  {
    url: '/api/getMenuList',
    timeout: 1000,
    method: 'get',
    response: (request: requestParams) => {
      // const token = getRequestToken(request);
      // if (!token) {
      //   return resultError('Invalid token!');
      // }
      // const checkUser = createFakeUserList().find((item) => item.token === token);
      // if (!checkUser) {
      //   return resultError('Invalid user token!');
      // }
      // const id = checkUser.userId;
      let menu: Object[];
      // switch (id) {
      //   case '1':
      //     dashboardRoute.redirect = dashboardRoute.path + '/' + dashboardRoute.children[0].path;
      //     menu = [dashboardRoute, authRoute, levelRoute, sysRoute, linkRoute];
      //     break;
      //   case '2':
      //     dashboardRoute.redirect = dashboardRoute.path + '/' + dashboardRoute.children[1].path;
      //     menu = [dashboardRoute, authRoute, levelRoute, linkRoute];
      //     break;
      //   default:
      //     menu = [];
      // }

      dashboardRoute.redirect = dashboardRoute.path + '/' + dashboardRoute.children[0].path;
      menu = [sysRoute, assistantRoute, serviceRoute.children];

      return resultSuccess(menu);
    },
  },
] as MockMethod[];

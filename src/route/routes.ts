/**
 * 组件式路由更符合React思想，但集中式路由更容易理解和管理
 * 在这里统一配置后，后续在组件里边使用<Outlet/>即可渲染子组件
 * 项目要求路由路径统一使用中划线的形式/report/contract-category，禁止使用驼峰
 *
 * @author xuyoudun
 * @email udun.xu@hotmail.com
 * @date 2022年08月11日
 */
import {/*ComponentType, */lazy} from 'react';
import {/*Navigate,*/ RouteObject} from 'react-router-dom';
import {/*NAV_TAB_DASHBOARD,*/ AppLayout} from 'planets';
import Login from '../views/login/Login';
import Dashboard from '../views/dashboard/Dashboard';

export type RouteConfig = RouteObject & {
  children?: RouteConfig[];
  props?: Record<string, any>; /*组件props*/
  mete?: { title?: string, cache?: boolean };
};

const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        path: '/dashboard',
        Component: Dashboard
        //props: {to: `${NAV_TAB_DASHBOARD.url}?tname=${NAV_TAB_DASHBOARD.title}`}
      },
      {
        path: '/:id/test-fight',
        Component: lazy(() => import('../views/test-fight/TestFight')),
        props: {type: 'warning'}
      }
    ]
  }
];

export default constantRoutes;

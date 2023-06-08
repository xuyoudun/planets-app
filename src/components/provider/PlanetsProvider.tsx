import React, {ReactNode, useEffect, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';

export interface AppOauth {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

export interface AppRole {
  roleCode: string;
  roleName: string;
}

export interface AppMenu {
  menuCode: string;
  menuName: string;
  urlPath?: string;
  children?: AppMenu[];
}

export interface AppUser {
  userCode: string;
  userName: string;
  menus: AppMenu[];
  roles: AppRole[];
  position?: any[];
}


export type AppAuthentication = {
  oauth: AppOauth;
  signIn: (data: any, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
} & AppUser

export const authentication = (data: any): Promise<AppOauth> => {
  data;
  // fake token
  const result = {
    'access_token': 'c830475f-4f6f-4587-810f-e480d9c749a8',
    'token_type': 'bearer',
    'refresh_token': '84e2e42f-19ac-408c-82b2-b6e48ca1ddae',
    'expires_in': 7200,
    'scope': 'read write trust'
  };
  return new Promise<AppOauth>((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 200);
  });
};

export const getSessionUser = (): Promise<AppUser> => {
  const menus: AppMenu[] = [
    {
      menuCode: 'dashboard',
      menuName: '首页',
      urlPath: '/dashboard'
    },
    {
      menuCode: 'test-fight',
      menuName: 'TestFight',
      children: [
        {
          menuCode: 'test-fight-1',
          menuName: 'TestFight1',
          urlPath: '/success/test-fight'
        },
        {
          menuCode: 'test-fight-2',
          menuName: 'TestFight2',
          urlPath: '/warning/test-fight'
        },
        {
          menuCode: 'test-fight-3',
          menuName: 'TestFight3',
          urlPath: '/error/test-fight'
        }
      ]
    }
  ];
  const roles: AppRole[] = [
    {
      roleCode: 'Admin',
      roleName: '管理员'
    }
  ];
  const userCode = 'Admin';
  const userName = 'Admin';

  return new Promise<AppUser>((resolve) => {
    setTimeout(() => {
      resolve({menus, roles, userCode, userName});
    }, 200);
  });
};


export const PlanetsContext = React.createContext<AppAuthentication>({
  userCode: '', userName: '', menus: [], roles: [],
  oauth: {
    'access_token': '',
    'token_type': '',
    'expires_in': 3600,
    'scope': 'default'
  },
  signIn: (data, callback) => callback,
  signOut: (callback) => callback
});

export function usePlanets() {
  return React.useContext(PlanetsContext);
}

const PlanetsProvider: React.FC<{ children: ReactNode }> = ({children}) => {

  const [oauth, setOauth] = useState<AppOauth>(() => {
    const accessToken = sessionStorage.getItem('ACCESS_TOKEN');
    return accessToken ? JSON.parse(accessToken) : {};
  });

  const [appUser, setAppUser] = useState<AppUser>({userCode: '', userName: '', menus: [], roles: []});

  const signOut = (callback: VoidFunction) => {
    sessionStorage.clear();
    callback();
  };

  const signIn = (data: any, callback: VoidFunction) => {
    // 登录的过程通常分为认证和获取用户信息两个步骤
    Promise.all([authentication(data), getSessionUser()])
      .then(([oauth, appUser]) => {
        setOauth(oauth);
        sessionStorage.setItem('ACCESS_TOKEN', JSON.stringify(oauth));
        setAppUser(appUser);
        callback();
      })
      .catch((error) => {
        error;
      });
  };

  useEffect(() => {
    // react18的bug， 严格模式下，会触发两次组件加载，这里会执行两次
    // 解决方式：<React.StrictMode> 标记并将其删除，不推荐
    // 或者构建用于生产。双重渲染问题应该消失了 -- 来自 React 官方文档
    if (oauth.access_token && !appUser.userCode) {
      getSessionUser().then((appUser) => setAppUser(appUser));
    }
  }, []);

  return (
    <PlanetsContext.Provider value={{oauth, signIn, signOut, ...appUser}}>
      {children}
    </PlanetsContext.Provider>
  );
};

//export const Authorization: React.FC<{ children: ReactNode }> = ({children}) => {
export function Authorization({children}: { children: JSX.Element }) {
  const auth = usePlanets();
  const location = useLocation();

  if (!auth.oauth?.access_token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{from: location}} replace/>;
  }

  return children;
}

export default PlanetsProvider;

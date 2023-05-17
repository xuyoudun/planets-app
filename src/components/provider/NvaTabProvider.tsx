import React, {Context, ReactNode, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';

export interface NvaTab {
  title: string | null;
  url: string;
  search?: string | null;
}

export interface NvaTabProviderProps {
  autoOpen?: boolean;
  children?: ReactNode | undefined;
}

export type NvaTabContextProps = {
  activeKey?: string;
  nvaTabs?: NvaTab[];
  refresh?: () => void;
  removeAll?: () => void;
  removeOthers?: (key: string) => void;
  remove?: (key?: string) => void;
  changeNvaTab?: (key: string) => void;
  openNewNvaTab?: (nvaTab: NvaTab) => void;
}

export const NvaTabContext: Context<NvaTabContextProps> = React.createContext({});

export function useNvaTab() {
  return React.useContext(NvaTabContext);
}

export const STORAGE_NAV_TABS = 'NAV_TABS';
export const STORAGE_NAV_TAB_ACTIVE = 'NAV_TAB_ACTIVE';

export const NAV_TAB_DASHBOARD: NvaTab = {
  url: '/dashboard',
  title: '首页',
  search: '?tname=首页'
};

//规范化pathname
const normalizePathname = (pathname: string): string => {
  return pathname.replace(/\/+$/, '')
    .replace(/^\/*/, '/')
    .replace(/\/\/+/g, '/');
};

const normalizeSearch = (search: string | null): string => {
  search = !search ? '' : search.replace(/^\?*/, '?');
  return search === '?' ? '' : search;
};

const NvaTabProvider: React.FC<NvaTabProviderProps> = ({children, autoOpen = true}) => {

  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const search = normalizeSearch(location.search);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [nvaTabs, setNvaTabs] = useState<NvaTab[]>(() => {
    const storage = sessionStorage.getItem(STORAGE_NAV_TABS);
    return storage ? JSON.parse(storage) : [NAV_TAB_DASHBOARD];
  });
  const nvaTabsRef = useRef(nvaTabs);

  const setNvaTabsWithStorage = (nvaTabs: NvaTab[]) => {
    sessionStorage.setItem(STORAGE_NAV_TABS, JSON.stringify(nvaTabs));
    nvaTabsRef.current = nvaTabs;
    setNvaTabs(nvaTabs);
  };

  const changeNvaTab = (key: string) => {
    const nvaTab = nvaTabsRef.current.find((tab) => tab.url == key);
    if (!nvaTab) return;
    navigate(key + (nvaTab.search || ''));
  };

  const remove = (key = pathname) => {
    // dropByCacheKey(key);
    const index = nvaTabsRef.current.findIndex((d) => d.url == key);
    const nvaTabsNext = [...nvaTabsRef.current];
    nvaTabsNext.splice(index, 1);
    setNvaTabsWithStorage(nvaTabsNext);
    // 移除当前激活的tab页，则跳转到前一个tab页
    if (key === pathname) {
      const last = nvaTabsNext[index - 1];
      navigate(last.url + (last.search || ''));
    }
  };

  const removeOthers = (key: string) => {
    // getCachingKeys().filter((r) => r != ROUTER_TAB_DASHBOARD.url && r != name).forEach((r) => dropByCacheKey(r));
    const nvaTab = nvaTabsRef.current.find((tab) => tab.url == key);
    if (!nvaTab) return;
    const nvaTabsNext = (key == NAV_TAB_DASHBOARD.url) ? [NAV_TAB_DASHBOARD] : [NAV_TAB_DASHBOARD, nvaTab];
    setNvaTabsWithStorage(nvaTabsNext);
    navigate(nvaTab.url + (nvaTab.search || ''));
  };

  const removeAll = () => {
    // getCachingKeys().filter((r) => r != ROUTER_TAB_DASHBOARD.url).forEach((r) => dropByCacheKey(r));
    setNvaTabsWithStorage([NAV_TAB_DASHBOARD]);
    navigate(NAV_TAB_DASHBOARD.url + NAV_TAB_DASHBOARD.search);
  };

  const refresh = () => {
    // eslint-disable-next-line no-alert
    navigate(0);
    // TODO
    //navigate(pathname + search, {replace: true});
  };

  const openNewNvaTab = ({url, title, search = null}: NvaTab) => {
    url = normalizePathname(url);
    if (url === '/') return;

    const nvaTab = nvaTabsRef.current.find((o) => o.url == url);
    const nvaTabsNext = [...nvaTabsRef.current];

    //确保search中包含tname=xxxx标签名称
    title = title || 'No Title';
    search = normalizeSearch(search);
    search = !search ? `?tname=${title}` : (search.match(/tname=[^&]*/) ? search : `${search}&tname=${title}`);

    if (nvaTab == undefined) {
      const start = parseInt(sessionStorage.getItem(STORAGE_NAV_TAB_ACTIVE) || '0'); //总是从当前激活的右侧打开新页签
      nvaTabsNext.splice(start + 1, 0, {url, title, search});
      setNvaTabsWithStorage(nvaTabsNext);
    } else if (nvaTab.search != search) {
      const index = nvaTabsNext.findIndex((o) => o.url == url);
      nvaTabsNext[index] = {...nvaTab, title, search};//替换当前页签
      setNvaTabsWithStorage(nvaTabsNext);
    }

    if (url != pathname) {
      navigate(url + search, {replace: !!(nvaTab?.search != search)});
    }

    sessionStorage.setItem(STORAGE_NAV_TAB_ACTIVE, `${nvaTabsNext.findIndex((o) => o.url == url)}`);
  };

  useEffect(() => {
    if (autoOpen) {
      const nvaTab: NvaTab = {url: pathname, title: params.get('tname'), search};
      openNewNvaTab(nvaTab);
    }
  }, [pathname, search]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.openNewNvaTab = openNewNvaTab;

  return (
    <NvaTabContext.Provider
      value={{nvaTabs, activeKey: pathname, openNewNvaTab, changeNvaTab, remove, removeOthers, removeAll, refresh}}
    >
      {children}
    </NvaTabContext.Provider>
  );
};


export default NvaTabProvider;

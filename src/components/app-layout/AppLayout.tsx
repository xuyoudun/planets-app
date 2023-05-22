import React, {Suspense, useState} from 'react';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Dropdown, Layout, Menu, Spin, theme} from 'antd';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import NvaTab from '../nva-tab/NvaTab';
import NvaTabProvider from '../provider/NvaTabProvider';
import {AppMenu, usePlanets} from '../provider/PlanetsProvider';

const {Header, Content, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const toMenu = (menuList: AppMenu[]): MenuItem[] => {
  return menuList.map((menu) => {
    const label = menu.children ? menu.menuName :
      (<NavLink to={`${menu.urlPath}?tname=${menu.menuName}`} state={{title: menu.menuName}}>{menu.menuName}</NavLink>);
    return {
      label,
      key: menu.menuCode,
      ...(menu.children ? {children: toMenu(menu.children)} : null)
    };
  });
};

const AppLayout: React.FC = () => {
  const {menus, signOut} = usePlanets();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer}
  } = theme.useToken();

  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <LogoutOutlined/>,
      label: (
        <a target="_blank" onClick={() => signOut(() => navigate('/login'))}>
          注销
        </a>
      )
    }
  ];


  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{height: '32px', margin: '16px', background: 'rgba(255,255,255,.2)', borderRadius: '6px'}}/>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={toMenu(menus)}/>
      </Sider>
      <Layout>
        <Header style={{padding: 0, background: '#001529'}}>
          <div style={{float: 'right', paddingRight: '48px'}}>
            <Dropdown menu={{items}} placement="bottomRight">
              <UserOutlined style={{fontSize: '24px', color: colorBgContainer}}
                onClick={() => null}/>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <NvaTabProvider>
            <NvaTab/>
            <div style={{margin: '12px', padding: '24px', borderRadius: '8px', background: colorBgContainer}}>
              <Suspense fallback={<Spin spinning>{'页面加载中...'}</Spin>}>
                <Outlet/>
              </Suspense>
            </div>
          </NvaTabProvider>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

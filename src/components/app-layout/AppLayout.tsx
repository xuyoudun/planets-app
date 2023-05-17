import React, {Suspense, useState} from 'react';
import {DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Layout, Menu, Spin, theme} from 'antd';
import {Outlet} from 'react-router-dom';
import NvaTab from '../nva-tab/NvaTab';
import NvaTabProvider from '../provider/NvaTabProvider';

const {Header, Content, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined/>),
  getItem('Option 2', '2', <DesktopOutlined/>),
  getItem('User', 'sub1', <UserOutlined/>, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5')
  ]),
  getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined/>)
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer}
  } = theme.useToken();

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{height: '32px', margin: '16px', background: 'rgba(255,255,255,.2)', borderRadius: '6px'}}/>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
      </Sider>
      <Layout>
        <Header style={{padding: 0, background: colorBgContainer, backgroundColor: '#001529'}}/>
        <Content>
          <NvaTabProvider>
            <NvaTab/>
            <div style={{margin: '12px', padding: '24px', minHeight: 360, background: colorBgContainer}}>
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

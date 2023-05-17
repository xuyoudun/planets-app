import React from 'react';
import {Dropdown, Menu, Tabs} from 'antd';
import {NAV_TAB_DASHBOARD, useNvaTab} from '../provider/NvaTabProvider';
import './NvaTab.less';
import {RenderTabBar} from 'rc-tabs/lib/interface';
import {ItemType} from 'antd/lib/menu/hooks/useItems';

const TabPane = Tabs.TabPane;

const NvaTab = () => {

  const {activeKey, removeAll, refresh, remove, removeOthers, changeNvaTab, nvaTabs} = useNvaTab();

  const getMenuItems = (contextKey: string): ItemType[] => {
    return [
      {label: '刷新', key: 'refresh'},
      contextKey == NAV_TAB_DASHBOARD.url ? null : {label: '关闭', key: 'remove'},
      {label: '关闭其他', key: 'removeOthers'},
      {label: '全部关闭', key: 'removeAll'}
    ].filter((m) => m);
  };

  const handlerMenuClick = (action: string, contextKey: string) => {
    if (action == 'refresh') refresh?.();
    if (action == 'remove') remove?.(contextKey);
    if (action == 'removeOthers') removeOthers?.(contextKey);
    if (action == 'removeAll') removeAll?.();
  };

  const renderTabBar: RenderTabBar = (tabNavBarProps, TabNavList) => {
    // https://github.com/react-component/tabs/blob/master/src/TabNavList/TabNode.tsx
    // renderWrapper包裹TabNode
    return (
      <TabNavList {...tabNavBarProps}>
        {
          (node) => {
            return (
              <Dropdown
                destroyPopupOnHide
                overlay={
                  <Menu items={getMenuItems(`${node.key}`)}
                    onClick={({key}) => handlerMenuClick(key, `${node.key}`)}
                  />}
                placement="bottomLeft"
                trigger={['contextMenu']}
              >
                {node}
              </Dropdown>
            );
          }
        }
      </TabNavList>
    );
  };

  return (
    <Tabs
      activeKey={activeKey}
      animated={false}
      className="mtx-nva-tab"
      hideAdd
      onChange={changeNvaTab}
      onEdit={(targetKey, action) => {
        if (action === 'remove' && typeof targetKey == 'string') {
          remove?.(targetKey);
        }
      }}
      renderTabBar={renderTabBar}
      type="editable-card"
    >
      {
        nvaTabs?.map((tab) => (
          <TabPane
            closable={tab.url != NAV_TAB_DASHBOARD.url}
            key={tab.url}
            tab={tab.title}
          />
        ))
      }
    </Tabs>
  );
};

export default NvaTab;


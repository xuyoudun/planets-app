import React from 'react';
import {ConfigProvider, theme} from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.css';
import {PlanetsProvider} from 'planets';
import AppRoutes from './router';

dayjs.locale('zh-cn');

const App = () => {
  return (
    <ConfigProvider locale={zhCN} theme={{algorithm: [theme.defaultAlgorithm/*, theme.compactAlgorithm*/]}}>
      <PlanetsProvider>
        <AppRoutes/>
      </PlanetsProvider>
    </ConfigProvider>
  );
};

export default App;


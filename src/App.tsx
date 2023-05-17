import React from 'react';
import {ConfigProvider, theme} from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import {PlanetsProvider} from 'planets';
import AppRoutes from './route/AppRoutes';

dayjs.locale('zh-cn');

const App = () => {
  return (
    <ConfigProvider locale={zhCN} theme={{algorithm: [theme.defaultAlgorithm/*, theme.compactAlgorithm*/]}}>
      <BrowserRouter>
        <PlanetsProvider>
          <AppRoutes/>
        </PlanetsProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;


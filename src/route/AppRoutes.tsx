//import React from 'react';
import {RouteObject, useRoutes} from 'react-router-dom';
import constantRoutes, {RouteConfig} from './routes';

const createRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes;/*routes.map((route) => {
    const {component, props, children, ...rest} = route;
    return {
      ...rest,
      element: component ? React.createElement(component, props) : null,
      ...(children ? {children: createRoutes(children)} : null)
    };
  });*/
};

const routes = createRoutes(constantRoutes);
const AppRoutes = () => useRoutes(routes);

export default AppRoutes;

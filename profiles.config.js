/* 使用命令行参数指定环境dev|uat|prod ,若不指定默认dev */
/* eq: yarn start 启动dev环境 */
/* eq: yarn start uat 或者 yarn start --profiles uat 启动uat环境 */
/* eq: yarn build prod 或者 yarn build --profiles prod 打包prod环境 */
/* eq: process.env.PROFILES 获取profiles值 */


module.exports = {

  dev: {
    baseURL: 'http://localhost:8080'
  },

  uat: {
    baseURL: 'http://www.planets-uat.com'
  },

  prod: {
    baseURL: 'http://www.planets.com'
  }
}

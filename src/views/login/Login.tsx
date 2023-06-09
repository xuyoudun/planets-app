import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Divider, Form, Input,message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import './Login.less';
import {usePlanets} from 'planets';
import {useNavigate} from 'react-router-dom';

const Login = () => {

  const {signIn} = usePlanets();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState<boolean>(false);


  useEffect(() => {
    //
  }, []);

  const handleLogin = () => {
    !verifying && form.validateFields()
      .then((values) => {
        setVerifying(true);
        signIn(values, () => {
          setVerifying(false);
          navigate('/dashboard');
          message.success('Welcome Back');
        });
      })
      .catch((/*error*/) => {
        //
      })
      .finally(() => {
        //
      });
  };

  return (
    <div className="app-login">
      <Form
        className="login-form"
        form={form}
        initialValues={{remember: true, username: 'admin', password: 'admin'}}
        name="normal_login"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{required: true, message: '请输入用户名!'}]}
        >
          <Input placeholder="用户名"
            prefix={<UserOutlined className="site-form-item-icon"/>}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{required: true, message: '请输入密码!'}]}
        >
          <Input
            placeholder="密码"
            prefix={<LockOutlined className="site-form-item-icon"/>}
            type="password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={verifying}
            onClick={handleLogin}
            style={{width: '100%'}}
            type="primary"
          >
            {'登陆'}
          </Button>
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember"
            noStyle
            valuePropName="checked"
          >
            <Checkbox>{'记住我'}</Checkbox>
          </Form.Item>
          <span style={{float: 'right'}}>
              <a href="">{'忘记密码'}</a>
              <Divider type="vertical"/>
              <a href="">{'现在注册'}</a>
            </span>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;

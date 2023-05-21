/**
 * 用于测试
 */
import React, {useState} from 'react';
import {Alert, DatePicker, message as msgBox, Space, Tag, Table} from 'antd';
import {AlertProps} from 'antd/lib/alert';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import type {ColumnsType} from 'antd/es/table';
import {useParams} from 'react-router-dom';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const TestFight: React.FC<AlertProps> = () => {
  const [date, setDate] = useState<dayjs.Dayjs | null>();
  const handleChange = (value: dayjs.Dayjs | null) => {
    msgBox.info(`您选择的日期是: ${value ? value.format('YYYY年MM月DD日') : '未选择'}`);
    setDate(value);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, {tags}) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      )
    }
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ];

  const params = useParams();
  const type = params.type as AlertProps['type'];

  return (
    <div>
      <DatePicker onChange={handleChange} value={date}/>
      <Alert description={date ? date.format('YYYY年MM月DD日') : '未选择'}
        message="当前日期"
        style={{marginTop: 12}}
      />
      <Alert
        description="我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。"
        message={type}
        showIcon
        style={{marginTop: 12}}
        type={type}
      />
      <Table style={{marginTop: 12}} columns={columns} dataSource={data}/>
    </div>
  );
};

export default TestFight;

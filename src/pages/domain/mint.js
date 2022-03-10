import React, { useState } from 'react';
import { Form, Select, Input, Upload, Button, Image } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './style.less';

export default function Mint() {
  const [state, setState] = useState({ loading: false, imageUrl: '' });

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setState((data) => ({ ...data, loading: true }));
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setState((data) => ({
          ...data,
          imageUrl,
          loading: false,
        })),
      );
    }
  };

  const { loading, imageUrl } = state;
  const uploadButton = (
    <div>
      <Button
        size="small"
        icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
        style={{ marginTop: 15 }}
      >
        Upload
      </Button>
    </div>
  );
  return (
    <Form
      className={styles.mainform}
      labelAlign="left"
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 10 }}
    >
      <Form.Item label="域名" name="domain">
        <Input className={styles.mainInput}></Input>
      </Form.Item>

      <Button
        size="middle"
        type="primary"
        style={{
          background: '#186FF2',
          borderRadius: '10px',
          marginTop: '50px',
        }}
      >
        确认
      </Button>
    </Form>
  );
}

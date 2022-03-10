import React, { useState } from 'react';
import { Form, Select, Input, Upload, Button, Image } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
// import { getToken } from '../../utils/qiniu'
import styles from './style.less';
import { mint, uploadedFile, getFile } from '@/utils/icp';
// 七牛默认的上传地址(即为post接口)
const QINIU_SERVER = 'http://upload.qiniup.com';
// bucket绑定的URL
const BASE_QINIU_URL = '';

export default function Mint() {
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    setNFTImg(file);
    getBase64(file, (imageUrl) =>
      setState((data) => ({
        ...data,
        imageUrl,
        loading: false,
      })),
    );
    // return isJpgOrPng && isLt2M;
    return false;
  }
  const [state, setState] = useState({ loading: false, imageUrl: '' });
  const [NFTImg, setNFTImg] = useState();
  // const [token, setToken] = useState("");
  // const [fileList, setFileList] = useState([]);

  // const getUploadToken = () => {
  //   const token = getToken();
  //   setToken(token);
  // };

  const handleChange = (info) => {
    console.log('handleChange');
    if (info.file.status === 'uploading') {
      setState((data) => ({ ...data, loading: true }));
      return;
    }
    if (info.file.status === 'done') {
      console.log('info.file', info.file);
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
      <Form.Item label="公链部署" name="chain" defaultValue="ICP">
        <Select className={styles.mainSelect}>
          <Select.Option value="ICP">ICP</Select.Option>
        </Select>
        <p style={{ marginTop: '10px', color: '#fff', fontSize: '12px' }}>
          请选择所要部署的公链，选择确认后，将无法修改
        </p>
      </Form.Item>

      <Form.Item label="价格" name="price" initialValue="ICP">
        <div style={{ display: 'flex' }}>
          <Input className={styles.mainInput}></Input>
          <span style={{ margin: '10px', color: '#fff', fontSize: '12px' }}>
            ICP
          </span>
        </div>
      </Form.Item>
      <Form.Item label="上传作品">
        <div style={{ display: 'flex' }}>
          <div className={styles.img}>
            {imageUrl ? (
              <Image src={imageUrl} alt="avatar" />
            ) : (
              <img
                src={require('@/static/img/img-stack@2x.png')}
                className={styles.imgdefault}
              />
            )}
          </div>

          <div>
            <p style={{ margin: 0, color: '#fff', fontSize: '12px' }}>
              请为您的每个NTF的图片进行编号， <br />
              该编号将被展示给收藏家
            </p>
            <Upload
              name="avatar"
              className="avatar-uploader"
              showUploadList={false}
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              // onChange={handleChange}
            >
              {uploadButton}
            </Upload>
          </div>
        </div>
      </Form.Item>
      <Button
        size="middle"
        type="primary"
        style={{
          background: '#186FF2',
          borderRadius: '10px',
          marginTop: '50px',
        }}
        // onClick={mint}
        onClick={() => {
          console.log('NFTImg', NFTImg);
          getBase64(NFTImg, (imageUrl) => {
            // console.log('imageUrl', imageUrl);
            uploadedFile(imageUrl);
          });
          // uploadedFile();
        }}
      >
        确认
      </Button>
      <Button
        onClick={() => {
          getFile();
        }}
      >
        获取
      </Button>
    </Form>
  );
}

import React from 'react'
import { Image, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less'
import setupIcon from '../../../static/img/setup.png'
import uploadIcon from '../../../static/img/upload.png'
import delIcon from '../../../static/img/del.png'

const NFTCard = (props) => {
  const { imageUrl, name, domain, id } = props;
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确定删除项目？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法恢复',
      okText: '确认',
      cancelText: '取消',
      onOk() { console.log(`请求接口删除${id}`) },
    });
  }
  const handleUpdate = (id) => {
    Modal.confirm({
      title: '确定上线该项目？',
      icon: <ExclamationCircleOutlined />,
      // content: '删除后将无法恢复',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        console.log(`请求接口上线${id}`)
        setTimeout(() => {
          message.success('您已成功上线项目')
        }, 2000)
      },
    });
  }
  return (
    <div className={styles.card_container}>
      <Image width={240} src={imageUrl} />
      <div className={styles.desc}>
        <div>{name}</div>
        <div>{domain}</div>
      </div>
      <div className={styles.operation}>
        <div>
          <img src={setupIcon} alt="edit" />
          <span>编辑</span>
        </div>
        <div onClick={() => handleUpdate(id)}>
          <img src={uploadIcon} alt="upload" />
          <span>上线</span>
        </div>
        <div onClick={() => handleDelete(id)}>
          <img src={delIcon} alt="delete" />
          <span>删除</span>
        </div>
      </div>
    </div>
  )
}

export default NFTCard;

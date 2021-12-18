import React from 'react'
import { Layout, } from 'antd'
import NFTCard from '../components/NFTCard'
import styles from './style.less'
import demoImg from '../../static/img/demo.png'
import demoImg1 from '../../static/img/demo1.png'
import demoImg2 from '../../static/img/demo2.png'


const mockNftList = [
  {
    id: 1,
    imageUrl: demoImg,
    name: '像素狗',
    domain: 'www.xiangsugou.io'
  },
  {
    id: 2,
    imageUrl: demoImg2,
    name: '像素狗',
    domain: 'www.xiangsugou.io'
  },
  {
    id: 3,
    imageUrl: demoImg1,
    name: '像素狗',
    domain: 'www.xiangsugou.io'
  }
]

const { Sider, Content } = Layout
export default function List() {
  return (
    <Layout style={{ color: '#fff', padding: '0 50px', background: '#050216' }}>
      <Sider>
        <div className={styles.title}>我的NFT</div>
      </Sider>
      <Content style={{ margin: '32px 32px' }}>
        <div className={styles.content}>
          {
            mockNftList.map(item => (
              <NFTCard
                imageUrl={item.imageUrl}
                name={item.name}
                domain={item.domain}
                key={item.id}
                id={item.id}
              />
            ))
          }
        </div>
      </Content>
    </Layout>
  )
}

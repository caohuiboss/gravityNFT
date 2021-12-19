import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'umi';
import { Layout, Image, Menu, Button } from 'antd';
import styles from './index.less';
import { routes } from '@/constant/index';
import { connectWallet } from '@/utils/icp';
export default function Layouts(props) {
  const {
    location: { pathname },
  } = useHistory();
  const { Header, Footer, Content } = Layout;
  const [walletInfo, setWalletInfo] = useState({});
  let scApp = window.localStorage.getItem('_scApp');

  useEffect(() => {
    let scappInfo;
    let tempscApp = scApp;
    try {
      scappInfo = JSON.parse(tempscApp);
    } catch (e) {}
    setWalletInfo(() => scappInfo || {});
  }, [scApp]);
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Image
          className={styles.logo}
          src={require('@/static/img/img_navbar_logo@2x.png')}
          preview={false}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          style={{
            display: 'flex',
            background: 'transparent',
            marginBottom: 0,
          }}
        >
          {routes.map((i) => {
            return (
              <Menu.Item key={i.path}>
                <Link to={i.path}>{i.name}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
        <Button
          type="primary"
          style={{ background: '#186FF2', borderRadius: '10px' }}
          onClick={connectWallet}
        >
          {walletInfo.principal ? '已连接' : '连接钱包'}
        </Button>
      </Header>
      <Content>{props.children}</Content>
    </Layout>
  );
}

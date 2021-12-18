import React from 'react'
import { Link } from 'umi';
import insIcon from '../../static/img/ins.png'
import teleIcon from '../../static/img/tele.png'
import twitterIcon from '../../static/img/twitter.png'
import styles from './index.less'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.desc}>通过万有引力NFT您仅需要通过简单页面交互就能搭 建出项目的官网和智能合约的部署，助力您的NFT项目快速、低成本上线</div>
        <div className={styles.btn}>
          <Link to="/mynft/list">创建项目</Link>
        </div>
      </div>
      <div className={styles.media_box}>
        <div className={styles.media}>
          <a href=""><img src={insIcon} alt="instagram" /></a>
        </div>
        <div className={styles.media}>
          <a href=""><img src={teleIcon} alt="telegram" /></a>
        </div>
        <div className={styles.media}>
          <a href=""><img src={twitterIcon} alt="twitter" /></a>
        </div>
      </div>
    </div>
  )
}

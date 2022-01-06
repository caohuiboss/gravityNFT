import './style.less';
export default function Mint(params) {
  return (
    <div className="editweb-wrap">
      <div className="web-layout">
        <div className="header">
          <div className="brand-logo">导航品牌logo</div>
          <div className="nav-img">导航背景</div>
          <div className="nav-bar">导航栏</div>
          <div className="wallet">
            <div className="wallet-btn">钱包</div>
          </div>
        </div>
        <div className="main-page">
          <div className="buy-btn-wrap">
            <div className="buy-btn">购买按钮</div>
          </div>
          <span className="title">主页面</span>
          <div className="suspended-pos">悬浮位</div>
        </div>
        <div className="common-page">
          <span className="title">页面1</span>
        </div>
        <div className="add-page-wrap">
          <div className="add-page-item">
            <img src={require('@/static/img/s-add.png')} />
            <span style={{ marginLeft: 4 }}>添加页面</span>
          </div>
        </div>
      </div>
      <div className="web-setting">
        <div className="select-setting-tips">
          <img src={require('@/static/img/empty-pointer.png')} />
          <div>请点击左边相应项进行设置</div>
        </div>
      </div>
    </div>
  );
}

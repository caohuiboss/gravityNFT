import './style.less';
import UploadImage from '@/components/UploadImage/index.tsx';
import NavBarEdit from '@/components/NavBarEdit/index.tsx';
import { useState } from 'react';
export default function Mint(params) {
  // 编辑区的状态：false 未编辑 true 编辑中
  const [EditAreaStatus, setEditAreaStatus] = useState(false);
  // 页面布局的数据
  const [PageInfo, setPageInfo] = useState({});
  // 当前编辑的模块
  const [CurEditItem, setCurEditItem] = useState({});
  const handlePageClick = (type, title) => {
    setEditAreaStatus(true);
    console.log(type, title);
    let temp = PageInfo[type]
      ? PageInfo[type]
      : (PageInfo[type] = {
          name: type,
          title: title,
        });
    setCurEditItem({ ...temp });
  };
  const handlePageChange = (data) => {
    console.log('data', data);
    let name = CurEditItem.name;
    switch (name) {
      case 'brandLogo':
        CurEditItem.image = data;
        setPageInfo({ ...PageInfo, brandLogo: CurEditItem });
        break;
      case 'navBarImage':
        CurEditItem.image = data;
        setPageInfo({ ...PageInfo, navBarImage: CurEditItem });
        break;
      default:
        break;
    }
  };
  return (
    <div className="editweb-wrap">
      <div className="web-layout">
        <div className="header">
          <div
            className="brand-logo"
            onClick={() => {
              handlePageClick('brandLogo', '导航品牌logo');
            }}
          >
            {PageInfo.brandLogo?.image ? (
              <img
                src={PageInfo.brandLogo.image}
                alt=""
                style={{ width: '100%' }}
              />
            ) : (
              '导航品牌logo'
            )}
          </div>
          <div
            className="nav-img"
            onClick={() => {
              handlePageClick('navBarImage', '导航背景');
            }}
          >
            {PageInfo.navBarImage?.image ? (
              <img
                src={PageInfo.navBarImage.image}
                alt=""
                style={{ height: '100%' }}
              />
            ) : (
              <span className="navBarTitle" style={{ lineHeight: '96px' }}>
                导航背景
              </span>
            )}
            <div
              className="nav-bar"
              onClick={(e) => {
                e.stopPropagation();
                handlePageClick('navBar', '导航栏');
              }}
            >
              导航栏
            </div>
          </div>
          <div
            className="wallet"
            onClick={() => {
              handlePageClick('wallet', '钱包');
            }}
          >
            <div className="wallet-btn">钱包</div>
          </div>
        </div>
        <div
          className="main-page"
          onClick={() => {
            handlePageClick('mainPage', '主页面');
          }}
        >
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
        {EditAreaStatus == false ? (
          <div className="select-setting-tips">
            <img src={require('@/static/img/empty-pointer.png')} />
            <div>请点击左边相应项进行设置</div>
          </div>
        ) : (
          <div className="editing-area-wrap">
            <div className="editing-title">{CurEditItem.title}设置</div>
            <div className="editing-area">
              {CurEditItem.name == 'brandLogo' ? (
                <div className="editing-item">
                  <UploadImage
                    title={CurEditItem.title}
                    image={CurEditItem.image}
                    onChange={(data) => {
                      handlePageChange(data);
                    }}
                  />
                </div>
              ) : CurEditItem.name == 'navBarImage' ? (
                <div className="editing-item">
                  <UploadImage
                    title={CurEditItem.title}
                    image={CurEditItem.image}
                    onChange={(data) => {
                      handlePageChange(data);
                    }}
                  />
                </div>
              ) : CurEditItem.name == 'navBar' ? (
                <div className="editing-item">
                  <NavBarEdit />
                </div>
              ) : CurEditItem.name == 'wallet' ? (
                <>
                  <div className="editing-item">
                    <UploadImage
                      title="钱包（未登录状态）"
                      image={CurEditItem.image}
                      onChange={(data) => {
                        handlePageChange(data);
                      }}
                    />
                  </div>
                  <div className="editing-item">
                    <UploadImage
                      title="钱包（已登录状态）"
                      image={CurEditItem.image}
                      onChange={(data) => {
                        handlePageChange(data);
                      }}
                    />
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

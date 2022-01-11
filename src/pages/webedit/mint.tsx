import './style.less';
import UploadImage from '@/components/UploadImage/index.tsx';
import NavBarEdit from '@/components/NavBarEdit/index.tsx';
import SuspendedPos from '@/components/SuspendedPos/index.tsx';
import { useState } from 'react';
export default function Mint(params) {
  // 编辑区的状态：false 未编辑 true 编辑中
  const [EditAreaStatus, setEditAreaStatus] = useState(false);
  // 页面布局的数据
  const [PageInfo, setPageInfo] = useState({ CommonPageList: [{}] });
  // 当前编辑的模块
  const [CurEditItem, setCurEditItem] = useState({});
  const handlePageClick = (type, title, index) => {
    setEditAreaStatus(true);
    console.log(type, title);
    let temp;
    if (type == 'commonPage') {
      temp = PageInfo['CommonPageList'][index];
      temp = { ...temp, name: type, title: title, index: index };
    } else {
      temp = PageInfo[type]
        ? PageInfo[type]
        : (PageInfo[type] = {
            name: type,
            title: title,
            index: index,
          });
    }
    console.log('temp', temp);
    setCurEditItem({ ...temp });
  };
  const handlePageChange = (data, keyOfValue) => {
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
      case 'navBar':
        CurEditItem.navBarsList = data;
        console.log('CurEditItem', CurEditItem);
        setPageInfo({ ...PageInfo, navBar: CurEditItem });
        break;
      case 'wallet':
        CurEditItem[keyOfValue] = data;
        setPageInfo({ ...PageInfo, wallet: CurEditItem });
        break;
      case 'mainPage':
        CurEditItem.image = data;
        setPageInfo({ ...PageInfo, mainPage: CurEditItem });
        break;
      case 'suspendedPos':
        CurEditItem.suspendedPosList = data;
        setPageInfo({ ...PageInfo, suspendedPos: CurEditItem });
        break;
      case 'commonPage':
        CurEditItem.image = data;
        console.log('PageInfo', PageInfo);
        let list = PageInfo.CommonPageList;
        list[CurEditItem.index] = { ...CurEditItem };
        setPageInfo({ ...PageInfo, CommonPageList: list });
        break;
      default:
        break;
    }
  };
  const handleAddPageClick = () => {
    setPageInfo({
      ...PageInfo,
      CommonPageList: [...PageInfo.CommonPageList, {}],
    });
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
            {PageInfo.navBar &&
            PageInfo.navBar.navBarsList != undefined &&
            PageInfo.navBar.navBarsList[0].image ? (
              PageInfo.navBar.navBarsList.map((item) => {
                return (
                  <div
                    className="nav-bar"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageClick('navBar', '导航栏');
                    }}
                  >
                    <img style={{ width: '100%' }} src={item.image} alt="" />
                  </div>
                );
              })
            ) : (
              <div
                className="nav-bar"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageClick('navBar', '导航栏');
                }}
              >
                导航栏
              </div>
            )}
          </div>
          <div
            className="wallet"
            onClick={() => {
              handlePageClick('wallet', '钱包');
            }}
          >
            {PageInfo.wallet?.notLoginImg ? (
              <img
                src={PageInfo.wallet.notLoginImg}
                alt=""
                style={{ width: '100%' }}
              />
            ) : (
              <div className="wallet-btn">钱包</div>
            )}
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
          {PageInfo.mainPage?.image ? (
            <img
              src={PageInfo.mainPage.image}
              alt=""
              style={{ height: '100%' }}
            />
          ) : (
            <span className="title">主页面</span>
          )}
          <div className="suspended-pos-wrap">
            {PageInfo.suspendedPos &&
            PageInfo.suspendedPos.suspendedPosList != undefined &&
            PageInfo.suspendedPos.suspendedPosList[0].image ? (
              PageInfo.suspendedPos.suspendedPosList.map((item) => {
                return (
                  <div
                    className="suspended-pos"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageClick('suspendedPos', '悬浮位');
                    }}
                  >
                    <img
                      src={item.image}
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'block',
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <div
                className="suspended-pos"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageClick('suspendedPos', '悬浮位');
                }}
              >
                悬浮位
              </div>
            )}
          </div>
        </div>
        {PageInfo.CommonPageList?.length &&
          PageInfo.CommonPageList.map((item, index) => {
            return (
              <div
                className="common-page"
                onClick={() => {
                  console.log('index', index);
                  handlePageClick('commonPage', `页面${index + 1}`, index);
                }}
              >
                {item?.image ? (
                  <img
                    src={item.image}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                ) : (
                  <span className="title">{`页面${index + 1}`}</span>
                )}
              </div>
            );
          })}
        <div className="add-page-wrap">
          <div
            className="add-page-item"
            onClick={() => {
              handleAddPageClick();
            }}
          >
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
                  <NavBarEdit
                    navBarsList={CurEditItem.navBarsList}
                    onChange={(data) => {
                      handlePageChange(data);
                    }}
                  />
                </div>
              ) : CurEditItem.name == 'wallet' ? (
                <>
                  <div className="editing-item">
                    <UploadImage
                      title="钱包（未登录状态）"
                      image={CurEditItem.notLoginImg}
                      onChange={(data) => {
                        handlePageChange(data, 'notLoginImg');
                      }}
                    />
                  </div>
                  <div className="editing-item">
                    <UploadImage
                      title="钱包（已登录状态）"
                      image={CurEditItem.loginImg}
                      onChange={(data) => {
                        handlePageChange(data, 'loginImg');
                      }}
                    />
                  </div>
                </>
              ) : CurEditItem.name == 'mainPage' ? (
                <div className="editing-item">
                  <UploadImage
                    title="主页面"
                    image={CurEditItem.image}
                    onChange={(data) => {
                      handlePageChange(data);
                    }}
                  />
                </div>
              ) : CurEditItem.name == 'suspendedPos' ? (
                <div className="editing-item">
                  <SuspendedPos
                    suspendedPosList={CurEditItem.suspendedPosList}
                    onChange={(data) => {
                      handlePageChange(data);
                    }}
                  />
                </div>
              ) : CurEditItem.name == 'commonPage' ? (
                <div className="editing-item">
                  <UploadImage
                    title={CurEditItem.title}
                    image={CurEditItem.image}
                    onChange={(data) => {
                      handlePageChange(data, 'commonPage');
                    }}
                  />
                </div>
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

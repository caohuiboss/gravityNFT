import './index.less';
import UploadImage from '@/components/UploadImage/index.tsx';
import { Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
export default function NavBarEdit(props) {
  const { navBarsList, onChange } = props;
  const [Bars, setBar] = useState([{}]);
  const handleAddNavBar = () => {
    setBar([...Bars, {}]);
  };
  const handleSelectChange = (selectVal, index) => {
    Bars[index].skipPos = selectVal;
    setBar([...Bars]);
    onChange && onChange(Bars);
  };
  const handleInputChange = (inputVal, index) => {
    Bars[index].skipUrl = inputVal;
    setBar([...Bars]);
    onChange && onChange(Bars);
  };
  const handlePageChange = (imageVal, index) => {
    Bars[index].image = imageVal;
    setBar([...Bars]);
    onChange && onChange(Bars);
  };
  useEffect(() => {
    navBarsList && setBar(navBarsList);
    return () => {};
  }, [navBarsList]);
  return (
    <div className="nav-bar-edit-wrap">
      {Bars.map((item, index) => {
        return (
          <div className="bar-item" key={index}>
            <UploadImage
              title={`标题${index + 1}`}
              image={item.image}
              onChange={(data) => {
                handlePageChange(data, index);
              }}
            />
            <div className="skip-url">
              <div className="title">跳转地址</div>
              <div className="value">
                <Input
                  className="reset-input"
                  value={item.skipUrl}
                  onChange={(value) => {
                    handleInputChange(value.target.value, index);
                  }}
                />
              </div>
            </div>
            <div className="skip-pos">
              <div className="title">站内定位</div>
              <div className="value">
                <Select
                  className="reset-select"
                  value={item.skipPos}
                  onChange={(value) => {
                    handleSelectChange(value, index);
                  }}
                >
                  <Select.Option value="lucy">Lucy</Select.Option>
                </Select>
              </div>
            </div>
            <div className="liner"></div>
          </div>
        );
      })}
      <div
        className="add-bar-item"
        onClick={() => {
          handleAddNavBar();
        }}
      >
        <img src={require('@/static/img/s-add.png')} alt="" />
        <span className="title">添加标题</span>
      </div>
    </div>
  );
}

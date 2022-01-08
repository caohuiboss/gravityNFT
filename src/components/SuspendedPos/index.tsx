import './index.less';
import UploadImage from '@/components/UploadImage/index.tsx';
import { Input } from 'antd';
import React, { useState, useEffect } from 'react';
export default function SuspendedPos(props) {
  const { suspendedPosList, onChange } = props;
  const [SuspendedPos, setSuspendedPos] = useState([{}]);
  const handleAddNavBar = () => {
    setSuspendedPos([...SuspendedPos, {}]);
  };
  const handleInputChange = (inputVal, index) => {
    SuspendedPos[index].skipUrl = inputVal;
    setSuspendedPos([...SuspendedPos]);
    onChange && onChange(SuspendedPos);
  };
  const handlePageChange = (imageVal, index) => {
    SuspendedPos[index].image = imageVal;
    setSuspendedPos([...SuspendedPos]);
    onChange && onChange(SuspendedPos);
  };
  useEffect(() => {
    suspendedPosList && setSuspendedPos(suspendedPosList);
    return () => {};
  }, [suspendedPosList]);
  return (
    <div className="suspended-pos-wrap">
      {SuspendedPos.map((item, index) => {
        return (
          <div className="bar-item" key={index}>
            <UploadImage
              title={`悬浮位${index + 1}`}
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

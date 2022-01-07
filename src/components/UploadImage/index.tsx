import React, { useRef, useState } from 'react';
import './index.less';
export default function UploadImage() {
  const imgDom = useRef(null);
  const [ImgSrc, setImgSrc] = useState(null);
  const handlerImgChange = (e) => {
    e.preventDefault();
    const imgFile = e.target.files[0];
    // let formData  = new FormData(); //创建form对象
    // formData.append("imgs", e.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = function (result) {
      console.log('result', result);
      setImgSrc(result);
    };
  };
  const handleUploadClick = () => {
    console.log(imgDom);
    imgDom.current.click();
  };
  return (
    <div className="upload-image-wrap">
      <div className="title">导航背景</div>
      <div className="content">
        <div className="temp-image">
          <img src={require('@/static/img/img-stack.png')} />
        </div>
        <div className="right-wrap">
          <div className="upload-info">
            尺寸：1200x80px
            <br />
            格式：jpg、jpge、png
          </div>
          <div className="upload-btn">
            <img src={require('@/static/img/ic_upload.png')} />
            <input
              style={{
                display: 'none',
              }}
              ref={imgDom}
              type="file"
              id="file"
              accept="image/*"
              onChange={handlerImgChange}
            />
            <span onClick={handleUploadClick}>点击上传</span>
          </div>
        </div>
      </div>
    </div>
  );
}

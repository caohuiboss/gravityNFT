import React, { useRef, useState, useEffect } from 'react';
import './index.less';
export default function UploadImage(props) {
  const { image, onChange, title } = props;
  const imgDom = useRef(null);
  const [ImgSrc, setImgSrc] = useState(null);
  const handlerImgChange = (e) => {
    e.preventDefault();
    const imgFile = e.target.files[0];
    if (imgFile) {
      var reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.addEventListener(
        'load',
        function () {
          setImgSrc(reader.result);
          onChange && onChange(reader.result);
        },
        false,
      );
    }
  };
  const handleUploadClick = () => {
    console.log(imgDom);
    imgDom.current.click();
  };
  useEffect(() => {
    setImgSrc(image);
  }, [image]);
  return (
    <div className="upload-image-wrap">
      <div className="title">{title}图片</div>
      <div className="content">
        <div className="temp-image">
          {ImgSrc ? (
            <img style={{ width: '100%' }} src={ImgSrc} alt="" />
          ) : (
            <img src={require('@/static/img/img-stack.png')} />
          )}
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

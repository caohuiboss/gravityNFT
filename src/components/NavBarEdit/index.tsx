import './index.less';
import UploadImage from '@/components/UploadImage/index.tsx';
import { Input, Select } from 'antd';
export default function NavBarEdit(props) {
  return (
    <div className="nav-bar-edit-wrap">
      <div className="bar-item">
        <UploadImage />
        <div className="skip-url">
          <div className="title">跳转地址</div>
          <div className="value">
            <Input className="reset-input" />
          </div>
        </div>
        <div className="skip-pos">
          <div className="title">站内定位</div>
          <div className="value">
            <Select className="reset-select" defaultValue="lucy">
              <Option value="lucy">Lucy</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="liner"></div>
      <div className="add-bar-item">
        <img src={require('@/static/img/s-add.png')} alt="" />
        <span className="title">添加标题</span>
      </div>
    </div>
  );
}

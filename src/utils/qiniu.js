import qiniu from 'qiniu';
import { Qiniu } from './secret';

// qiniu.conf.ACCESS_KEY = Qiniu.AK;
// qiniu.conf.SECRET_KEY = Qiniu.SK;
const mac = new qiniu.auth.digest.Mac(Qiniu.AK, Qiniu.SK);
// 七牛那边的对应的bucket名称
const bucket = '';

export const getToken = () => {
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
  })
  return putPolicy.uploadToken(mac);
}

import { useModel } from 'umi';

export default () => {
  const { wallet, setWallet } = useModel({
    identity: null,
  });
  return {
    setWallet,
    wallet,
  };
};

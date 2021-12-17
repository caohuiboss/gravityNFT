import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: '/nft/mint' },
    {
      path: '/nft',
      component: '@/layout/index',
      routes: [{ path: '/nft/mint', component: '@/pages/nft/mint.js' }],
    },
    {
      path: '/domain',
      component: '@/layout/index',
      routes: [{ path: '/domain/mint', component: '@/pages/domain/mint.js' }],
    },
  ],
  fastRefresh: {},
});

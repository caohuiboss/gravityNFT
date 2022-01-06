import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: '/nft/mint' },
    {
      path: '/home',
      component: '@/layout/index',
      routes: [{ path: '/home/index', component: '@/pages/home/index.js' }],
    },
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
    {
      path: '/mynft',
      component: '@/layout/index',
      routes: [{ path: '/mynft/list', component: '@/pages/mynft/list.js' }],
    },
    {
      path: '/webedit',
      component: '@/layout/index',
      routes: [{ path: '/webedit/mint', component: '@/pages/webedit/mint.js' }],
    },
  ],
  fastRefresh: {},
});

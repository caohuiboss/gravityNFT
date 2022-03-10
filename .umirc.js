import { defineConfig } from 'umi';
export default defineConfig({
  outputPath: 'build',
  publicPath: './',
  history: { type: 'hash' },
  hash: true,
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
  ],
  fastRefresh: {},
});
//# sourceMappingURL=.umirc.js.map

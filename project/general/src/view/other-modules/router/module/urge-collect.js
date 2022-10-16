import Main from '_a/main';

export default {
  path: '/urge-collect',
  name: 'urge-collect',
  component: Main,
  meta: {
    icon: 'ios-aperture',
    title: '催收管理',
    showAlways: true,
  },
  children: [
    {
      path: 'urge-list',
      name: 'urge-list',
      meta: {
        title: '催收列表',
        // showAlways: true,
      },
      component: () => import ('_o/components/urge-collect/list/index.vue'),
    },
  ],
};

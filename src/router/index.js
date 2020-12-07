import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout'
Vue.use(Router)

export const asyncRoutes = [
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: 'compliance',
        title: 'compliance',
        code: 'customs:compliance:audit',
        component: () => import('../views/compliance'),
        name: 'compliance',
        meta: { title: '合规审核', icon: 'dashboard', affix: true }
      },
      {
        path: 'goodsData',
        title: 'goodsData',
        code: 'customs:goods:product',
        component: () => import('../views/goodData'),
        name: 'goodsData',
        meta: { title: '商品数据库', icon: 'dashboard', affix: true }
      }
    ]
  }
];

// mode: 'history', // require service support
const createRouter = () => new Router({
  routes: asyncRoutes,
  mode: 'history',
  base: !window.__POWERED_BY_QIANKUN__ ? '' : 'vue',
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

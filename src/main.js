import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import router from './router'
import {asyncRoutes} from '@/router/index'
import Router from 'vue-router'

Vue.use(ElementUI)
Vue.config.productionTip = false
let instance = null;
let router = null

function render(props = {}) {
  console.log(props)
  router = new Router({
    routes: asyncRoutes,
    mode: 'history',
    base: !window.__POWERED_BY_QIANKUN__ ? '' : 'vue',
  })

  //缓存实例化
  if (window.__POWERED_BY_QIANKUN__ && window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__) {
    const cachedInstance = window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__;

    // 从最初的Vue实例上获得_vnode
    const cachedNode =
      (cachedInstance.cachedInstance && cachedInstance.cachedInstance._vnode) ||
      cachedInstance._vnode;

    // 让当前路由在最初的Vue实例上可用
    router.apps.push(...cachedInstance.catchRoute.apps);

    instance = new Vue({
      router,
      render: () => cachedNode
    });

    // 缓存最初的Vue实例
    instance.cachedInstance = cachedInstance;

    router.onReady(() => {
      const { path } = router.currentRoute;
      const { path: oldPath } = cachedInstance.$router.currentRoute;
      // 当前路由和上一次卸载时不一致，则切换至新路由
      if (path !== oldPath) {
        cachedInstance.$router.push(path);
      }
    });
    instance.$mount('#son');
  } else {
    console.log('正常实例化');
    // 正常实例化
    instance = new Vue({
      el: '#son',
      router,
      render: h => h(App)
    });
  }

}
// 解决子项目不能独立访问的问题 根据访问来源，执行不同渲染方法
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
// 解决基础路径不正确的问题
if (window.__POWERED_BY_QIANKUN__) { // 动态添加publicPath
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
// 启动
export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

// 挂载
export async function mount(props) {
  console.log('vue', props);
  render(props);
}
// 卸载
export async function unmount() {
  console.log(instance)
  const cachedInstance = instance.cachedInstance || instance;
  window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__ = cachedInstance;
  const cachedNode = cachedInstance._vnode;
  if (!cachedNode.data.keepAlive) cachedNode.data.keepAlive = true;
  cachedInstance.catchRoute = {
    apps: [...instance.$router.apps]
  }
  instance.$destroy();
  router = null;
  instance.$router.apps = [];
}

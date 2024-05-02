import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/podterminal',
    component: Layout,
    // hidden: true,
    children: [{
      path: 'index',
      name: 'PodTerminal',
      component: () => import('@/components/Terminal/PodTerminal')
      // meta: { title: 'Terminal', icon: 'dashboard' }
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: ' 首页', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/monitor',
    component: Layout,
    children: [{
      path: '/index',
      name: 'Monitor',
      component: () => import('@/views/monitor/index'),
      meta: { title: '资源监控', icon: 'dashboard' }
    }]
  },

  { path: '/node',
    component: Layout,
    redirect: '/node',
    children: [{
      path: '/node',
      name: 'Node',
      component: () => import('@/views/node/index'),
      meta: { title: ' 主机管理', icon: 'el-icon-s-platform' }
    }]
  },
  { path: '/namespace',
    component: Layout,
    redirect: '/namespace',
    children: [{
      path: '/namespace',
      name: 'Namespace',
      component: () => import('@/views/namespace/index'),
      meta: { title: ' 工作空间', icon: 'el-icon-s-help' }
    }]
  },
  { path: '/storage',
    component: Layout,
    redirect: '/storage',
    children: [{
      path: '/storage',
      name: 'Storage',
      component: () => import('@/views/namespace/index'),
      meta: { title: ' 存储管理', icon: 'el-icon-s-help' }
    }]
  },
  { path: '/docker',
    component: Layout,
    redirect: '/docker',
    children: [{
      path: '/docker',
      name: 'Docker',
      component: () => import('@/views/docker/index'),
      meta: { title: ' 镜像管理', icon: 'el-icon-s-help' }
    }]
  },
  {
    path: '/app',
    component: Layout,
    redirect: '/deployment',
    name: 'App',
    // meta: { title: ' 应用管理', icon: 'el-icon-s-grid' },
    children: [
      {
        path: '/deployment',
        name: 'Deployment',
        component: () => import('@/views/deploy/index'),
        meta: { title: ' 应用管理', icon: 'el-icon-s-grid' },
        // meta: { title: '无状态应用', icon: 'el-icon-data-line' }
      },
      // {
      //   path: '/statefulSet',
      //   name: 'StatefulSet',
      //   component: () => import('@/views/statefulSet/index'),
      //   meta: { title: '有状态应用', icon: 'el-icon-data-analysis' }
      // },
      // {
      //   path: '/job',
      //   name: 'Job',
      //   component: () => import('@/views/job/index'),
      //   meta: { title: '一次性任务', icon: 'el-icon-data-board' }
      // }
    ]
  },

  {
    path: '/users',
    component: Layout,
    redirect: '/users/user',
    name: 'Users',
    meta: { title: '用户管理', icon: 'tree' },
    children: [
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: '分组', icon: 'user' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户', icon: 'user' }
      }
    ]
  },

  // {
  //   path: '/log',
  //   component: Layout,
  //   redirect: '/log/login-log',
  //   name: 'Log',
  //   meta: { title: '日志管理', icon: 'tree' },
  //   children: [
  //     {
  //       path: 'login-log',
  //       name: 'Login-log',
  //       component: () => import('@/views/sys-login-log/index'),
  //       meta: { title: '登录日志', icon: '' }
  //     },
  //     {
  //       path: 'oper-log',
  //       name: 'Oper-log',
  //       component: () => import('@/views/sys-login-log/index'),
  //       meta: { title: '操作日志', icon: '' }
  //     },
  //     {
  //       path: 'run-log',
  //       name: 'Run-log',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '系统日志', icon: '' }
  //     }
  //   ]
  // },

  {
    path: '/terminal',
    component: Layout,
    // hidden: true,
    children: [{
      path: 'index',
      name: 'Terminal',
      component: () => import('@/components/Terminal/index'),
      meta: { title: '终端', icon: 'terminal_icon' }
    }]
  },

  {
    path: 'external-link',
    component: Layout,
    name: 'ExternalLink',
    meta: { title: '关于', icon: 'link' },
    children: [
      {
        path: 'https://github.com/fanb129/Kube-CC',
        meta: { title: 'Kube-CC', icon: 'link' }
      },
      {
        path: 'https://github.com/fanb129/Kube-CC_vue',
        meta: { title: 'Kube-CC_vue', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

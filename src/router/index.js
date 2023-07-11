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
      meta: { title: 'Dashboard', icon: 'el-icon-s-home' }
    }]
  },
  { path: '/主机',
    component: Layout,
    redirect: '/主机',
    children: [{
      path: '主机',
      name: '主机',
      component: () => import('@/views/node/index'),
      meta: { title: '主机', icon: 'el-icon-s-platform' }
    }]
  },
  { path: '/工作空间',
    component: Layout,
    redirect: '/工作空间',
    children: [{
      path: '/工作空间',
      name: '工作空间',
      component: () => import('@/views/namespace/index'),
      meta: { title: '工作空间', icon: 'el-icon-s-help' }
    }]
  },
  {
    path: '/应用',
    component: Layout,
    redirect: '/应用',
    name: '应用',
    meta: { title: '应用', icon: 'el-icon-s-grid' },
    children: [
      {
        path: '/内置模板',
        component: () => import('@/layout/index2'),
        redirect: '/内置模板',
        name: '内置模板',
        meta: { title: '内置模板', icon: 'el-icon-s-unfold' },
        children: [
          {
            path: 'spark',
            name: 'Spark',
            component: () => import('@/views/spark/index'),
            meta: { title: 'Spark', icon: 'el-icon-magic-stick' }
          },
          {
            path: 'hadoop',
            name: 'Hadoop',
            component: () => import('@/views/hadoop/index'),
            meta: { title: 'Hadoop', icon: 'el-icon-connection' }
          },
          {
            path: '云主机',
            name: '云主机',
            component: () => import('@/views/linux/index'),
            meta: { title: '云主机', icon: 'el-icon-monitor' }
          }
        ]
      },
      {
        path: '/自定义应用',
        component: () => import('@/layout/index2'),
        redirect: '/自定义应用',
        name: '自定义应用',
        meta: { title: '自定义应用', icon: 'el-icon-s-unfold' },
        children: [
          {
            path: '无状态应用',
            name: '无状态应用',
            component: () => import('@/views/deploy/index'),
            meta: { title: '无状态应用', icon: 'el-icon-data-line' }
          },
          {
            path: '有状态应用',
            name: '有状态应用',
            component: () => import('@/views/statefulSet/index'),
            meta: { title: '有状态应用', icon: 'el-icon-data-analysis' }
          }
        ]
      }
      /* children1: [
      {
        path: 'yaml',
        name: 'Yaml',
        component: () => import('@/views/yaml/index'),
        meta: { title: 'Yaml', icon: 'el-icon-upload' }
      },
       {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/service/index'),
        meta: { title: 'Service', icon: 'dashboard' }
      },
      {
        path: 'pod',
        name: 'Pod',
        component: () => import('@/views/pod/index'),
        meta: { title: 'Pod', icon: 'dashboard' }
      }*/
    ]
  },

  {
    path: '/users',
    component: Layout,
    redirect: '/users/user',
    name: 'Users',
    meta: { title: 'Users', icon: 'tree' },
    children: [
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: 'Group', icon: 'user' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: 'User', icon: 'user' }
      }
    ]
  },

  {
    path: '/terminal',
    component: Layout,
    // hidden: true,
    children: [{
      path: 'index',
      name: 'Terminal',
      component: () => import('@/components/Terminal/index'),
      meta: { title: 'Terminal', icon: 'terminal_icon' }
    }]
  },

  {
    path: 'external-link',
    component: Layout,
    name: 'ExternalLink',
    meta: { title: 'About', icon: 'link' },
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

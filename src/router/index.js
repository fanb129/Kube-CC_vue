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

  {
    path: '/kubernetes',
    component: Layout,
    redirect: '/kubernetes/node',
    name: 'Kubernetes',
    meta: { title: 'Kubernetes', icon: 'tree' },
    children: [
      {
        path: 'yaml',
        name: 'Yaml',
        component: () => import('@/views/yaml/index'),
        meta: { title: 'Yaml', icon: 'el-icon-upload' }
      },
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/node/index'),
        meta: { title: 'Node', icon: 'dashboard' }
      },
      {
        path: 'namespace',
        name: 'Namespace',
        component: () => import('@/views/namespace/index'),
        meta: { title: 'Namespace', icon: 'dashboard' }
      },
      {
        path: 'deploy',
        name: 'Deploy',
        component: () => import('@/views/deploy/index'),
        meta: { title: 'Deploy', icon: 'dashboard' }
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
      }
    ]
  },

  // {
  //   path: '/user',
  //   component: Layout,
  //   // redirect: '/user',
  //   children: [{
  //     path: 'index',
  //     name: 'User',
  //     component: () => import('@/views/user/index'),
  //     meta: { title: 'User', icon: 'user' }
  //   }]
  // },

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

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  {
    path: '/spark',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'Spark',
      component: () => import('@/views/spark/index'),
      meta: { title: 'Spark', icon: 'dashboard' }
    }]
  },

  {
    path: '/image',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'Image',
      component: () => import('@/views/docker/index'),
      meta: { title: 'Image', icon: 'dashboard' }
    }]
  },

  {
    path: '/hadoop',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'Hadoop',
      component: () => import('@/views/hadoop/index'),
      meta: { title: 'Hadoop', icon: 'dashboard' }
    }]
  },

  {
    path: '/linux',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'Linux',
      component: () => import('@/views/linux/index'),
      meta: { title: 'Linux', icon: 'dashboard' }
    }]
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

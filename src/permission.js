import router, {clearRouter, clearRoutes, constantRoutes, resetRouter} from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from "@/layout";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register', '/findPass'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.role
      if (hasGetUserInfo !== 0) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          // 根据用户角色动态添加路由
          const role = store.getters.role
          // 根据用户角色动态添加路由
          // const userRouter = {
          //   path: '/users',
          //   component: Layout,
          //   redirect: '/users/user',
          //   name: 'Users',
          //   meta: { title: '用户管理', icon: 'user' },
          //   children: [
          //     {
          //       path: 'group',
          //       name: 'Group',
          //       component: () => import('@/views/group/index'),
          //       meta: { title: '分组', icon: 'tree'}
          //     },
          //     {
          //       path: 'user',
          //       name: 'User',
          //       component: () => import('@/views/user/index'),
          //       meta: { title: '用户', icon: 'user' }
          //     }
          //   ]
          // }
          // const nodeRouter = {
          //   path: '/node',
          //   component: Layout,
          //   redirect: '/node',
          //   children: [
          //     {
          //       path: '/node',
          //       name: 'Node',
          //       component: () => import('@/views/node/index'),
          //       meta: { title: '主机管理', icon: 'el-icon-s-platform' }
          //     }
          //   ]
          // }
          if(role === 3){
            // constantRoutes.splice(1,0,nodeRouter)
            constantRoutes[1].hidden = false
            constantRoutes[2].hidden = false
          }
          if(role >= 2){
            // constantRoutes.splice(1, 0, userRouter)
            constantRoutes[3].hidden = false
          }
          resetRouter()
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

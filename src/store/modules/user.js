import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    role: 0,
    u_id: 0,
    username: '',
    email: '',
    g_id: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state,username) => {
    state.username = username
  },
  SET_UID: (state, uid) => {
    state.u_id = uid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_GID: (state, gid) => {
    state.g_id = gid
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {usernameoremail, password} = userInfo
    return new Promise((resolve, reject) => {
      login({usernameoremail: usernameoremail.trim(), password: password}).then(response => {
        const {token} = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        console.log('err')
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        if (!response) {
          return reject('Verification failed, please Login again.')
        }

        const {nickname, username ,avatar, role, id, email, gid} = response.user_info
        commit('SET_NAME', nickname)
        commit('SET_USERNAME', username)
        commit('SET_UID', id)
        // 暂时用统一指定头像
        // commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        commit('SET_EMAIL', email)
        commit('SET_GID', gid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        console.log('err')
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


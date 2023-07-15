import { getGroupInfo } from '@/api/group'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getGroupDefaultState = () => {
  return {
    name: '',
    ad_id: 0,
    description: ''
  }
}

const state = getGroupDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getGroupDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ADID: (state, adid) => {
    state.ad_id = adid
  },
  SET_DESCRIPTION: (state, description) => {
    state.description = description
  }
}

const actions = {
  // get group info
  getGroupInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getGroupInfo().then(response => {
        if (!response) {
          return reject('Verification failed, please Login again.')
        }

        const { name, adid, description } = response.group_info
        commit('SET_NAME', name)
        commit('SET_ADID', adid)
        commit('SET_DESCRIPTION', description)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


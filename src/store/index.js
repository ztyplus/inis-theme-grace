import { createStore } from 'vuex'

import state     from './state'
import getters   from './getters'
import mutations from './mutations'
import actions   from './actions'

export default createStore({
  state,
  getters, 
  mutations,
  actions,
  modules: {},
})


// state 管理组件数据，管理的数据是响应式的，当数据改变时驱动视图更新。
// getters 相当于组件中的 computed 方法
// mutations 更新数据，state中的数据只能使用mutations去改变数据（只能处理同步的场景）
// actions 请求数据，响应成功后把数据提交给mutations（可以处理异步的场景）
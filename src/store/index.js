import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 侧边栏伸缩状态
    side_state: false,
    side_width: "300px",
    side_class: "ui-side-logo",
    // 侧边栏选中
    side_select: "",
    // 登录用户权限列表
    power_list: "",
		$username:'' //用户名称
  }
})

export default store

import Vue from 'vue'
import App from './App'
import router from './router'                       // 01.引入router.js ( 路由 )
import store from "./store"                         // 02.引入store.js ( 全局参数 )
import VueResource from 'vue-resource'              // 03.引入resource.js ( 读取json )
import VueCookies from 'vue-cookies'                // 04.引入cookies.js ( Cookies )
import Element from 'element-ui'                    // 05.引入Element ( UI主题 )
import 'element-ui/lib/theme-chalk/index.css'       // 06.引入Element ( 自定义主题 )
import 'element-ui/lib/theme-chalk/display.css'     // 07.引入Element ( 自定义主题 )
import '../static/css/theme/index.css'              // 08.引入CSS ( 个性化Css )
import '../static/css/default.css'                  // 09.引入CSS ( 个性化Css )
import '../static/css/ionicons/css/ionicons.css'    // 10.引入IonIcons CSS ( IonIcons CSS )
import Header from "@/components/common/header"     // 11.引入Header ( 公共Header头部 )
import Side from "@/components/common/side"         // 12.引入Side ( 公共Side侧边栏 )

// 时间格式化
Vue.filter('dateFormat',function(originVal){
	const dt = new Date(originVal)
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2,'0')
	const d = (dt.getDate() + '').padStart(2,'0')
	const hh = (dt.getHours() + '').padStart(2,'0')
	const mm = (dt.getMinutes() + '').padStart(2,'0')
	const ss = (dt.getSeconds() + '').padStart(2,'0')
	return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})

//引入动态数字
import VueAnimateNumber from 'vue-animate-number'
Vue.use(VueAnimateNumber)

//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)

import '../static/css/common.css'  //引入自定义类库

// 00.阻止vue启动生产消息    开启（ true ）   关闭（ false ）
Vue.config.productionTip = true

Vue.prototype.$api_url = "http://127.0.0.1:8000"


// 06.设置页面Title
let WebTitle = "临汾市人民医院"
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = WebTitle + " - " + to.meta.title
  } else {
    document.title = WebTitle
  }
  next()
})


Vue.use(Element)
Vue.use(VueResource)
Vue.use(VueCookies)
// 引入通用Header
Vue.use(Header)
Vue.component('Header', Header)
// 引入通用Side
Vue.use(Side)
Vue.component('Side', Side)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App, Header, Side},
  render: h => h(App)
})

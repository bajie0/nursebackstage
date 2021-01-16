import Vue from "vue" // 00.引入vue
import Router from "vue-router" // 01.引入vue-index
import cookies from "vue-cookies"
import store from "@/store/index"
import {
	ApiData
} from "@/axios/axios";

Vue.use(Router)

const router = new Router({
	mode: "history",
	base: __dirname,
	routes: [{
			path: "/login",
			component: () => import("../components/login"),
			meta: {
				title: "平台登录页"
			}
		},
		{
			path: "/index",
			component: () => import("../components/index"),
			meta: {
				title: "数据中控平台"
			}
		},
		{
			path: "/column/add_column",
			component: () => import("../components/column/add_column"),
			meta: {
				title: "新增栏目"
			}
		},
		{
			path: "/column/data_column",
			component: () => import("../components/column/data_column"),
			meta: {
				title: "栏目管理"
			}
		},
		{
			path: "/classification/add_classification",
			component: () => import("../components/classification/add_classification"),
			meta: {
				title: "新增上门分类"
			}
		},
		{
			path: "/classification/data_classification",
			component: () => import("../components/classification/data_classification"),
			meta: {
				title: "上门分类管理"
			}
		},
		{
			path: "/introduction/add_introduction",
			component: () => import("../components/introduction/add_introduction"),
			meta: {
				title: "新增项目介绍标题"
			}
		},
		{
			path: "/introduction/data_introduction",
			component: () => import("../components/introduction/data_introduction"),
			meta: {
				title: "项目介绍标题管理"
			}
		},
		{
			path: "/specification/add_specification",
			component: () => import("../components/specification/add_specification"),
			meta: {
				title: "新增规格"
			}
		},
		{
			path: "/specification/data_specification",
			component: () => import("../components/specification/data_specification"),
			meta: {
				title: "规格管理"
			}
		},
		{
			path: "/supplies/add_supplies",
			component: () => import("../components/supplies/add_supplies"),
			meta: {
				title: "新增耗材"
			}
		},
		{
			path: "/supplies/data_supplies",
			component: () => import("../components/supplies/data_supplies"),
			meta: {
				title: "耗材管理"
			}
		},
		{
			path: "/project/add_project",
			component: () => import("../components/project/add_project"),
			meta: {
				title: "新增上门项目"
			}
		},
		{
			path: "/project/data_project",
			component: () => import("../components/project/data_project"),
			meta: {
				title: "上门项目管理"
			}
		},
		{
			path: "/interface/bigpicture",
			component: () => import("../components/interface/bigpicture"),
			meta: {
				title: "首页大图管理"
			}
		},
		{
			path: "/nurse/add_nurse",
			component: () => import("../components/nurse/add_nurse"),
			meta: {
				title: "新增上门护士"
			}
		},
		{
			path: "/nurse/data_nurse",
			component: () => import("../components/nurse/data_nurse"),
			meta: {
				title: "上门护士管理"
			}
		},
		{
			path: "/assignment/data_appointment",
			component: () => import("../components/assignment/data_appointment"),
			meta: {
				title: "病人预约管理"
			}
		},
		{
			path: "/assignment/data_assignment",
			component: () => import("../components/assignment/data_assignment"),
			meta: {
				title: "护士分配管理"
			}
		},
		{
			path: "/order/data_order",
			component: () => import("../components/order/data_order"),
			meta: {
				title: "订单管理"
			}
		},
		{
			path: "/order/data_workload",
			component: () => import("../components/order/data_workload"),
			meta: {
				title: "护士工作量统计"
			}
		},
		{
			path: "/user-config",
			component: () => import("../components/default/user_config"),
			meta: {
				title: "用户设置"
			}
		},
		{
			path: "/admin/add-power",
			component: () => import("../components/admin/add_power"),
			meta: {
				title: "新增权限"
			}
		},
		{
			path: "/admin/patch-power",
			component: () => import("../components/admin/add_power"),
			meta: {
				title: "修改权限"
			}
		},
		{
			path: "/admin/data-power",
			component: () => import("../components/admin/data_power"),
			meta: {
				title: "权限管理"
			}
		},

		{
			path: "/admin/add-role",
			component: () => import("../components/admin/add_role"),
			meta: {
				title: "新增角色"
			}
		},
		{
			path: "/admin/patch-role/:role_id",
			component: () => import("../components/admin/add_role"),
			meta: {
				title: "修改角色"
			}
		},
		{
			path: "/admin/data-role",
			component: () => import("../components/admin/data_role"),
			meta: {
				title: "角色管理"
			}
		},

		{
			path: "/admin/add-admin",
			component: () => import("../components/admin/add_admin"),
			meta: {
				title: "新增管理员"
			}
		},
		{
			path: "/admin/patch-admin/:admin_id",
			component: () => import("../components/admin/add_admin"),
			meta: {
				title: "修改管理员"
			}
		},
		{
			path: "/admin/data-admin",
			component: () => import("../components/admin/data_admin"),
			meta: {
				title: "管理员管理"
			}
		},

		{
			path: "/admin/log-admin",
			component: () => import("../components/admin/log_admin"),
			meta: {
				title: "管理员登录日志"
			}
		},

		{
			path: "/config/add-basics",
			component: () => import("../components/config/add_basics"),
			meta: {
				title: "新增全局字典"
			}
		},
		{
			path: "/config/patch-basics/:basics_id",
			component: () => import("../components/config/add_basics"),
			meta: {
				title: "修改全局字典"
			}
		},
		{
			path: "/config/data-basics",
			component: () => import("../components/config/data_basics"),
			meta: {
				title: "全局字典管理"
			}
		},

		{
			path: "/business/add-organize",
			component: () => import("../components/business/add_organize"),
			meta: {
				title: "新增组织"
			}
		},
		{
			path: "/business/patch-organize/:organize_id",
			component: () => import("../components/business/add_organize"),
			meta: {
				title: "修改组织"
			}
		},
		{
			path: "/business/data-organize",
			component: () => import("../components/business/data_organize"),
			meta: {
				title: "组织管理"
			}
		},
		{
			path: "/business/relation-organize",
			component: () => import("../components/business/relation_organize"),
			meta: {
				title: "组织架构"
			}
		},

		{
			path: "",
			redirect: "/index"
		}, // 可以配置重定向
		{
			path: "",
			component: () => import("../components/index")
		} // 或者重新写个路径为空的路由
	]
})

// 检测页面是否存在token，如果不存在返回login

router.beforeEach((to, from, next) => {
	if (to.path === "/login") {
		next()
	} else {
		let token = cookies.get('token')
		if (token === null || token === '' || token === undefined) {
			next('/login')
		} else {
			store.state.side_select = to.path
			// 获取页面权限json
			if(!store.state.power_list){
				let url = "/api/get/power_authority/"
				ApiData(url).then((response) => {
					console.log(response.power_data)
					store.state.power_list = response.power_data
				})
			}
			
			// 进入页面
			next()
		}
	}
})

export default router

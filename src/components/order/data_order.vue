<template>
	<el-container>
		<!-- 侧边栏 start -->
		<el-aside :width="this.$store.state.side_width">
			<Side></Side>
		</el-aside>
		<!-- 侧边栏 end -->
		<el-container>
			<!-- 置顶栏 start -->
			<el-header>
				<Header></Header>
			</el-header>
			<!-- 置顶栏 end -->
			<!-- 内容栏 start -->
			<el-main>
				<div class="ui-container">
					<div class="ui-container-header">
						<h2><i class="ion-ios-arrow-forward"></i>订单管理</h2>
						<p>对平台的订单相关信息进行添加、修改、导入、导出等系统操作。</p>
						<div class="ui-container-header-group">
							<el-dropdown @command="operate_download">
								<el-button><i class="ion-ios-cloud-download"></i>导出</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="operate_download_all">批量导出</el-dropdown-item>
									<el-dropdown-item command="operate_download_part">导出所选</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div>
					<!-- moresearch start -->
					<div class="ui-container-content">
						<div :class="more_link?'ui-container-table-search height':'ui-container-table-search'">
							<el-row>
								<el-col :span="6">
									<div class="ui-container-table-search-quick">
										<i class="ion-ios-search"></i>
										<el-input v-model="search_input" placeholder="订单号..." @input="searchQuick" clearable></el-input>
									</div>
								</el-col>
							</el-row>
						</div>
						<!-- moresearch end -->

						<!-- Table start -->
						<div class="ui-container-table-content">
							<div class="ui-container-table-list">
								<el-table :data="tableData" height="100%" style="width: 100%" @selection-change="selection_change"
								 tooltip-effect="dark" v-loading="isloading">
									<el-table-column fixed type="selection" width="40"></el-table-column>
									<el-table-column type="expand" width="40">
										<template slot-scope="props">
											<table class="ordertable">
												<tr>
													<td>病人姓名:</td>
													<td>{{`${props.row.patientinfo.name}:${props.row.patientinfo.phonenum}`}}</td>
													<td>上门护士姓名:</td>
													<td>{{props.row.patientinfo.nursename? `${props.row.patientinfo.nursename}:${props.row.patientinfo.nursephone}`:'暂无'}}</td>
												</tr>
												<tr>
													<td>预约项目:</td>
													<td>{{props.row.patientinfo.itemname}}</td>
													<td>规格:</td>
													<td>{{props.row.patientinfo.size}}</td>
												</tr>
												<tr>
													<td>交通费:</td>
													<td>{{props.row.patientinfo.transportation}}元</td>
													<td>总费用:</td>
													<td>{{props.row.patientinfo.toltal}}元</td>
												</tr>
												<tr v-if="props.row.hasOwnProperty('expand') && props.row.expand.hasOwnProperty('rejectiontext')">
													<td>驳回原因:</td>
													<td colspan="3">{{props.row.expand.rejectiontext}}</td>
												</tr>
												<tr v-if="props.row.hasOwnProperty('expand') && props.row.expand.hasOwnProperty('nurserejecte')">
													<td>护士拒单原因:</td>
													<td colspan="3">{{props.row.expand.nurserejecte}}</td>
												</tr>
												<tr v-if="props.row.hasOwnProperty('expand') && props.row.expand.hasOwnProperty('interruption')">
													<td>订单终止原因:</td>
													<td colspan="3">{{props.row.expand.interruption}}</td>
												</tr>
											</table>
										</template>
									</el-table-column>
									<el-table-column prop="ordernum" label="订单号"></el-table-column>
									<el-table-column prop="paystate" label="支付状态" sortable>
										<div slot-scope="data">
											<el-tag type="success" v-if="data.row.paystate == 1">已支付</el-tag>
											<el-tag type="danger" v-if="data.row.paystate == 2">退款中</el-tag>
											<el-tag type="info" v-if="data.row.paystate == 3">已退款</el-tag>
										</div>
									</el-table-column>
									<el-table-column prop="schedule" label="订单进度" sortable  width="400">
										<div slot-scope="data">
											<el-progress :stroke-width="20" :percentage="10" :format="stateformat" v-if="data.row.schedule == 1" text-inside></el-progress>
											<el-progress :stroke-width="20" status="warning" :percentage="20" :format="stateformat" v-if="data.row.schedule == 2" text-inside></el-progress>
											<el-progress :stroke-width="20" :percentage="30" :format="stateformat" v-if="data.row.schedule == 3" text-inside></el-progress>
											<el-progress :stroke-width="20" status="warning" :percentage="40" :format="stateformat" v-if="data.row.schedule == 4" text-inside></el-progress>
											<el-progress :stroke-width="20" :percentage="50" :format="stateformat" v-if="data.row.schedule == 5" text-inside></el-progress>
											<el-progress :stroke-width="20" :percentage="60" :format="stateformat" v-if="data.row.schedule == 6" text-inside></el-progress>
											<el-progress :stroke-width="20" :percentage="70" :format="stateformat" v-if="data.row.schedule == 7" text-inside></el-progress>
											<el-progress :stroke-width="20" status="warning" :percentage="80" :format="stateformat" v-if="data.row.schedule == 8" text-inside></el-progress>
											<el-progress :stroke-width="20" :percentage="90" :format="stateformat" v-if="data.row.schedule == 9" text-inside></el-progress>
											<el-progress :stroke-width="20" :percentage="100" :format="stateformat" v-if="data.row.schedule == 10" text-inside></el-progress>
										</div>
									</el-table-column>
									<el-table-column prop="timechange" label="末次更新"></el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">
											<el-button class="ui-primary" v-if="scope.row.paystate != 3" @click="refund(scope.row.schedule)">退全款</el-button>
											<el-button class="ui-primary" v-if="scope.row.paystate == 3" @click="deleorder">删除订单</el-button>
											<el-button class="ui-primary" v-if="scope.row.schedule > 5" @click="refundpart(scope.row.schedule)">部分退款</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="ui-container-table-page">
							<el-pagination @size-change="size_change" @current-change="current_change" :current-page="table_page"
							 :page-sizes="page_sizes" :page-size="page_size" layout="sizes, prev, pager, next, jumper, total" :total="table_total"
							 background></el-pagination>
						</div>
					</div>
					<!-- Table end -->
				</div>
			</el-main>
			<!-- 内容栏 end -->
		</el-container>
	</el-container>
</template>
<script>
	import {
		ApiData,
		ApiCreate,
		ApiPatch,
		ApiDelete,
		ApiUpload,
		ApiDownload,
		ApiState
	} from '@/axios/axios'
	import axios from 'axios'

	export default {
		data() {
			return {
				//订单状态筛选数组
				statefilter: [{
						text: '新订单',
						value: '1'
					}, {
						text: '已驳回',
						value: '2'
					}, {
						text: '待分配',
						value: '3'
					}, {
						text: '重分配',
						value: '4'
					},
					{
						text: '待响应',
						value: '5'
					}, {
						text: '待出发',
						value: '6'
					}, {
						text: '行程中',
						value: '7'
					}, {
						text: '已中断',
						value: '8'
					},
					{
						text: '服务中',
						value: '9'
					}, {
						text: '已完成',
						value: '10'
					}, {
						text: '待分配',
						value: '3'
					}
				],
				isloading: true,
				tableData: [],
				// Form表单设置
				labelSearchPosition: 'top', // 文字朝向
				labelSearchWidth: '100px', // label宽度
				searchForm: {
					table_page: "",
					page_size: "",
					search_input: "",
					// 更多查询
					power_type: "",
					shool: "",
					identitynum: "",
					power_state: "",
					name: "",
					licensenum: "",
					worktime: ""
				},
				// 列表显示方式
				display_mode: "list",
				more_link: false,
				// 快捷搜索
				search_input: '',
				// Table数据

				multipleSelection: [],
				multipleTable: '',
				// 加载中组件
				loading: true,
				// 分页栏目-当前页
				table_page: 1,
				// 分页栏目-数据总量
				table_total: 4000,
				// 分页-每页数量条数
				page_sizes: [20, 50, 100, 200],
				// 分页-分页条数
				page_size: 20,
				// 权限分类筛选
				power_type: [{
					text: '系统级',
					value: 1
				}, {
					text: '页面级',
					value: 2
				}, {
					text: '功能级',
					value: 3
				}],
				// 审核筛选
				power_state: [{
					text: '通过',
					value: true
				}, {
					text: '待审',
					value: false
				}],
				// 上级权限
				power_data: [],
			}
		},
		created() {
			this.getorderstatedata()
			// this.getTableJson(this.searchForm)
			// this.getPowerJson()
		},
		methods: {
			//进度条百分比转文字
			stateformat(percentage) {
				if(percentage == 10) return '新订单'
				if(percentage == 20) return '已驳回'
				if(percentage == 30) return '待分配'
				if(percentage == 40) return '重分配'
				if(percentage == 50) return '待响应'
				if(percentage == 60) return '待出发'
				if(percentage == 70) return '行程中'
				if(percentage == 80) return '已中断'
				if(percentage == 90) return '服务中'
				if(percentage == 100) return '已完成'
			},
			//获取订单状态列表
			async getorderstatedata() {
				let {
					data: res
				} = await axios('/static/json/orderstate.json')
				this.tableData = res.data
				setTimeout(() => {
					this.isloading = false
				}, 1000)
			},
			// 01.搜索栏目 - 更多
			MoreLink() {
				this.more_link = !this.more_link
			},
			// 02.更多Form查询
			searchSubmit() {
				this.getTableJson()
				this.more_link = !this.more_link
			},
			// 03.更多Form重置
			searchReset(searchForm) {
				this.$refs[searchForm].resetFields()
				this.getTableJson()
				this.more_link = !this.more_link
			},
			// 04.快捷Form查询
			searchQuick() {
				this.getTableJson(this.table_page, this.page_size, this.searchForm, this.search_input)
			},
			// 05.全选数据
			selection_change(val) {
				this.multipleTable = []
				this.multipleSelection = val
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.multipleTable = this.multipleTable + ',' + this.multipleSelection[i]['id']
				}
				if (this.multipleTable.length === 0) {
					this.multipleTable = ""
				} else {
					this.multipleTable = this.multipleTable.substr(1)
				}
			},
			// 06.分页栏目-分页数
			size_change(val) {
				this.page_size = val
				this.getTableJson()
			},
			// 07.分页栏目-跳转页
			current_change(val) {
				this.table_page = val
				this.getTableJson()
			},
			// 08.引入TableJson
			getTableJson() {
				let url = "/api/get/power_list/"
				this.searchForm.table_page = this.table_page
				this.searchForm.page_size = this.page_size
				this.searchForm.quick_search = this.search_input
				ApiData(url, this.searchForm).then((response) => {
					this.tableData = response.data
					this.page_size = response.page_size
					this.table_total = response.table_total
					this.table_page = response.table_page
					this.loading = false
				})
			},
			// 09.Table数据 - 退款
			refund(data) {
				if(data <= 5) return this.$confirm("确认退款吗？").then(()=>{
					this.$message.success('退款成功')
				})
				if(data > 5) return this.$confirm("行程正在进行，确认退款操作吗？","确认退款？").then(()=>{
					this.$message.success('退款成功')
				})
			},
			//部分退款  不退来回交通费
			refundpart(){
				this.$confirm("确认退款吗？交通费不予退").then(()=>{
					this.$message.success('退款成功')
				})
			},
			//删除订单
			deleorder(){
				this.$confirm("确认删除该订单吗？").then(()=>{
					this.$message.success('删除成功')
				})
			},
			// 10.Table数据 - 删除操作
			handle_delete(row) {
				this.$confirm("是否删除该数据？", "系统提示", {
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					let url = "/api/delete/power/"
					let params = {
						"id": row.id
					}
					ApiDelete(url, params).then((response) => {
						this.$message.success(response)
						this.getTableJson()
					})
				});
			},
			// 11.Table数据 - 开关操作
			changeSwitch($event, row) {
				let url = "/api/state/power/"
				let params = {
					"id": row,
					"state": $event
				}
				ApiState(url, params).then((response) => {
					this.$message.success(response)
					this.getTableJson()
				})
			},

			// 13.批量下载
			operate_download(command) {
				if (command === 'operate_download_all') {
					this.$confirm("是否导出全部数据？", "系统提示", {
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						let url = "/api/download/power_all/"
						ApiDownload(url).then((response) => {
							this.$message.success(response.message)
							window.location.href = this.$api_url + response.path
						})
					})
				}
				if (command === 'operate_download_part') {
					if (this.multipleTable.length === 0) {
						this.$message.warning("请选择需要导出的数据")
					} else {
						this.$confirm("是否导出所选数据？", "系统提示", {
							confirmButtonText: "确认",
							cancelButtonText: "取消",
							type: "warning"
						}).then(() => {
							let url = "/api/download/power_part/"
							let params = {
								"id": this.multipleTable
							}
							ApiDownload(url, params).then((response) => {
								this.$message.success(response.message)
								window.location.href = this.$api_url + response.path
							})
						})
					}
				}
			},
			// 14.批量审核
			operate_approval(command) {
				if (command === 'operate_approval_on') {
					if (this.multipleTable.length === 0) {
						this.$message.warning("请选择需要审核的数据")
					} else {
						this.$confirm("是否审核所选数据？", "系统提示", {
							confirmButtonText: "确认",
							cancelButtonText: "取消",
							type: "warning"
						}).then(() => {
							let url = "/api/state/power_on/"
							let params = {
								"id": this.multipleTable
							}
							ApiState(url, params).then((response) => {
								this.$message.success(response)
								this.getTableJson()
							})
						})
					}
				}
				if (command === 'operate_approval_off') {
					if (this.multipleTable.length === 0) {
						this.$message.warning("请选择需要反审的数据")
					} else {
						this.$confirm("是否反审所选数据？", "系统提示", {
							confirmButtonText: "确认",
							cancelButtonText: "取消",
							type: "warning"
						}).then(() => {
							let url = "/api/state/power_off/"
							let params = {
								"id": this.multipleTable
							}
							ApiState(url, params).then((response) => {
								this.$message.success(response)
								this.getTableJson()
							})
						})
					}
				}
			},
			// 15.批量删除
			operate_delete() {
				if (this.multipleTable.length === 0) {
					this.$message.warning("请选择需要删除的数据")
				} else {
					this.$confirm("是否删除所选数据？", "系统提示", {
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						let url = "/api/delete/power_all/"
						let params = {
							"id": this.multipleTable
						}
						ApiDelete(url, params).then((response) => {
							this.$message.success(response)
							this.getTableJson()
						})
					})
				}
			},
			// 16.权限分类 - 筛选
			typeTag(value, row) {
				return row.power_type === value;
			},
			// 17.审核状态 - 筛选
			stateTag(value, row) {
				return row.power_state === value;
			},
			// 18.引入权限json
			// getPowerJson() {
			//   let url = "/api/get/power_select/"
			//   ApiData(url).then((response) => {
			//     this.power_data = response.data
			//   })
			// }
		}
	}
</script>

<style>
	.ordertable{
		border: 0.0625rem solid #efefef;
		width: 70%;
	}
	.ordertable > tr > td:nth-of-type(1),.ordertable > tr > td:nth-of-type(3){
		font-weight: 600;
				text-align: right;
				padding: 0 1.25rem;
	}
</style>
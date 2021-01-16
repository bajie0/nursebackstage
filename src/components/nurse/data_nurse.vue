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
						<h2><i class="ion-ios-arrow-forward"></i>上门护士管理</h2>
						<p>对平台的上门护士相关信息进行添加、修改、导入、导出等系统操作。</p>
						<div class="ui-container-header-group">
							<el-button type="primary" class="ui-header-group-add"><i class="ion-ios-add-circle"></i>新增</el-button>
							<el-button class="ui-header-group-btn" @click="operate_upload()"><i class="ion-ios-cloud-upload"></i>导入
							</el-button>
							<el-dropdown @command="operate_download">
								<el-button><i class="ion-ios-cloud-download"></i>导出</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="operate_download_all">批量导出</el-dropdown-item>
									<el-dropdown-item command="operate_download_part">导出所选</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-dropdown @command="operate_approval">
								<el-button><i class="ion-ios-switch"></i>审核</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="operate_approval_on">批量审核</el-dropdown-item>
									<el-dropdown-item command="operate_approval_off">批量反审</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-button class="ui-header-group-btn" @click="operate_delete()"><i class="ion-ios-trash"></i>删除
							</el-button>
						</div>
					</div>
					<!-- moresearch start -->
					<div class="ui-container-content">
						<div :class="more_link?'ui-container-table-search height':'ui-container-table-search'">
							<el-row>
								<el-col :span="6">
									<div class="ui-container-table-search-quick">
										<i class="ion-ios-search"></i>
										<el-input v-model="search_input" placeholder="护士姓名 / 工号..." @input="searchQuick" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="4">
									<div class="ui-container-table-shrink">
										<el-button @click="MoreLink">更多<i :class="more_link?'ion-ios-arrow-up':'ion-ios-arrow-down'"></i>
										</el-button>
									</div>
								</el-col>
							</el-row>
							<el-form class="ui-container-table-more" ref="searchForm" :model="searchForm" :label-position="labelSearchPosition"
							 :label-width="labelSearchWidth">
								<el-divider>更多查询选项</el-divider>
								<el-row :gutter="20">
									<el-col :span="6">
										<el-form-item label="身份证号" prop="power_type">
											<el-input v-model="searchForm.shool" placeholder="请输入身份证号"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="毕业院校" prop="shool">
											<el-input v-model="searchForm.shool" placeholder="请输入毕业院校"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="职业证书号" prop="identitynum">
											<el-input v-model="searchForm.identitynum" placeholder="请输入职业证书号"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="审核状态" prop="power_state">
											<el-select v-model="searchForm.power_state" placeholder="请选择审核状态" clearable>
												<el-option label="通过" value="1"></el-option>
												<el-option label="待审" value="0"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="24">
										<div class="ui-container-table-more-button">
											<el-button type="primary" @click="searchSubmit"><i class="ion-ios-search"></i>查询</el-button>
											<el-button @click="searchReset('searchForm')"><i class="ion-ios-refresh"></i>重置</el-button>
										</div>
									</el-col>
								</el-row>
							</el-form>
						</div>
						<!-- moresearch end -->
						
						<!-- Table start -->
						<div class="ui-container-table-content">
							<div class="ui-container-table-list">
								<el-table :data="tableData" height="100%" style="width: 100%" @selection-change="selection_change"
								 tooltip-effect="dark">
									<el-table-column fixed type="selection" width="40"></el-table-column>
									<el-table-column type="expand" width="40">
										<template slot-scope="props">
										</template>
									</el-table-column>
									<el-table-column prop="name" label="护士姓名" width="200"></el-table-column>
									<el-table-column prop="shool" label="毕业院校" width="250" sortable></el-table-column>
									<el-table-column prop="identitynum" label="身份证号" width="250"></el-table-column>
									<el-table-column prop="licensenum" label="职业证书号" width="200"></el-table-column>
									<el-table-column prop="worktime" label="参加工作时间" width="250">
										<template slot-scope="data">
											{{+data.row.worktime | dateFormat}}
										</template>
									</el-table-column>
									<el-table-column prop="power_state" label="审核状态" width="100" :filters="power_state" :filter-method="stateTag">
										<template slot-scope="power_state">
											<el-switch v-model="power_state.row.power_state" :active-value="true" :inactive-value="false" active-text
											 inactive-text @change="changeSwitch($event,power_state.row.id)"></el-switch>
										</template>
									</el-table-column>
									<el-table-column fixed="right" label="操作" width="120">
										<template slot-scope="scope">
											<el-button class="ui-primary" @click="handle_edit(scope.row)">编辑</el-button>
											<el-button class="ui-primary" @click="handle_delete(scope.row)">删除</el-button>
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

	export default {
		data() {
			return {
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
				tableData: [
					{
						name:'阿狸',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸11',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸2222',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸',
						shool:'山西医科大学1111',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸',
						shool:'山西医科大学33333333',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:false
					},
					{
						name:'阿狸',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					},
					{
						name:'阿狸',
						shool:'山西医科大学',
						identitynum:'142601198807231036',
						licensenum:'1246748615415485454165',
						worktime:'14574464164',
						power_state:true
					}
				],
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
			// this.getTableJson(this.searchForm)
			// this.getPowerJson()
		},
		methods: {
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
			// 09.Table数据 - 编辑操作
			handle_edit(row) {
				window.location.href = "/manage/admin/patch-power/" + row.id
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
			// 12.批量上传
			operate_upload() {
				console.log("批量上传")
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

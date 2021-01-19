<template>
	<el-container class="pro">
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
						<h2><i class="ion-ios-arrow-forward"></i>{{header_title}}</h2>
						<p>{{labeltext}}</p>
						<div class="ui-container-header-group">
						  <el-button v-if="page_create===true" type="primary" class="ui-header-group-add" @click="operate_add()"><i class="ion-ios-add-circle"></i>新增</el-button>
						  <el-button v-if="page_upload===true" class="ui-header-group-btn" @click="operate_upload()"><i class="ion-ios-cloud-upload"></i>导入
						  </el-button>
						  <el-dropdown v-if="page_download===true" @command="operate_download">
						    <el-button><i class="ion-ios-cloud-download"></i>导出</el-button>
						    <el-dropdown-menu slot="dropdown">
						      <el-dropdown-item command="operate_download_all">批量导出</el-dropdown-item>
						      <el-dropdown-item command="operate_download_part">导出所选</el-dropdown-item>
						    </el-dropdown-menu>
						  </el-dropdown>
						  <el-dropdown v-if="page_state===true" @command="operate_approval">
						    <el-button><i class="ion-ios-switch"></i>审核</el-button>
						    <el-dropdown-menu slot="dropdown">
						      <el-dropdown-item command="operate_approval_on">批量审核</el-dropdown-item>
						      <el-dropdown-item command="operate_approval_off">批量反审</el-dropdown-item>
						    </el-dropdown-menu>
						  </el-dropdown>
						  <el-button v-if="page_delete===true" class="ui-header-group-btn" @click="operate_delete()"><i class="ion-ios-trash"></i>删除
						  </el-button>
						</div>
					</div>
					<el-card class="margin20" shadow="hover">
						<el-table :data="tableData" style="width: 100%">
							<el-table-column type="expand" width="40">
								<template slot-scope="data">
									<el-row :gutter="40">
										<el-col :span="10">
											<span class="labeltext"><i class="ion-ios-settings marginlr10"></i>项目规格</span>
											<div v-for="(item,index) in data.row.specification" :key="index" class="v-for-box">
												<div class="inner-justify">
													<div class="inner-left">
														<el-tag class="typetag">{{item.title}}</el-tag>
														<div>
															<div v-for="(items,indexs) in item.children" :key="indexs" class="box">
																{{indexs + 1}}-{{items.title}}
															</div>
														</div>
													</div>
													<div class="paddinglr10 inner-column-center priceborder marginlr10">
														<div>操作费</div>
														<div style="color: darkred;">{{item.price}}</div>
													</div>
												</div>
											</div>
										</el-col>
										<el-col :span="14">
											<span class="labeltext"><i class="ion-ios-paper marginlr10"></i>项目说明</span>
											<div v-for="(item,index) in data.row.description" :key="index" class="margintb40">
												<div class="institle">{{item.title}}</div>
												<div class="inscontent">{{item.content}}</div>
											</div>
										</el-col>
									</el-row>									
								</template>
							</el-table-column>
							<el-table-column type="index" width="50" label="序号">
							</el-table-column>
							<el-table-column prop="icon" label="项目图标">
								<template slot-scope="data">
									<img :src="require(`@/assets/itemicon/${data.row.icon}`)" alt="" class="itemicon">
								</template>
							</el-table-column>
							<el-table-column prop="title" label="项目名称">
							</el-table-column>
							<el-table-column prop="type" label="项目分类">
							</el-table-column>
							<el-table-column prop="time" label="创建时间">
								<template slot-scope="data">
									{{data.row.time | dateFormat}}
								</template>
							</el-table-column>
							<el-table-column label="上线状态">
								<div slot-scope="data">
									<el-switch v-model="data.row.state" @change="changeSwitch(data.row.id)">
									</el-switch>
								</div>
							</el-table-column>
							<el-table-column label="操作">
								<div slot-scope="data">
									<el-button  size="mini" class="ui-primary"  @click="editclick(data.row.id)">编辑</el-button>
									<el-button  size="mini" class="ui-primary" @click="delclick(data.row.id)">删除</el-button>
								</div>
							</el-table-column>
						</el-table>
					</el-card>
					<el-row class="bottombox">
						<el-pagination @size-change="size_change" @current-change="current_change" :current-page="table_page"
						               :page-sizes="page_sizes" :page-size="page_size"
						               layout="sizes, prev, pager, next, jumper, total" :total="table_total"
						               background></el-pagination>
					</el-row>
				</div>
			</el-main>
			<!-- 内容栏 end -->
		</el-container>
	</el-container>
</template>
<script>
	export default {
		data() {
			return {
				// 页面权限
				page_get: false,
				page_create: false,
				page_patch: false,
				page_state: false,
				page_delete: false,
				page_upload: false,
				page_download: false,
				page_reset:false,
				// 分页栏目-当前页
				table_page: 1,
				// 分页栏目-数据总量
				table_total: 4000,
				// 分页-每页数量条数
				page_sizes: [20, 50, 100, 200],
				// 分页-分页条数
				page_size: 20,
				// Form表单Title
				header_title: "上门项目管理",
				labeltext:'对平台的上门项目相关信息进行添加、删除、导入、导出等系统操作。',
				// 批量导入侧边栏
				upload_all: false,
				upload_all_direction: "rtl",
				// 批量导入组件
				upload_content: "",
				upload_url: "",
				FileUrl: '',
				// Form表单设置
				labelSearchPosition: 'top', // 文字朝向
				labelSearchWidth: '100px', // label宽度
				//搜索表格
				searchForm: {
					table_page: "",
					page_size: "",
					search_input: "",
				},
				// 快捷搜索
				search_input: '',
				//table表格数据
				tableData: [{
						id: 1,
						title: '新生儿臀红护理',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '服务简介',
								content:'公司发的关怀和官方和国家合法的和，规范和监督九回复工号回到房间脚后跟脚后跟的，醍醐灌顶让德国同事的。'
							}, {
								title: '适用人群',
								content:'他个人的合法的和，规范和监督九回复工号回到房的，醍醐灌顶反对的。'
							},
							{
								title: '禁忌症状',
								content:'1.的撒和，规范和监督九回复工号回到房的，醍范德萨的。2.分段收费电视搞大锅饭大概的用途，及用途热舞我的撒和，规范和监督九回复工号回到房的，醍范德萨的。广泛大锅饭广泛的。3.个人规划也会让他和人他如何预热就会有陶然居仁堂艰苦艰苦他。'
							},
							{
								title: '温馨提示',
								content:'挂号费欢迎欢迎他。他个人的合法的和，规范和监督九回复工号回到房的，醍醐灌顶反对的。的事实发送。'
							}
						],
						specification: [{
								title: '小换药',
								children:[
									{
										title:'纱布块',
										size:'块',
										num:5,
										price:2.32
									},
									{
										title:'纱布块11111',
										size:'块',
										num:5,
										price:2.32
									},
									{
										title:'纱布块111112222',
										size:'个',
										num:2,
										price:4.32
									},
									{
										title:'纱布块33333333',
										size:'块',
										num:5,
										price:5.36
									},
									{
										title:'纱布块4444444',
										size:'块',
										num:5,
										price:9.32
									},
									{
										title:'纱布块66666666',
										size:'块',
										num:5,
										price:2.32
									}
								],
								price:55
							},
							{
								title: '中换药',
								children:[
									{
										title:'纱布块',
										size:'块',
										num:5,
										price:2.32
									},
									{
										title:'纱布块11111',
										size:'块',
										num:5,
										price:2.32
									},
									{
										title:'纱布块111112222',
										size:'个',
										num:2,
										price:4.32
									},
									{
										title:'纱布块333333335555555555',
										size:'块',
										num:5,
										price:5.36
									},
									{
										title:'纱布块4444444',
										size:'块',
										num:5,
										price:9.32
									},
									{
										title:'纱布块66666666',
										size:'块',
										num:5,
										price:2.32
									}
								],
								price:85
							},
							{
								title: '大换药',
								children:[
									{
										title:'纱布块',
										size:'块',
										num:5,
										price:2.32
									},
									{
										title:'纱布块11111',
										size:'块',
										num:5,
										price:2.32
									},
									{
										title:'纱布块111112222',
										size:'个',
										num:2,
										price:4.32
									},
									{
										title:'纱布块33333333',
										size:'块',
										num:5,
										price:5.36
									},
									{
										title:'纱布块4444444',
										size:'块',
										num:5,
										price:9.32
									},
									{
										title:'纱布块666666667777777777777777777777777',
										size:'块',
										num:5,
										price:2.32
									}
								],
								price:125
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 11,
						title: '造口护理',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '24小时电话',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 111,
						title: '打针',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 121,
						title: '气管切开护理',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 131,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '母婴护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 1412,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 141,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 14,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 15,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 167,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					},
					{
						id: 177,
						title: '医护到家',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '适用人群',
							},
							{
								title: '禁忌症状',
							},
							{
								title: '温馨提示',
							}
						],
						specification: [{
								title: '小换药',
							},
							{
								title: '中换药',
							},
							{
								title: '大换药',
							}
						],
						time: 125458654525,
						state: true
					}
				],
				multipleSelection: [],
				multipleTable: '',
				// 加载中组件
				loading: true,
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
				isopen: false,
				itemformdata: {
					name: '',
					isopen: false
				}
			}
		},
		created() {
			this.getPageAuthority()
			// this.getTableJson()
		},
		methods: {
			//编辑项目
			editclick(id){
				this.$router.push('/project/edit/' + id)
			},
			//删除项目
			delclick(id){
				this.$confirm('删除项目？').then(()=>{
					// 调删除项目的接口
					
					
					this.$message.success('项目删除成功')
				})
			},

			//删除项目
			del() {
				this.$confirm('确定删除这个项目吗？').then(() => {
					//调修改数据的接口
		
		
					this.$message.success('删除项目成功')
				}).catch(() => {
					return
				})
			},

			//跳转到新增项目页面
			addclick() {
				this.$router.push('/supplies/add_supplies')
			},
			// 13.批量上传
			operate_upload() {
				this.upload_all = true
				this.upload_content = ""
				this.upload_url = this.$api_url + "/api/upload/power/"
			},
			handleAvatarSuccess(res, file) {
				this.FileUrl = URL.createObjectURL(file.raw)
				this.$message.success(res.message)
				this.upload_content = res.data
			},
			beforeAvatarUpload(file) {
				const isJPG = file.name.substr(file.name.lastIndexOf(".") + 1) === "xlsx"
				const isLt2M = file.size / 1024 / 1024 < 5
				if (!isJPG) {
					this.$message.error("上传文件只能是xlsx格式!")
				}
				if (!isLt2M) {
					this.$message.error('上传文件大小不能超过5MB!')
				}
				return isJPG && isLt2M;
			},
			// 13.03.关闭上传
			uploadClose() {
				// this.getTableJson()
				this.upload_all = false
			},
		
			// 04.快捷Form查询
			searchQuick() {
				// this.getTableJson(this.table_page, this.page_size, this.search_input)
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
				// this.getTableJson()
			},
			// 07.分页栏目-跳转页
			current_change(val) {
				this.table_page = val
				// this.getTableJson()
			},
			// 08.获取table表格里的数据
			getTableJson() {
				// let url = "/api/get/power_list/"
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

			// 11.Table数据 - 开关操作
			changeSwitch($event, row) {
				let url = "/api/state/power/"
				let params = {
					"id": row,
					"state": $event
				}
				//调审核状态修改的接口
				
				
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
			// 19.页面权限验证
			getPageAuthority() {
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminCreate") !== -1) {
			    this.page_create = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminGet") !== -1) {
			    this.page_get = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminPatch") !== -1) {
			    this.page_patch = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminDelete") !== -1) {
			    this.page_delete = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminState") !== -1) {
			    this.page_state = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminUpload") !== -1) {
			    this.page_upload = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminDownload") !== -1) {
			    this.page_download = true
			  }
			  if (this.$store.state.power_list.indexOf("HandleManageAdminAdminReset") !== -1) {
			    this.page_reset = true
			  }
			}
		}
	}
</script>

<style>
	.pro .el-table__expanded-cell{
		padding: 20px 20px;
	}
	.priceborder{
		border: 0.0625rem solid #eaeaea;
	}
	.institle{
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 0.625rem 0;
		padding-left: 0.5rem;
		border-left: 0.25rem solid #2d8cf0;
	}
	.labeltext{
		text-align: center;
		margin: 0 auto;
		display: block;
		width: 20%;
		padding:0.625rem;
		border-bottom: 0.0625rem solid #e5e5e5;
		font-size: 0.9375rem;
		font-weight: 600;
	}
	.typetag{
		margin-right: 1.25rem;
	}
	.v-for-box{
		border-bottom: #f0f0f0 0.0625rem dashed;
		border-right: 0.0625rem solid #eeeeee;
		padding: 1.25rem 0;
		transition: 0.2s;
	}
	.v-for-box:hover{
		background-color: #e7e7e7;
		transition: 0.2s;
	}
	.v-for-box .box{
		padding: 0.1875rem;
	}
	.itemicon {
		width: 3.125rem;
		height: 3.125rem;
		background-color: #005E5E;
		padding: 0.625rem;
		border-radius: 0.3125rem;
	}
</style>

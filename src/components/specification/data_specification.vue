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
						<h2><i class="ion-ios-arrow-forward"></i>{{header_title}}</h2>
						<p>对平台的规格相关信息进行修改、审核、导入、导出等系统操作。</p>
						<div class="ui-container-header-group">
							<el-button type="primary" class="ui-header-group-add" @click="addclick"><i class="ion-ios-add-circle"></i>新增</el-button>
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
						<div class="ui-container-table-search">
							<el-row>
								<el-col :span="6">
									<div class="ui-container-table-search-quick">
										<i class="ion-ios-search"></i>
										<el-input v-model="search_input"  placeholder="规格名称..." @input="searchQuick" clearable></el-input>
									</div>
								</el-col>
							</el-row>
						</div>
						<!-- moresearch end -->

						<!-- Table start -->
						<div class="ui-container-table-content">
							<div class="ui-container-table-list">
								<el-table :data="tableData" height="100%" style="width: 100%" >
									<el-table-column type="index" width="50" label="序号">
									</el-table-column>
									<el-table-column type="expand">
										<template slot-scope="data">
											<div v-if="data.row.children">
												<div class="inner-left">
													<el-select v-model="choosed" multiple placeholder="选择耗材" class="width-10">
														<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
														</el-option>
													</el-select>
													<el-button type="text" class="marginlr10" @click="addinlist(data)">添加</el-button>
												</div>
												<div v-for="(item,index) in data.row.children" :key="index">
													<div class="inner-justify width-12">
														<el-tag closable class="margin10" @close="tagclose">{{`${item.title}-${item.size}`}}</el-tag>
														<el-input-number size="mini" @change="numchange" v-model="item.number" class="width-4" :min="1"></el-input-number>
													</div>
												</div>
											</div>
											<div v-else>当前规格无绑定耗材</div>
										</template>
									</el-table-column>
									<el-table-column prop="name" label="规格名称" width="250">
									</el-table-column>
									<el-table-column prop="oeratingfee" label="操作费(元)" width="150">
									</el-table-column>
									<el-table-column prop="datetime" label="创建时间" width="200">
										<template slot-scope="data">
											{{+data.row.datetime | dateFormat}}
										</template>
									</el-table-column>
									<el-table-column label="上线状态">
										<div slot-scope="data">
											<el-switch v-model="data.row.state">
											</el-switch>
										</div>
									</el-table-column>
									<el-table-column label="操作" width="250">
										<div slot-scope="data">
											<el-button type="warning" class="ui-primary" icon="el-icon-delete" @click="editclick(data.row.id)">编辑</el-button>
											<el-button type="primary" class="ui-primary" size="mini" icon="el-icon-delete" @click="delclick">删除</el-button>
										</div>
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

		<!-- 批量上传 start -->
		<el-drawer class="ui-upload" title="批量导入数据" :visible.sync="upload_all" :direction="upload_all_direction" :with-header="false"
		 :before-close="uploadClose">
			<div class="ui-upload-header">
				<h2><i class="ion-ios-arrow-forward"></i>批量导入数据</h2>
				<p>对初始化数据进行批量导入。</p>
			</div>
			<div class="ui-upload-content">
				<h4>01.模板</h4>
				<a href="../../../static/template/权限模板.xlsx">
					<img src="../../../static/images/xls.png">
					<p>点击下载模板文件</p>
				</a>
				<span>
					<p>1、红色标题为必须输入内容；</p>
					<p>2、编码类列作为唯一值，如有重复则系统会提示错误；</p>
				</span>
				<h4>02.选择文件</h4>
				<el-upload drag :action="this.upload_url" :headers="{'token':this.$cookies.get('token')}" :show-file-list="false"
				 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
				<h4>03.上传反馈</h4>
				<el-input type="textarea" rows="11" v-model="upload_content"></el-input>
			</div>
		</el-drawer>
		<!-- 批量上传 end -->

		<!-- 编辑规格 -->
		<el-dialog title="编辑提示" :visible.sync="isopen" width="30%" @close="close">
			<el-form ref="editform" :model="formdata" label-width="80px" label-position="top" :show-message="false">
				<el-form-item label="规格名称" required="" prop="title">
					<el-input v-model="formdata.title"></el-input>
				</el-form-item>
				<el-form-item label="规格单位" required="" prop="unit">
					<el-input v-model="formdata.unit"></el-input>
				</el-form-item>
				<el-form-item label="规格单价" required="" prop="price">
					<div class="inner-left">
						<el-input v-model="formdata.price" type="number"></el-input>
						<div class="paddinglr10">元</div>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancle">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
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
				//选择耗材的选项
				options: [{
					value: '注射器11111122222',
					label: '注射器11111122222'
				}, {
					value: '注射器1111112',
					label: '注射器1111112'
				}, {
					value: '注射器11111333331',
					label: '注射器11111333331'
				}, {
					value: '注射器1111114',
					label: '注射器1111114'
				}, {
					value: '注射器11111',
					label: '注射器11111'
				}],
				//选择耗材的数组
				choosed: [],
				//编辑以后的表单数据
				formdata: {
					title: '',
					unit: '',
					price: ''
				},
				isopen: false, //是否打开编辑规格对话框
				// Form表单Title
				header_title: "规格管理",
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
				searchForm: {
					table_page: "",
					page_size: "",
					search_input: "",
				},
				// 快捷搜索
				search_input: '',
				// Table数据
				tableData: [{
						id: 1,
						name: '小换药',
						included: 'Aaron_admin',
						datetime: '1610354226713',
						state: true,
						oeratingfee: 55,
						children: [{
								id: '241',
								title: '一次性注射针管',
								size: '70ml/mol',
								number: 1
							},
							{
								id: '211',
								title: '一次性纱布贴',
								size: '90.7ml/biol',
								number: 1
							},
							{
								id: '1341',
								title: '一次性注射针管11',
								size: '70ml/mol',
								number: 1
							},
							{
								id: '24',
								title: '一次性纱布贴1111',
								size: '90.7ml/biol',
								number: 1
							}
						]
					},
					{
						id: 2,
						name: '中换药',
						oeratingfee: 75,
						included: 'Hui_lp',
						datetime: '1610354126713',
						state: false,
						children: [{
								id: '241',
								title: '一次性注射针管1111',
								size: '70ml/mol',
								number: 1
							},
							{
								id: '211',
								title: '一次性纱布贴1111',
								size: '90.7ml/biol',
								number: 1
							},
							{
								id: '1341',
								title: '一次性注射针管112222',
								size: '70ml/mol',
								number: 1
							},
							{
								id: '24',
								title: '一次性纱布贴11112222',
								size: '90.7ml/biol',
								number: 1
							}
						]
					},
					{
						id: 3,
						name: '大换药',
						oeratingfee: 105,
						included: 'Aaron_admin',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 4,
						name: '特大换药',
						oeratingfee: 125,
						included: 'Hui_lp',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 5,
						name: '10*20mg/l',
						oeratingfee: 55,
						included: 'Hui_lp',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 6,
						name: '10*40mg/l',
						oeratingfee: 55,
						included: 'Aaron_admin',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 7,
						name: '10*80mg/l',
						included: 'Aaron_admin',
						oeratingfee: 55,
						datetime: '1610354126713',
						state: false
					},
					{
						id: 8,
						name: '20*100mg/l,ploiew1.124',
						included: 'Aaron_admin',
						oeratingfee: 55,
						datetime: '1610354126713',
						state: false
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
			// this.getTableJson()
		},
		watch:{
			choosed(e){
				console.log(e)
			}
		},
		methods: {
			//编辑规格
			editclick(id){
				this.$router.push('/specification/edit/' + id)
			},
			//删除规格
			delclick(){
				this.$confirm('删除规格？').then(()=>{
					// 调删除规格的接口
					
					
					this.$message.success('规格删除成功')
				})
			},
			//把耗材添加进规格下
			addinlist(data){
				if(this.choosed.length == 0) return this.$message.error('请选择要添加的耗材')
				console.log(data)
				let arr = []
				for (let item of this.choosed) {
					arr.push({title:item,number:1,size:'50g/ml'})
				}
				console.log(arr)
				data.row.children.push(...arr)
				this.choosed = []
				// 调添加进耗材的接口
				
				
				this.$message.success('添加成功')
			},
			//耗材数量变化
			numchange() {
				//调修改数量的接口
				
				
				this.$message.success("修改成功")
			},
			//删除规格下的耗材
			tagclose(item) {
				this.$confirm('确定要从该规格中删除该耗材吗？').then(() => {
					// 调删除耗材的接口


					this.$message.success("删除成功")
				})
			},
			//删除规格
			del() {
				this.$confirm('确定删除这个规格吗？').then(() => {
					//调修改数据的接口


					this.$message.success('删除规格成功')
				}).catch(() => {
					return
				})
			},
			//关闭编辑表单的回调
			close() {
				this.isopen = false
			},
			//跳转到新增规格页面
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
			// 09.Table数据 - 编辑操作
			handle_edit(row) {
				this.isopen = true
				this.formdata.title = row.name
				this.formdata.unit = row.unit
				this.formdata.price = row.price
			},
			//取消编辑
			cancle() {
				this.isopen = false
			},
			//确定编辑
			confirm() {
				//调修改数据的接口


				this.isopen = false
				this.$message({
					type: 'success',
					message: '保存成功'
				})
			},
			// 10.Table数据 - 删除操作
			handle_delete(row) {
				this.$confirm("是否删除该数据？", "系统提示", {
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					// let url = "/api/delete/power/"
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
			}
		}
	}
</script>

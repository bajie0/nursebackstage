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
						<p>对平台的上门分类相关信息进行编辑、删除、审核等系统操作。</p>
					</div>
					<el-card class="margin20" shadow="hover">
						<el-table :data="tableData" style="width: 100%">
							<el-table-column type="index" width="70" label="序号">
							</el-table-column>
							<el-table-column prop="name" label="分类名称" width="250">
							</el-table-column>
							<el-table-column label="上线状态">
								<div slot-scope="data">
									<el-switch v-model="data.row.state">
									</el-switch>
								</div>
							</el-table-column>
							<el-table-column label="操作" width="250">
								<div slot-scope="data">
									<el-button type="text" size="mini" icon="el-icon-edit" @click="edit(data.row)">编辑</el-button>
									<el-button type="text" size="mini" icon="el-icon-delete" @click="del">删除</el-button>
								</div>
							</el-table-column>
						</el-table>
					</el-card>
					<div class="ui-container-table-page">
						<el-pagination @size-change="size_change" @current-change="current_change" :current-page="table_page" :page-sizes="page_sizes"
						 :page-size="page_size" layout="sizes, prev, pager, next, jumper, total" :total="table_total" background></el-pagination>
					</div>

					<!-- 编辑 -->
					<el-dialog title="编辑提示" :visible.sync="isopen" width="30%" @close="close">
						<el-form ref="columnform" :model="typeformdata" label-width="80px" label-position="top">
							<el-form-item label="分类名称" prop="name">
								<el-input v-model="typeformdata.name"></el-input>
							</el-form-item>
							<el-form-item label="开启分类" prop="isopen">
								<el-switch v-model="typeformdata.isopen"></el-switch>
							</el-form-item>
						</el-form>
						<span slot="footer" class="dialog-footer">
							<el-button @click="cancle">取 消</el-button>
							<el-button type="primary" @click="confirm">确 定</el-button>
						</span>
					</el-dialog>
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
				//分页切换和条数切换
				searchForm: {
					table_page: "",
					page_size: "",
				},
				// 分页分类-当前页
				table_page: 1,
				// 分页分类-数据总量
				table_total: 20,
				// 分页-每页数量条数
				page_sizes: [20, 50, 100, 200],
				// 分页-分页条数
				page_size: 20,
				// Form表单Title
				header_title: "分类管理",
				tableData: [{
						id: 1,
						name: '基础护理',
						state: true
					},
					{
						id: 2,
						name: '母婴护理',
						state: false
					},
					{
						id: 2,
						name: '皮肤护理',
						state: true
					},
					{
						id: 2,
						name: '导管护理',
						state: false
					},
					{
						id: 2,
						name: '静脉采血',
						state: false
					},
					{
						id: 2,
						name: '特殊护理',
						state: false
					}
				],
				isopen: false,
				//编辑后的表单信息
				typeformdata: {
					name: '',
					isopen: ''
				}
			}
		},
		created() {
			this.gettabledata()
		},
		methods: {
			gettabledata() {
				//调获取table数据的接口


			},
			// 06.分页分类-分页数
			size_change(val) {
				this.page_size = val
				this.gettabledata()
			},
			// 07.分页分类-跳转页
			current_change(val) {
				this.table_page = val
				this.gettabledata()
			},
			//编辑分类
			edit(row) {
				this.isopen = true
				this.typeformdata.name = row.name
				this.typeformdata.isopen = row.state
			},
			//删除分类
			del() {
				this.$confirm('确定删除这个分类吗？').then(() => {
					//调修改数据的接口


					this.$message.success('删除分类成功')
				}).catch(() => {
					return
				})
			},
			close() {
				this.isopen = false
				this.$refs.columnform.resetFields()
			},
			//取消保存
			cancle() {
				this.isopen = false
			},
			confirm() {
				//调修改数据的接口


				this.isopen = false
				this.$message({
					type: 'success',
					message: '保存成功'
				})
			}
		}
	}
</script>

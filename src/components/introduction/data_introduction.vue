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
						<p>对平台的项目介绍标题信息进行删除、审核、导入、导出等系统操作。</p>
					</div>
					<el-card class="margin20">
						<el-table :data="tableData" style="width: 100%">
							<el-table-column type="index" width="70" label="序号">
							</el-table-column>
							<el-table-column prop="name" label="项目介绍标题名称" width="250">
							</el-table-column>
							<el-table-column label="上线状态">
								<div slot-scope="data">
									<el-switch v-model="data.row.state">
									</el-switch>
								</div>
							</el-table-column>
							<el-table-column label="操作" width="250">
								<div>
									<el-button type="primary" size="small" icon="el-icon-edit" @click="edit">编辑</el-button>
									<el-button type="warning" size="small" icon="el-icon-delete">删除</el-button>
								</div>
							</el-table-column>
						</el-table>
					</el-card>

					<!-- 编辑 -->
					<el-dialog title="提示" :visible.sync="isopen" width="50%" @close="close">
						<el-form ref="columnform" :model="columnformdata" label-width="120px">
							<el-form-item label="项目介绍标题" prop="name">
								<el-input v-model="columnformdata.name"></el-input>
							</el-form-item>
							<el-form-item label="开启标题" prop="isopen">
								<el-switch v-model="columnformdata.isopen"></el-switch>
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
				// Form表单Title
				header_title: "项目介绍标题管理",
				tableData: [
					{
						id: 1,
						name: '服务介绍',
						state: true
					},
					{
						id: 2,
						name: '适用人群',
						state: false
					},
					{
						id: 2,
						name: '禁忌症状',
						state: true
					},
					{
						id: 2,
						name: '特别提示',
						state: true
					},
					{
						id: 2,
						name: '费用组成',
						state: false
					}
				],
				isopen: false,
				columnformdata: {
					name: '',
					isopen: false
				}
			}
		},
		created() {

		},
		methods: {
			edit() {
				this.isopen = true
			},
			close() {
				this.isopen = false
				this.$refs.columnform.resetFields()
			},
			cancle() {
				this.isopen = false
			},
			confirm() {
				this.isopen = false
				this.$message({
					type: 'success',
					message: '保存成功'
				})
			}

		}
	}
</script>

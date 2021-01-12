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
						<p>对平台的项目介绍的标题的相关信息进行添加、修改。</p>
					</div>
					<div>
						<el-card class="margin20">
							<el-form ref="columnform" :model="columnformdata" label-width="80px">
								<el-form-item label="标题名称">
									<el-input v-model="columnformdata.name"></el-input>
								</el-form-item>
								<el-form-item label="开启标题">
									<el-switch v-model="columnformdata.isopen"></el-switch>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="save">保存</el-button>
									<el-button>重置</el-button>
								</el-form-item>
							</el-form>
						</el-card>
					</div>
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
				header_title: "新增项目介绍标题",
				columnformdata: {
					name: '',
					isopen: false
				}
			}
		},
		created() {

		},
		methods: {
			save() {
				if (!this.columnformdata.name) {
					return this.$message('标题名称不能为空')
				}
				this.$message({
					message: '保存成功',
					type: 'success'
				});
				this.columnformdata.name = ''
			}
		}
	}
</script>

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
						<p>对平台的上门项目分类相关信息进行添加操作。</p>
					</div>
					<div class="margin20 paddinglr50">
						<el-form ref="columnform" :model="typeformdata" label-width="80px" label-position="top">
							<el-row>
								<el-col :span="10">
									<el-form-item label="分类名称" required="">
										<el-input v-model="typeformdata.name"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-form-item>
								<el-button type="primary" @click="save">保存</el-button>
								<el-button @click="reset">重置</el-button>
							</el-form-item>
						</el-form>
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
				header_title: "新增上门分类",
				//栏目数据
				typeformdata: {
					name: ''
				}
			}
		},
		created() {

		},
		methods: {
			//保存
			save() {
				if (!this.typeformdata.name) {
					return this.$message.error('分类名称不能为空')
				}
				this.$message({
					message: '保存成功',
					type: 'success'
				});
				this.typeformdata.name = ''
			},
			//重置
			reset(){
				this.typeformdata.name = ''
			}
		}
	}
</script>

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
						<p>对平台的耗材相关信息进行添加、修改。</p>
					</div>
					<div>
						<el-card class="margin20">
							<el-form ref="specificationform" :model="formdata" label-width="80px">
								<el-form-item label="耗材名称">
									<el-input v-model="formdata.title"></el-input>
								</el-form-item>
								<el-form-item label="耗材单位">
									<el-input v-model="formdata.unit"></el-input>
								</el-form-item>
								<el-form-item label="耗材单价">
									<div class="inner-left">
										<el-input v-model="formdata.price" type="number"></el-input>
										<div>元</div>
									</div>
								</el-form-item>
								<el-form-item label="与规格绑定">
									<el-input v-model="formdata.unit"></el-input>
								</el-form-item>
								<el-form-item label="录入时间">
									<el-input  disabled="" :value="formdata.datetime | dateFormat"></el-input>
								</el-form-item>
								<el-form-item label="开启耗材">
									<el-switch v-model="formdata.isopen"></el-switch>
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
				header_title: "新增耗材",
				//耗材表单输入的数据
				formdata: {
					title: '',  //耗材名称
					unit:'',  //单位
					price:'',  //单价
					datetime:'', //录入时间
					isopen: false  //开启规格
				}
			}
		},
		created() {
			this.gettime()	
					console.log(this.$store.state.$username)
		},
		methods: {
			save() {
				if (!this.formdata.title) {
					return this.$message.error('规格名称不能为空')
				}
				this.$message({
					message: '保存成功',
					type: 'success'
				});
				for(let n in this.formdata){
					this.formdata[n] = ''
				}
				this.formdata.isopen = false
			},
			gettime(){
				const timestamp = new Date().getTime()
				console.log(timestamp)
				this.formdata.datetime = timestamp
			}
		}
	}
</script>

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
				<div class="ui-container addspecification">
					<div class="ui-container-header">
						<h2><i class="ion-ios-arrow-forward"></i>{{header_title}}</h2>
						<p>{{labeltext}}</p>
					</div>
					<div class="margin20 paddinglr50 box">
						<el-form ref="suppliesform" :model="formdata" label-width="80px" label-position="top" :show-message="false">
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="规格名称" required="" prop="title">
										<el-input v-model="formdata.title"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="3">
									<el-form-item label="操作费" required="" prop="price">
										<div class="inner-left">
											<el-input v-model="formdata.price" type="number"></el-input>
											<div class="paddinglr10">元</div>
										</div>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="24">
									<el-form-item label="绑定耗材">
										<el-transfer filterable filter-placeholder="请输入耗材名称" v-model="value" :data="data" :titles="bandlelist">
											<div slot="left-footer" class="inner-center margintb10">
												<el-button class="ui-primary" size="mini" @click="addspecification">新增耗材</el-button>
											</div>
											<div slot-scope="data">
												<div class="inner-justify">
													<div class="labeltext width-18">
														{{data.option.label}}
													</div>
													<div @click.stop.prevent class="width-5">
														<el-input-number v-model="data.option.number" size="mini" :min="1"></el-input-number>
													</div>
												</div>
											</div>
										</el-transfer>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<div class="bottombox inner-center">
						<el-button type="primary" @click="save">保存</el-button>
						<el-button @click="reset">重置</el-button>
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
				header_title: "新增规格",
				labeltext:'对平台的规格相关信息进行添加操作。',
				bandlelist: ['所有耗材', '该规格内的耗材'],
				data: [{
						key: 1,
						label: '一次性注射器1',
						number: 1
					},
					{
						key: 2,
						label: '一次性1注射器1',
						number: 1
					},
					{
						key: 3,
						label: '一次性2注射器2',
						number: 1
					},
					{
						key: 4,
						label: '一次性444注射器',
						number: 1
					},
					{
						key: 5,
						label: '一次性555注射器',
						number: 1
					},
					{
						key: 6,
						label: '一次性注射器6666',
						number: 1
					},
					{
						key: 7,
						label: '一次性555注射器',
						number: 1
					},
					{
						key: 8,
						label: '一次性注射器6666',
						number: 1
					}
				],
				//选中并穿梭到右侧的耗材的key的数组
				value: [],

				//规格数据
				formdata: {
					title: '',
					formdata: ''
				},
				//规格列表json
				options: []

			}
		},
		watch: {
			value(e) {
				console.log(e)
			},
			'formdata.price'(e){
				if(e < 0) {
					this.$message.error('不能输入负数')
					this.formdata.price = 0
				}
			}
		},
		created() {
			this.addoredit()
			this.getspecification()
		},
		methods: {
			addoredit(){
				if(this.$route.params.id){
					console.log('这是一个编辑页面')
					this.header_title = '编辑规格'
					this.labeltext = '对平台的规格相关信息进行编辑操作'
					// 调根据id值获取数据的接口
					
					
					
				}
				else{
					console.log('这是一个新增页面')
				}
			},
			//新增耗材
			addspecification(){
				this.$router.push('/supplies/add_supplies')
			},
			//跳转到新增规格页面
			tospecification() {
				this.$router.push('/specification/add_specification')
			},
			//获取所有的规格名称列表
			getspecification() {
				//调用获取数据接口


			},
			//保存
			save() {
				if (!this.formdata.title) {
					return this.$message.error('规格名称不能为空')
				}
				if (!this.formdata.price) {
					return this.$message.error('操作费不能为空')
				}
				let arr = []
				for (let item of this.data) {
					for (let items of this.value) {
						if(item.key == items){
							 //二维数组的第一项为选中的规格的耗材的key,第二项为对应的数量
							arr.push([item.key,item.number])  
						}
					}
				}
				console.log(arr)
				// 调绑定耗材的接口
				
				
				this.$message({
					message: '保存成功',
					type: 'success'
				});
				this.$refs.suppliesform.resetFields()
				this.value = []
			},
			//重置
			reset() {
				this.$refs.suppliesform.resetFields()
				this.value = []
			}
		}
	}
</script>
<style>
	.addspecification .box{
		background-color: white;
		height: calc(100vh - 190px - 11vh);
		overflow: scroll;
	}
	.el-transfer-panel__item.el-checkbox {
		margin: 0;
	}

	.el-transfer {
		display: flex;
		align-items: center;
	}

	.el-transfer-panel {
		width: 31.25rem;
	}

	.labeltext {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>

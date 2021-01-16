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
						<p>对平台的上门护士相关信息进行添加、修改。</p>
					</div>
					<el-card class="margin20" shadow="hover">
						<el-form ref="nurseform" :model="nurseform" label-width="80px" label-position="top">
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="护士姓名">
										<el-input v-model="nurseform.name" placeholder="请输入护士姓名"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="工号">
										<el-input v-model="nurseform.number" placeholder="请输入护士工号"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8" class="positionbox">
									<el-form-item class="box">
										<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
										 :on-success="handleAvatarSuccess">
											<img v-if="imageUrl" :src="imageUrl" class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon"></i>
										</el-upload>
										<el-row class="uploadtext">上传照片</el-row>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="身份证号">
										<el-input v-model="nurseform.itemfee" placeholder="请输入身份证号"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="最高学历">
										<el-input v-model="nurseform.itemfee" placeholder="请输入最高学历"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="毕业院校">
										<el-input v-model="nurseform.itemfee" placeholder="请输入毕业院校"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="职业证书号">
										<el-input v-model="nurseform.itemfee" placeholder="请输入职业证书号"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="参加工作时间">
										<el-date-picker
										      v-model="value1"
										      type="date"
										      placeholder="选择日期时间">
										    </el-date-picker>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="21">
									<el-form-item label="专业方向及擅长">
										<el-input
										  type="textarea"
										  :rows="5"
										  placeholder="请输入专业方向及特长"
										  v-model="textarea">
										</el-input>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</el-card>
					<el-row class="bottombox inner-center">
						<el-button type="primary">创建护士</el-button>
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
				//参加工作时间
				value1: '',
				//项目分类
				typeoptions: [{
					value: '基础护理',
					label: '基础护理'
				}, {
					value: '母婴护理',
					label: '母婴护理'
				}, {
					value: '皮肤护理',
					label: '皮肤护理'
				}, {
					value: '特殊护理',
					label: '特殊护理'
				}],
				itemtype: '',
				//规格选择
				options: [{
						value: '大换药',
						label: '大换药'
					}, {
						value: '小换药',
						label: '小换药'
					}, {
						value: '中换药',
						label: '中换药'
					}, {
						value: '特大换药',
						label: '特大换药'
					}, {
						value: '规格1111',
						label: '规格1111'
					},
					{
						value: '大换药2222',
						label: '大换药2222'
					}, {
						value: '小换药2222',
						label: '小换药2222'
					}, {
						value: '中换药2222',
						label: '中换药2222'
					}, {
						value: '特大换药2222',
						label: '特大换药2222'
					}, {
						value: '规格11112222',
						label: '规格11112222'
					}
				],
				sizevalue: [],
				selected: [], //已经选择的介绍标题
				discarr: [{
					options: [{
						value: '1',
						label: '服务简介'
					}, {
						value: '2',
						label: '适用人群'
					}, {
						value: '3',
						label: '禁忌症状'
					}, {
						value: '4',
						label: '特别提示'
					}, {
						value: '5',
						label: '费用组成'
					}],
					value: '', //服务介绍的标题
					content: ''
				}],
				imageUrl: '',
				// Form表单Title
				header_title: "新增上门护士",
				nurseform: {
					itemtitle: '',
					itemicon: '',
					itembaseprice: '',
					itemfee: ''
				}
			}
		},
		methods: {
			//发布项目
			goitem() {
				this.$message.success('项目发布成功！')
			},
			//监听选择服务介绍的标题
			selectchange(index, e) {
				if (this.selected.indexOf(e) != -1) {
					this.discarr[index].value = ''
					return this.$message.error('您已选过此标题了!')
				}
				if (e != this.selected[index] && this.selected) {
					this.selected.splice(index, 1, e)
					console.log(this.selected)
					return
				}
				this.selected.push(e)
				console.log(this.selected)
			},
			//删除服务介绍
			deldisc(index) {
				if (this.discarr.length == 1) return this.$message.error('当前必须有一条服务介绍')
				this.$confirm('确认删除这条介绍吗？').then(()=>{
					this.discarr.splice(index, 1)
					this.$message.success('删除成功！')
					this.selected.splice(index, 1)
				}).catch(()=>{
					return
				})
			},
			//新增介绍
			adddisc(index) {
				if (!this.discarr[index].value) return this.$message.error('请选择服务介绍标题')
				this.discarr.push({
					options: [{
						value: '1',
						label: '服务简介'
					}, {
						value: '2',
						label: '适用人群'
					}, {
						value: '3',
						label: '禁忌症状'
					}, {
						value: '4',
						label: '特别提示'
					}, {
						value: '5',
						label: '费用组成'
					}],
					value: '', //服务介绍的标题
					content: ''
				})
			},
			//上传项目图标
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},
		}
	}
</script>

<style>
	.addbutton{
		border: #d5d5d5 0.0625rem dashed;
		color: #a5a5a5;
	}
	.ql-editor {
		height: 14vh;
	}

	.positionbox .box {
		z-index: 999;
		position: absolute;
		top: 3.125rem;
		left: 6.25rem;
	}
	.positionbox .box .uploadtext{
		color: #CCCCCC;
		position: absolute;
		left: 50%;
		transform: translate(-50%,-40%);
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 170px;
		height: 240px;
		line-height: 240px;
		text-align: center;
	}

	.avatar {
		width: 170px;
		height: 240px;
		display: block;
	}
</style>

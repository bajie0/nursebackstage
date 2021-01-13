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
						<p>对平台的上门项目相关信息进行添加、修改。</p>
					</div>
					<el-card class="margin20" shadow="hover">
						<el-form ref="itemform" :model="itemform" label-width="80px" label-position="top">
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="项目名称">
										<el-input v-model="itemform.itemtitle"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="项目分类">
										<el-select v-model="itemtype" placeholder="请选择项目分类">
											<el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8" class="positionbox">
									<el-form-item class="box">
										<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
										 :on-success="handleAvatarSuccess">
											<img v-if="imageUrl" :src="imageUrl" class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon"></i>
										</el-upload>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="4">
									<el-form-item label="基础费(元)">
										<el-input v-model="itemform.itemfee"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-form-item label="交通费(元)">
										<el-input v-model="itemform.itemfee"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="服务介绍">
										<div style="padding-bottom: 1.25rem;" v-for="(item,index) in discarr" :key="index">
											<el-row :gutter="40">
												<el-col :span="24">
													<el-divider content-position="center">
														<el-button type="text" size="mini" @click="adddisc(index)" v-if="discarr.length == index+1">新增一条</el-button>
														<el-button type="text" size="mini" @click="deldisc(index)">删除</el-button>
													</el-divider>													
												</el-col>
											</el-row>
											<el-row :gutter="40">
												<el-col :span="8">
													<el-select :disabled="discarr.length != index+1" v-model="item.value" placeholder="请选择服务介绍标题" @change="selectchange(index,$event)">
														<el-option v-for="(items,indexs) in item.options" :key="indexs" :label="items.label" :value="items.value">
														</el-option>
													</el-select>
												</el-col>
											
											</el-row>
											<el-row>
												<el-col :span="20">
													<quill-editor v-model="item.content">
													</quill-editor>
												</el-col>
											</el-row>
										</div>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="16">
									<el-form-item label="规格选择(可多选)">
										<el-select v-model="sizevalue" multiple placeholder="请选择项目用到的规格" filterable>
											<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</el-card>
					<el-row class="bottombox inner-center">
						<el-button type="primary">发布项目</el-button>
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
				header_title: "新增上门项目",
				itemform: {
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
	.ql-editor {
		height: 14vh;
	}

	.positionbox .box {
		z-index: 999;
		position: absolute;
		top: 3.125rem;
		left: 6.25rem;
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
		height: 170px;
		line-height: 170px;
		text-align: center;
	}

	.avatar {
		width: 170px;
		height: 170px;
		display: block;
	}
</style>

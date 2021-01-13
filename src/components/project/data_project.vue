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
						<p>对平台的上门项目相关信息进行删除、审核、导入、导出等系统操作。</p>
					</div>
					<el-card class="margin20" shadow="hover">
						<el-table :data="tableData" style="width: 100%">
							<el-table-column type="expand" width="40">
								<template slot-scope="data">
									<div v-for="(item,index) in data.row.specification" :key="index" class="v-for-box">
										<div class="inner-left">
											<el-tag class="typetag">{{item.title}}</el-tag>
											<div>
												<div v-for="(items,indexs) in item.children" :key="indexs" class="box">
													{{indexs + 1}}-{{items.title}}
												</div>
											</div>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column type="index" width="50" label="序号">
							</el-table-column>
							<el-table-column prop="icon" label="项目图标" width="100">
								<template slot-scope="data">
									<img :src="require(`@/assets/itemicon/${data.row.icon}`)" alt="" class="itemicon">
								</template>
							</el-table-column>
							<el-table-column prop="title" label="项目名称" width="200">
							</el-table-column>
							<el-table-column prop="type" label="项目分类" width="150">
							</el-table-column>
							<el-table-column prop="description" label="服务介绍" width="250" show-overflow-tooltip>
								<template slot-scope="data">
									<span v-for="(item,index) in data.row.description" :key="index">{{item.title}}></span>
								</template>
							</el-table-column>
							<el-table-column prop="specification" label="项目规格" width="250" show-overflow-tooltip>
								<template slot-scope="data">
									<el-tag style="margin-right: 0.3125rem;" v-for="(item,index) in data.row.specification" :key="index">{{item.title}}</el-tag>									
								</template>
							</el-table-column>
							<el-table-column prop="time" label="创建时间" width="190">
								<template slot-scope="data">
									{{data.row.time | dateFormat}}
								</template>
							</el-table-column>
							<el-table-column label="上线状态" width="110">
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
				tableData: [{
						id: 1,
						title: '新生儿臀红护理',
						icon: '2020091811033659087.png',
						type: '基础护理',
						description: [{
								title: '服务简介',
							}, {
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
								]
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
								]
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
								]
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
				isopen: false,
				itemformdata: {
					name: '',
					isopen: false
				}
			}
		},
		created() {

		},
		methods: {
			// 07.分页栏目-跳转页
			current_change(val) {
			  this.table_page = val
			  // this.getTableJson()
			},
			// 06.分页栏目-分页数
			size_change(val) {
			  this.page_size = val
			  // this.getTableJson()
			},
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

<style>
	.typetag{
		margin-right: 1.25rem;
	}
	.v-for-box{
		border-bottom: #f0f0f0 0.0625rem solid;
		padding: 1.25rem 0;
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

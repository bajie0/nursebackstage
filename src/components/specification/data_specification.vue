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
						<p>对平台的规格相关信息进行删除、审核、导入、导出等系统操作。</p>
					</div>
					<el-card class="margin20">
						<el-table :data="tableData" style="width: 100%">
							<el-table-column type="index" width="70" label="序号">
							</el-table-column>
							<el-table-column type="expand">
								<template slot-scope="data">
									<div v-if="data.row.children">
										<div  v-for="(item,index) in data.row.children" :key="index" class="inner-left">
											<el-tag closable class="margin10" @close="tagclose">{{`${item.title}-${item.size}`}}</el-tag>
											<div style="padding-left: 2.5rem;">数量</div>
											<el-input-number @change="numchange" size="mini" v-model="item.number" :min="1"  class="width-2"></el-input-number>
										</div>
									</div>
									<div v-else>当前规格无绑定耗材</div>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="规格名称" width="250">
								<template slot-scope="data">
									<el-input v-model="data.row.name" @change="inputchange(data.row)"></el-input>
								</template>
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
								<div>
									<el-button type="warning" size="small" icon="el-icon-delete">删除</el-button>
								</div>
							</el-table-column>
						</el-table>
					</el-card>
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
				header_title: "规格管理",
				tableData: [{
						id: 1,
						name: '小换药',
						included:'Aaron_admin',
						datetime:'1610354226713',
						state: true,
						oeratingfee:55,
						children:[
							{
								id:'241',
								title:'一次性注射针管',
								size:'70ml/mol',
								number:1
							},
							{
								id:'211',
								title:'一次性纱布贴',
								size:'90.7ml/biol',
								number:1
							},
							{
								id:'1341',
								title:'一次性注射针管11',
								size:'70ml/mol',
								number:1
							},
							{
								id:'24',
								title:'一次性纱布贴1111',
								size:'90.7ml/biol',
								number:1
							}
						]
					},
					{
						id: 2,
						name: '中换药',
						oeratingfee:75,
						included:'Hui_lp',
						datetime:'1610354126713',
						state: false,
						children:[
							{
								id:'241',
								title:'一次性注射针管1111',
								size:'70ml/mol',
								number:1
							},
							{
								id:'211',
								title:'一次性纱布贴1111',
								size:'90.7ml/biol',
								number:1
							},
							{
								id:'1341',
								title:'一次性注射针管112222',
								size:'70ml/mol',
								number:1
							},
							{
								id:'24',
								title:'一次性纱布贴11112222',
								size:'90.7ml/biol',
								number:1
							}
						]
					},
					{
						id: 3,
						name: '大换药',
						oeratingfee:105,
						included:'Aaron_admin',
						datetime:'1610354126713',
						state: false
					},
					{
						id: 4,
						name: '特大换药',
						oeratingfee:125,
						included:'Hui_lp',
						datetime:'1610354126713',
						state: false
					},
					{
						id: 5,
						name: '10*20mg/l',
						oeratingfee:55,
						included:'Hui_lp',
						datetime:'1610354126713',
						state: false
					},
					{
						id: 6,
						name: '10*40mg/l',
						oeratingfee:55,
						included:'Aaron_admin',
						datetime:'1610354126713',
						state: false
					},
					{
						id: 7,
						name: '10*80mg/l',
						included:'Aaron_admin',
						oeratingfee:55,
						datetime:'1610354126713',
						state: false
					},
					{
						id: 8,
						name: '20*100mg/l,ploiew1.124',
						included:'Aaron_admin',
						oeratingfee:55,
						datetime:'1610354126713',
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
			//耗材数量变化
			numchange(){
				this.$message.success("修改成功")
			},
			//移除耗材
			tagclose(item){
				this.$confirm('确定要从该规格中删除该耗材吗？').then(()=>{
					this.$message.success("删除成功")
				})
			},
			//直接修改表单
			inputchange(row) {
				this.$message({
					type: 'success',
					message: '修改成功!'
				});
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

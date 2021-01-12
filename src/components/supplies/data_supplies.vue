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
					<div class="ui-container-header positionbox">
						<h2><i class="ion-ios-arrow-forward"></i>{{header_title}}</h2>
						<p>对平台的规格相关信息进行删除、审核、导入、导出等系统操作。</p>
						<div class="pright width-7 marginlr50" v-if="isbuild">
							<el-select v-model="value1" multiple placeholder="请选择" filterable class="width-17" multiple-limit="5">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
								<div slot="empty" class="inner-left">
									<div class="padding10">当前尚无可选的规格</div>
									<el-button type="primary" class="pright marginlr50" @click="addsize" size="mini">添加规格</el-button>
								</div>
							</el-select>
							<el-button type="primary" class="pright marginlr50" @click="build">绑定</el-button>
						</div>
						<el-button type="primary" class="pright marginlr50" v-if="!isbuild" @click="buildclick">与规格绑定</el-button>
					</div>
					<el-card class="margin20">
						<el-table :data="tableData" style="width: 100%" @selection-change="selectchange">
							<el-table-column type="selection" width="50">
							</el-table-column>
							<el-table-column type="index" width="70" label="序号">
							</el-table-column>
							<el-table-column prop="name" label="耗材名称" width="250">
							</el-table-column>
							<el-table-column prop="unit" label="耗材单位" width="250">
							</el-table-column>
							<el-table-column prop="price" label="耗材单价" width="250">
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
									<el-button type="primary" size="small" icon="el-icon-delete">编辑</el-button>
									<el-button type="warning" size="small" icon="el-icon-delete">删除</el-button>
								</div>
							</el-table-column>
						</el-table>
						<el-pagination class="margintb20" @size-change="handleSizeChange" @current-change="handleCurrentChange"
						 :current-page="currentpage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
						 :total="100">
						</el-pagination>
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
				isbuild: false, //是否绑定规格
				options: [],
				value1: [],
				idbox: '', //选择的id数组
				queryinfo: {
					query: '', //查找关键字
					pagesize: 10,
					pagenum: 1
				},
				toltal: 100,
				currentpage: 1,
				// Form表单Title
				header_title: "耗材管理",
				tableData: [{
						id: 1,
						name: '小换药',
						unit: '个',
						price: '',
						included: 'Aaron_admin',
						datetime: '1610354226713',
						state: true
					},
					{
						id: 2,
						name: '中换药',
						included: 'Hui_lp',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 3,
						name: '大换药',
						included: 'Aaron_admin',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 4,
						name: '特大换药',
						included: 'Hui_lp',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 5,
						name: '10*20mg/l',
						included: 'Hui_lp',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 6,
						name: '10*40mg/l',
						included: 'Aaron_admin',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 7,
						name: '10*80mg/l',
						included: 'Aaron_admin',
						datetime: '1610354126713',
						state: false
					},
					{
						id: 8,
						name: '20*100mg/l,ploiew1.124',
						included: 'Aaron_admin',
						datetime: '1610354126713',
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
			//添加规格
			addsize(){
				this.$router.push('/specification/add_specification')
			},
			//开启规格绑定
			buildclick() {
				this.isbuild = true
			},
			//耗材绑定规格
			build() {
				this.$message.success('耗材绑定规格成功！')
				this.isbuild = false
			},
			//监听选框选择
			selectchange(e) {
				console.log(e)
				let arr = []
				for (let item of e) {
					arr.push(item.id)
				}
				this.idbox = arr
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
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}

		}
	}
</script>

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
						<h2><i class="ion-ios-arrow-forward"></i>护士分配管理</h2>
						<p>对预约审核通过的病人进行分配护士操作。</p>
					</div>
					<!-- moresearch start -->
					<div class="ui-container-content">
						<div :class="more_link?'ui-container-table-search height':'ui-container-table-search'">
							<el-row>
								<el-col :span="6">
									<div class="ui-container-table-search-quick">
										<i class="ion-ios-search"></i>
										<el-input v-model="search_input" placeholder="请输入病人姓名..." @input="searchQuick" clearable></el-input>
									</div>
								</el-col>
							</el-row>
						</div>
						<!-- moresearch end -->

						<!-- Table start -->
						<div class="ui-container-table-content">
							<div class="ui-container-table-list">
								<el-table :data="tableData" height="100%" style="width: 100%" @selection-change="selection_change"
								 tooltip-effect="dark">
								 <el-table-column prop="state" label="分配状态" width="150" sortable="">
									 <template slot-scope="data">
										 <el-tag v-if="data.row.state == 0">New</el-tag>
										 <el-tag v-else type="warning">Repeat</el-tag>
									 </template>
								 </el-table-column>
									<el-table-column prop="name" label="病人姓名" width="150"></el-table-column>
									<el-table-column prop="itemtitle" label="预约项目" width="200"></el-table-column>
									<el-table-column prop="specification" label="规格" width="200"></el-table-column>
									<el-table-column prop="tohometime" label="上门时间" width="200" sortable=""></el-table-column>
									<el-table-column fixed="right" label="操作">
										<template slot-scope="scope">
											<el-button type="primary" size="mini" @click="distribution(scope.row)">{{scope.row.state == 0?'分配护士':'重新分配'}}</el-button>
											<el-button v-if="scope.row.state == 1" type="text" size="mini" @click="seedetail(scope.row)">查看</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="ui-container-table-page">
							<el-pagination @size-change="size_change" @current-change="current_change" :current-page="table_page"
							 :page-sizes="page_sizes" :page-size="page_size" layout="sizes, prev, pager, next, jumper, total" :total="table_total"
							 background></el-pagination>
						</div>
					</div>
					<!-- Table end -->
				</div>
			</el-main>
			<!-- 内容栏 end -->
		</el-container>

		<!-- 分配护士的对话框 -->
		<el-dialog title="分配护士" :visible.sync="dialogVisible" width="40%" @close="cancel">
			<el-form label-position="top">
				<el-form-item label="请选择护士" required="">
					<el-select v-model="nursename" multiple placeholder="请选择">
						<el-option v-for="item in nursenamelist" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="请输入备注">
					<el-input type="textarea" :rows="4" placeholder="请输入备注..." v-model="remarks">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="okclick">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 查看护士拒绝的对话框 -->
		<el-dialog title="拒单信息" :visible.sync="reboxshow" width="40%" @close="cancel">
			<table>
				<tr>
					<td>护士姓名：</td>
					<td>李丽丽</td>
				</tr>
				<tr>
					<td>工号：</td>
					<td>5412</td>
				</tr>
				<tr>
					<td>拒单理由:</td>
					<td>今天加班没时间上门</td>
				</tr>
			</table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="okclick">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>
<script>
	import {
		ApiData,
		ApiCreate,
		ApiPatch,
		ApiDelete,
		ApiUpload,
		ApiDownload,
		ApiState
	} from '@/axios/axios'

	export default {
		data() {
			return {
				reboxshow:false,  //护士拒绝原因的对话框
				nursename:'',   //选择的护士数组
				//多选护士
				nursenamelist: [{
					value: '选项1',
					label: '护士xx'
				}, {
					value: '选项2',
					label: '护士xx'
				}, {
					value: '选项3',
					label: '护士xxx'
				}, {
					value: '选项4',
					label: '护士xxxx'
				}, {
					value: '选项5',
					label: '护士xxxxx'
				}],
				dialogVisible: false, //分配护士对话框
				remarks: '', //备注信息
				// Form表单设置
				labelSearchPosition: 'top', // 文字朝向
				labelSearchWidth: '100px', // label宽度
				searchForm: {
					table_page: "",
					page_size: "",
					search_input: "",
					// 更多查询
					power_type: "",
					itemtitle: "",
					identitynum: "",
					power_state: "",
					name: "",
					licensenum: "",
					phonenum: ""
				},
				// 列表显示方式
				display_mode: "list",
				more_link: false,
				// 快捷搜索
				search_input: '',
				// Table数据
				tableData: [{
						id: '',
						state:'0',
						name: '阿狸',
						itemtitle: '留置胃管',
						specification: '小换药',
						tohometime: '2021-02-14 15:30'
					},
					{
						id: '',
						state:'0',
						name: '阿狸111',
						itemtitle: '留置胃管111',
						specification: '小换药',
						tohometime: '2021-02-14 15:30'
					},
					{
						id: '',
						state:'1',
						name: '阿狸2222',
						itemtitle: '留置胃管2222',
						specification: '小换药',
						tohometime: '2021-02-15 15:30'
					},
					{
						id: '',
						name: '阿狸',
						state:'0',
						itemtitle: '留置胃管',
						specification: '小换药3333',
						tohometime: '2021-02-14 15:30'
					},
					{
						id: '',
						name: '阿狸',
						state:'0',
						itemtitle: '留置胃管',
						specification: '小换药33334444',
						tohometime: '2021-02-14 15:30'
					},
					{
						id: '',
						name: '阿狸',
						state:'0',
						itemtitle: '留置胃管',
						specification: '小换药',
						tohometime: '2021-02-14 15:30'
					},
					{
						id: '',
						name: '阿狸',
						state:'0',
						itemtitle: '留置胃管',
						specification: '小换药',
						tohometime: '2021-02-14 15:30'
					},
					{
						id: '',
						name: '阿狸',
						state:'0',
						itemtitle: '留置胃管',
						specification: '小换药',
						tohometime: '2021-02-14 15:30'
					}
				],
				multipleSelection: [],
				multipleTable: '',
				// 加载中组件
				loading: true,
				// 分页栏目-当前页
				table_page: 1,
				// 分页栏目-数据总量
				table_total: 4000,
				// 分页-每页数量条数
				page_sizes: [20, 50, 100, 200],
				// 分页-分页条数
				page_size: 20,
				// 权限分类筛选
				power_type: [{
					text: '系统级',
					value: 1
				}, {
					text: '页面级',
					value: 2
				}, {
					text: '功能级',
					value: 3
				}],
				// 审核筛选
				power_state: [{
					text: '通过',
					value: true
				}, {
					text: '待审',
					value: false
				}],
				// 上级权限
				power_data: [],
			}
		},
		created() {
			// this.getTableJson(this.searchForm)
			// this.getPowerJson()
		},
		methods: {
			//查看拒绝详细信息
			seedetail(){
				this.reboxshow = true
			},
			//分配护士的操作确定/取消
			okclick(){
				if(this.nursename.length != 0) return this.dialogVisible = false
				this.$message.error('请选择护士')				
			},
			cancel(){
				this.dialogVisible = false
				this.nursename = []
				this.remarks = ''
			},
			// 01.搜索栏目 - 更多
			MoreLink() {
				this.more_link = !this.more_link
			},
			// 03.更多Form重置
			searchReset(searchForm) {
				this.$refs[searchForm].resetFields()
				this.getTableJson()
				this.more_link = !this.more_link
			},
			// 04.快捷Form查询
			searchQuick() {
				this.getTableJson(this.table_page, this.page_size, this.searchForm, this.search_input)
			},
			// 05.全选数据
			selection_change(val) {
				this.multipleTable = []
				this.multipleSelection = val
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.multipleTable = this.multipleTable + ',' + this.multipleSelection[i]['id']
				}
				if (this.multipleTable.length === 0) {
					this.multipleTable = ""
				} else {
					this.multipleTable = this.multipleTable.substr(1)
				}
			},
			// 06.分页栏目-分页数
			size_change(val) {
				this.page_size = val
				// this.getTableJson()
			},
			// 07.分页栏目-跳转页
			current_change(val) {
				this.table_page = val
				// this.getTableJson()
			},
			// 08.引入TableJson
			getTableJson() {
				let url = "/api/get/power_list/"
				this.searchForm.table_page = this.table_page
				this.searchForm.page_size = this.page_size
				this.searchForm.quick_search = this.search_input
				ApiData(url, this.searchForm).then((response) => {
					this.tableData = response.data
					this.page_size = response.page_size
					this.table_total = response.table_total
					this.table_page = response.table_page
					this.loading = false
				})
			},
			// 09.分配护士
			distribution(row) {
				this.dialogVisible = true
			},


			// 11.Table数据 - 开关操作
			changeSwitch($event, row) {
				let url = "/api/state/power/"
				let params = {
					"id": row,
					"state": $event
				}
				ApiState(url, params).then((response) => {
					this.$message.success(response)
					this.getTableJson()
				})
			},

			// 16.权限分类 - 筛选
			typeTag(value, row) {
				return row.power_type === value;
			},
			// 17.审核状态 - 筛选
			stateTag(value, row) {
				return row.power_state === value;
			},
			// 18.引入权限json
			// getPowerJson() {
			//   let url = "/api/get/power_select/"
			//   ApiData(url).then((response) => {
			//     this.power_data = response.data
			//   })
			// }
		}
	}
</script>

<style>
	.extendtable>tr>td:nth-of-type(1) {
		width: 9.375rem;
		font-weight: 600;
	}
</style>

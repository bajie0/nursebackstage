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
				<div class="ui-container paddinglr40">
					<div class="margintb30">
						<div class="margintb10">
							<span class="text">总览</span>
						</div>
						<div class="inner-justify">
							<el-card shadow="hover">
								<div class="inner-column-center">
									<div class="inner-justify width-19">当前项目数<el-tag>项</el-tag>
									</div>
									<animate-number from="0" to="51" duration="3000" class="number"></animate-number>
								</div>
							</el-card>
							<el-card shadow="hover">
								<div class="inner-column-center">
									<div class="inner-justify width-19">当前护士数<el-tag>人</el-tag>
									</div>
									<animate-number from="0" to="221" duration="3000" class="number"></animate-number>
								</div>
							</el-card>
							<el-card shadow="hover">
								<div class="inner-column-center">
									<div class="inner-justify width-19">今日预约量<el-tag>个</el-tag>
									</div>
									<animate-number from="0" to="101" duration="3000" class="number"></animate-number>
								</div>
							</el-card><el-card shadow="hover">
								<div class="inner-column-center">
									<div class="inner-justify width-19">订单已完成<el-tag>条</el-tag>
									</div>
									<animate-number from="0" to="51" duration="3000" class="number"></animate-number>
								</div>
							</el-card><el-card shadow="hover">
								<div class="inner-column-center">
									<div class="inner-justify width-19">中途终止<el-tag>条</el-tag>
									</div>
									<animate-number from="0" to="2" duration="3000" class="number"></animate-number>
								</div>
							</el-card>
							<el-card shadow="hover">
								<div class="inner-column-center">
									<div class="inner-justify width-19">退款订单<el-tag>条</el-tag>
									</div>
									<animate-number from="0" to="5" duration="3000" class="number"></animate-number>
								</div>
							</el-card>
						</div>
					</div>
					<div class="clearfloat box3">
						<div class="fl" style="width: 63%;">
							<div class="margintb10">
								<span class="text">护士行程监督</span>
							</div>
							<div class="inner-justify">
								<el-card shadow="hover">
									<div class="inner-column-center">
										<div class="inner-justify width-19">待接单<el-tag>项</el-tag>
										</div>
										<animate-number from="0" to="12" duration="3000" class="number"></animate-number>
									</div>
								</el-card>
								<el-card shadow="hover">
									<div class="inner-column-center">
										<div class="inner-justify width-19">已到达<el-tag>个</el-tag>
										</div>
										<animate-number from="0" to="3" duration="3000" class="number"></animate-number>
									</div>
								</el-card>
								<el-card shadow="hover">
									<div class="inner-column-center">
										<div class="inner-justify width-19">服务开始<el-tag>条</el-tag>
										</div>
										<animate-number from="0" to="8" duration="3000" class="number"></animate-number>
									</div>
								</el-card>
								<el-card shadow="hover">
									<div class="inner-column-center">
										<div class="inner-justify width-19">服务完成<el-tag>条</el-tag>
										</div>
										<animate-number from="0" to="17" duration="3000" class="number"></animate-number>
									</div>
								</el-card>
							</div>
						</div>
						<div class="fr box4" style="width: 33%;">
							<div class="margintb10">
								<span class="text">病人预约审核</span>
							</div>
							<div class="inner-justify">
								<el-card shadow="hover">
									<div class="inner-column-center">
										<div class="inner-justify width-19">待审核<el-tag>项</el-tag>
										</div>
										<animate-number from="0" to="12" duration="3000" class="number"></animate-number>
									</div>
								</el-card>
								<el-card shadow="hover">
									<div class="inner-column-center">
										<div class="inner-justify width-19">待分配<el-tag>个</el-tag>
										</div>
										<animate-number from="0" to="3" duration="3000" class="number"></animate-number>
									</div>
								</el-card>
							</div>
						</div>
					</div>
					<div class="clearfloat margintb30">
						<!-- 订单状态实时预览图 -->

							<div id="order" style="width: 40%;height: 25rem;" class="fl"></div>
	
												
						<!-- 病人预约实时预览图 -->

							<div id="reservation" style="width:55%;height: 25rem;" class="fr"></div>

					</div>
				</div>
			</el-main>
			<!-- 内容栏 end -->
		</el-container>
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
		mounted() {
			let echarts = require('echarts');
			let option = {
				title: {
					text: '订单状态实时总览'
				},
				color: ['#2d8cf0'],
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: ['新订单', '已驳回', '待分配', '重分配', '待响应', '待出发', '行程中', '已中断', '服务中', '已完成'],
					axisTick: {
						alignWithLabel: true
					}
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					type: 'bar',
					barWidth: '60%',
					data: [10, 1, 4, 1, 14, 21, 5, 1, 26, 17]
				}]
			};
			let option_ = {
				title: {
					text: '病人预约实时总览'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
			    xAxis: {
			        type: 'category',
			        data: ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00']
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [{
			        data: [12, 17, 41, 54, 21, 17,12, 17, 41, 54, 21, 17,12],
			        type: 'line',
			        smooth: true
			    }]
			};

			let orderChart = echarts.init(document.getElementById('order'));
			orderChart.setOption(option);
			orderChart.on('click', () => {
				this.$router.push('/order/data_order')
			});
			
			let reservationChart = echarts.init(document.getElementById('reservation'));
			reservationChart.setOption(option_);
		},
		data() {
			return {}
		}
	}
</script>

<style scoped="">
	.el-card:hover{
		cursor: pointer;
	}
	.text{
		padding-left: 0.625rem;
	}
	.ui-container .el-card {
		width: 15%;
		height: unset;
		padding: 0;
	}
	.ui-container .el-card__body{
		padding-left:0 ;
		padding-right:0 ;
	}

	.number {
		font-size: 2.5rem;
		font-weight: 500;
	}
	.box1{
		width:15.625rem!important;
		margin: 1.875rem 0;
	}
	.text{
		border-left:0.4375rem solid #2d8cf0;		
		margin: 1.875rem 0 1.25rem 0;
	}
	.box3 .el-card{
		width: 25%;
		margin: 0 0.625rem;
	}
	.box4 .el-card{
		width: 45%;
		margin: 0 0.625rem;
	}
</style>

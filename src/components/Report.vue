<template>
	<div class="reportBody">
		<div class="buttonBox" style="background-color: white;">
			<el-button-group>
				<el-button type="info" plain>数据统计</el-button>
				<!-- <el-button type="info" plain>按月汇总</el-button> -->
			</el-button-group>
		</div>
		<div id="myRateChart"></div>
		<div id="myLikeChart"></div>
		<div id="myCategoryChart"></div>
	</div>
</template>

<script>
	import {
		getCurrentInstance
	} from 'vue';
	export default {
		name: 'Report',
		data() {
			return {
				getPicture: false,
			};
		},
		setup() {
			const {
				proxy
			} = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
			// 路由信息
			// console.log(proxy.$systemName) // 全局挂载对象
			return {
				proxy
			};
		},
		mounted() {
			const {
				proxy
			} = getCurrentInstance();
			proxy.drawRatePicture(proxy);
			proxy.drawLikePicture(proxy);
			proxy.drawCategoryPicture(proxy);
		},
		methods: {
			drawRatePicture(proxy) {
				proxy.$axios.get('api/book/report/rate').then(res => {
					setTimeout(() => {
						let titleList = [];
						let rateList = [];
						console.log(res.data.data);
						let outdata = JSON.stringify(res.data.data);
						console.log(outdata);
						let xqo = eval('(' + outdata + ')');
						for(var i in xqo) {
							titleList.push(xqo[i][0]);
							rateList.push(xqo[i][1]);
						}
						console.log(titleList);
						console.log(rateList);
						var option = {
							title: {
								text: '图书评分排名统计',
								left: 'center',
							},
							tooltip: {},
							legend: {},
							xAxis: {
							    name: '图书标题',
								type: 'category',
								data: titleList
							},
							yAxis: {
								name: '评分',
								type: 'value',
							},
							series: [{
								// name: '评分排名统计',
								data: rateList,
								type: 'bar',
								label: {
								      show: true
								    },
							}]
						};
						proxy.getPicture = true;
						let myChart = proxy.$echarts.init(document.getElementById('myRateChart'));
						myChart.setOption(option);
						
					})
				})
			},
			drawLikePicture(proxy) {
				proxy.$axios.get('api/book/report/like').then(res => {
					setTimeout(() => {
						let titleList = [];
						let likeList = [];
						console.log(res.data.data);
						let outdata = JSON.stringify(res.data.data);
						console.log(outdata);
						let xqo = eval('(' + outdata + ')');
						for(var i in xqo) {
							titleList.push(xqo[i][0]);
							likeList.push(xqo[i][1]);
						}
						console.log(titleList);
						console.log(likeList);
						var option = {
							title: {
								text: '热门推荐图书统计',
								left: 'center'
							},
							tooltip: {
							},
							legend: {},
							xAxis: {
							    name: '图书标题',
								type: 'category',
								data: titleList
							},
							yAxis: {
								name: '被推荐数',
								type: 'value',
							},
							series: [{
								// name: '排名统计',
								data: likeList,
								type: 'bar',
								label: {
								      show: true
								    },
							}]
						};
						let myChart = proxy.$echarts.init(document.getElementById('myLikeChart'));
						myChart.setOption(option);
					})
				})
			},
			drawCategoryPicture(proxy) {
				proxy.$axios.get('api/book/report/cate').then(res => {
					setTimeout(() => {
						let data = [];
						console.log(res.data.data);
						let outdata = JSON.stringify(res.data.data);
						console.log(outdata);
						let xqo = eval('(' + outdata + ')');
						for(var i in xqo) {
							var obj = new Object();
							obj.name = xqo[i][0]
							obj.value = xqo[i][1]
							data[i] = obj
						}
						console.log(data)
						var option = {
							title: {
								text: '图书分类统计',
								left: 'center'
							},
							tooltip: {
								trigger: 'item'
							},
							legend: {
								orient: 'vertical',
								left: 'left',
							},
							series: [{
								// name: '排名统计',
								data: data,
								type: 'pie',
								radius: '50%',
								emphasis: {
								    itemStyle: {
								    shadowBlur: 10,
								    shadowOffsetX: 0,
								    shadowColor: 'rgba(0, 0, 0, 0.5)',
									},
								},
							}],
						};
						let myChart = proxy.$echarts.init(document.getElementById('myCategoryChart'));
						myChart.setOption(option);
					})
				})
			},
		}
	};
</script>

<style lang="stylus">
	.reportBody
		width 100%
		height 100%
	#myRateChart
		margin-top 3%
		width 90%
		height 95%
	#myLikeChart
		width 90%
		height 95%
	#myCategoryChart
		width 90%
		height 95%
</style>

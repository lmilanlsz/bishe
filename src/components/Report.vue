<template>
	<div class="reportBody">
		<div class="buttonBox" style="background-color: white;">
			<el-button-group>
				<el-button type="info" plain>数据统计</el-button>
				<!-- <el-button type="info" plain>按月汇总</el-button> -->
			</el-button-group>
		</div>
		<div id="myChart"></div>
	</div>
</template>

<script>
	import {
		getCurrentInstance
	} from 'vue';
	export default {
		name: 'Report',
		data() {
			return {};
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
			proxy.drawPicture(proxy);
		},
		methods: {
			drawPicture(proxy) {
				
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
								data: rateList,
								type: 'bar'
							}]
						};
						let myChart = proxy.$echarts.init(document.getElementById('myChart'));
						myChart.setOption(option);
					})
				})
			}
		}
	};
</script>

<style lang="stylus">
	.reportBody
		width 100%
		height 100%
		#myChart
			width 99%
			height 95%
</style>

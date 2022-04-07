<template>
	<div id="BookDetail">
		<div class="page_header">
			<el-page-header :icon="ArrowLeft" content="图书详情" @back="back()"/>
		</div>
		<div class="el-main">
			<div class="cover">
				<el-image :src="require('@/assets/img/' + proxy.book.book_img)" :fit="'cover'" />
			</div>
			<!-- <el-descriptions 
				title="图书详情"
				style="margin-top: 5%;width: 60%;margin-left: 20%"
				size="large"
				direction="vertical"
				>
			<el-descriptions-item label="图书编号" width="100%">{{proxy.book.book_id}}</el-descriptions-item>
		    <el-descriptions-item label="图书标题" width="100%">{{proxy.book.book_title}}</el-descriptions-item>
			<el-descriptions-item label="图书作者" width="100%">{{proxy.book.book_author}}</el-descriptions-item>
			</el-descriptions> -->
			<el-card class="box-card">
			    <template #header>
			        <div class="card-header">
						<span>图书详情</span>
			        </div>
					<div class="card-item">
						<span><p>图书标题: {{proxy.book.book_title}}</p></span>
					</div>
			    </template>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { ArrowLeft } from '@element-plus/icons'
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	export default {
		components: {ArrowLeft},
		data() {
			return {
				book:[],
			}
		},
		setup() {
			const { proxy } = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
			return {
				proxy
			};
		},
		mounted() {
			const { proxy } = getCurrentInstance();
			var book_id = Qs.stringify({'book_id': proxy.$store.state.book_id})
			proxy.$axios.post('api/book/detail', book_id).then(res => {
				proxy.book = res.data.data;
				console.log('book' + proxy.$store.state.token);
				console.log(res.data);
			});
		},
		methods: {
			back() {
				this.$router.push('/mainpage');
			},
		}
	}
</script>

<style>
	.page_header {
		margin-top: 5%;
		margin-left: 5%;
	}
	.cover {
		width: 20%;
		height: 20%;
		align-center: center;
		margin-left: 30%;
		margin-top: 5%;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		font-size: 25px;
		text-align: center;
	}
	
	.card-item {
		margin-top: 10%;
		margin-bottom: 18px;
		font-size: 18px;
		text-align: left;
	}
	
	.box-card {
		width: 480px;
	}
</style>

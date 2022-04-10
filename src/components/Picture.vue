<template>
	<div id="picture">
		<div class="cover">
			<el-image :src="require('@/assets/img/' + proxy.book.book_img)" :fit="'cover'"/>
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
				activeNames: ['1'],
				reviews: {
					username:'',
					review_rate:'',
					review_content:'',
				},
				review:[],
				url:'@/assets/img/',
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
				console.log('@/assets/img/'+ proxy.book.book_img);
				console.log(res.data);
			});
			proxy.$axios.post('api/review/byBook', book_id).then(res => {
				if(res.data.code == 200)
				proxy.reviews = res.data.data;
				
				console.log('有没有'+res.data);
			});
		},
		methods: {
			back() {
				this.$router.push('/mainpage');
			},
			handleChange(val) {
				console.log(val);
			},
			
		}
	}
</script>

<style>
	.cover {
		width: 20%;
		height: 20%;
		align-center: center;
		margin-left: 37%;
		margin-top: 5%;
		margin-right: 0;
		margin-bottom: 3%;
		border-radius: 3px;
	}
</style>

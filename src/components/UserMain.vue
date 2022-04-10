<template>
	<div id="UserMain" v-if="getData">
		<div class="bookList" v-for="book in books">
			<el-card :body-style="{ padding: '0px' }" class="card" @click="handleDetail(book)">
				<div class="img">
					<img
						:src="require('@/assets/img/' + book.book_img)"
						class="image"
						:fit="'cover'"
					/>
				</div>
			    <div style="padding: 14px">
					<span>{{book.book_title}}</span>
					<div class="bottom">
						<el-rate
							v-model="book.book_rate"
							disabled
							show-score
							text-color="#ff9900"
						/>
			        </div>
			    </div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import {
		getCurrentInstance
	} from 'vue';
	import Qs from 'qs';
	let proxy;
	export default {
		name: "UserMain",
		data() {
			return {
				books: {
					book_id: '',
					book_title: '',
					book_img: '',
					book_rate: '',
				},
				book: {
					book_id: '',
					book_title: '',
					book_img: '',
					book_rate: '',
				},
				getData: false,
				book_id: '',
				book_imf: '',
			};
		},
		setup() {
			const { proxy } = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
			// 路由信息
			// console.log(proxy.$systemName) // 全局挂载对象
			return {
				proxy
			};
		},
		mounted() {
			const { proxy } = getCurrentInstance();
			proxy.$axios.get('api/book/byRateNum').then(res => {
					proxy.books = res.data.data;
					console.log('books' + proxy.$store.state.token);
					console.log(res.data);
					proxy.getData = true;
			});
		},
		methods: {
			handleDetail(book) {
				this.$router.push('/bookdetail');
				this.$store.state.book_id = book.book_id;
			},
		}
	}
</script>

<style scoped="scoped">
	.bookList {
		margin-left: 10%;
	}
	
	[v-cloak]{
	        display: none;
	    }
	
	.card {
		height: 10%;
		width: 20%;
		float: left;
		display: flex;
		margin-left: 7%;
		margin-top: 3%;
	}
	
	.bottom {
	  margin-top: 13px;
	  line-height: 12px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-left: 25%;
	}
	
	.button {
	  padding: 0;
	  min-height: auto;
	}
	
	.image {
	  width: 300px;
	  height: 400px;
	  display: block;
	}
</style>

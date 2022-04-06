<template>
	<div id="Mainpage">
		<div class="common-layout">
			<el-container>
				<div class="title">
					<ul>图书推荐分享平台</ul>
				</div>
				<el-header>
					<MainNavi @changeCom="changeCom"></MainNavi>
					<!-- <AdminNavi @changeCom="changeCom"></AdminNavi> -->
				</el-header>
				<!-- <el-divider direction="horizontal"></el-divider> -->
				<el-main><transition mode="out-in"><component :is="comName"></component></transition></el-main>
			</el-container>
		</div>
	</div>
</template>

<script>
	import {
		getCurrentInstance
	} from 'vue';
	import Qs from 'qs';
	import MainNavi from '../components/MainNavi.vue';
	import UserInfo from '../components/UserInfo.vue';
	import WishList from '../components/WishList.vue';
	import UserBookList from '../components/UserBookList.vue';
	import UserMain from '../components/UserMain.vue';
	import AdminNavi from '../components/AdminNavi.vue';
	import UserReview from '../components/UserReview.vue'
	let proxy;
	export default {
		name: 'MainPage',
		components: {
			MainNavi,
			UserInfo,
			UserMain,
			WishList,
			UserBookList,
			AdminNavi,
			UserReview,
		},
		setup() {
			proxy = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
			return {
				proxy
			};
		},
		data() {
			return {
				// user: '',
				comName: 'UserMain',
			}
		},
		mounted() {
			const {
				proxy
			} = getCurrentInstance();
			proxy.$axios.get('api/user/list').then(res => {
				proxy.user = res.data.data;
				console.log('user_id: ' + proxy.$store.state.user_id);
				console.log('user_pwd:' + proxy.$store.state.user_pwd);
				console.log(res.data);
			});
		},
		methods: {
			changeCom:function(msg){
				console.log(proxy.data.comName)
				proxy.data.comName = msg
				console.log(proxy.data.comName)
			},
		}
	}
</script>

<style>
	.title {
		font-weight: 700;
		font-size: 35px;
		line-height: 1.5;
		margin-bottom: 10px;
		color: rgba(0, 0, 0, 0.85);
		font-family: "microsoft yahei";
	}
</style>

<template>
	<div id="AdminNavi">
	<el-row class="tac">
		<el-col :span="24">
			<template #default="scope">
			<el-menu :unique-opened="true" 
				default-active="1" 
				class="el-menu-demo" 
				mode="horizontal"
				@select="select">
				<el-menu-item index="1">首页</el-menu-item>
				<!-- <el-sub-menu index="2">
					<template #title>Workspace</template>
					<el-menu-item index="2-1">item one</el-menu-item>
					<el-menu-item index="2-2">item two</el-menu-item>
					<el-menu-item index="2-3">item three</el-menu-item>
					<el-sub-menu index="2-4">
						<template #title>item four</template>
						<el-menu-item index="2-4-1">item one</el-menu-item>
						<el-menu-item index="2-4-2">item two</el-menu-item>
						<el-menu-item index="2-4-3">item three</el-menu-item>
					</el-sub-menu>
				</el-sub-menu> -->
				<el-menu-item index="2">图书列表</el-menu-item>
				<el-menu-item index="3">愿望单</el-menu-item>
				<!-- <el-menu-item index="4">个人信息</el-menu-item> -->
				<el-submenu index="4">
					<template #title>个人信息</template>
					<el-menu-item index="4-1">信息修改</el-menu-item>
					<el-menu-item index="4-2">我的评价</el-menu-item>
					<el-menu-item index="4-3" @click="quit">退出登录</el-menu-item>
				</el-submenu>
			</el-menu>
			</template>
		</el-col>
	</el-row>
	</div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { User, View } from '@element-plus/icons';
import Qs from 'qs';
let proxy;
export default {
	props:{
		
	},
	components:{
		User, View
	},
	data() {
		return {
		}
	},
	setup() {
		proxy = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
		console.log("proxy")
		console.log(proxy); // 路由信息
		// console.log(proxy.$systemName) // 全局挂载对象
		return {
			proxy
		};
		
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
		select(key, keyPath) {
			console.log(key, keyPath);
			let str = "";
			if(key == "1") {
				str = "UserMain"
			}else if(key == "2") {
				str = "UserBookList"
			}else if(key == "3") {
				str = "WishList"
			} else if(key == "4-1") {
				str = "UserInfo"
			} else if(key == "4-2") {
				str = "UserReview"
			}
			console.log(str)
			proxy.emit("changeCom", str)
		},
		quit(){
			this.$store.state.token = ''
			console.log("token" + this.$store.state.token)
			this.$router.push({
				path:'/login',
			})
		},
		
	}
};
</script>

<style lang="stylus" scoped>
	.title 
		font-weight: 700;
		font-size: 35px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.85);
		font-family: "microsoft yahei";
		margin-top 15px;
	.tac
		width 100%
		padding 0
		margin 0
		margin-top 20px
</style>
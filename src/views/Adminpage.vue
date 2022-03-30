<template>
	<el-container style="height: 100%;">
		<el-aside><AdminNavi @changeCom="changeCom"></AdminNavi></el-aside>
		<el-divider direction="vertical"></el-divider>
		<el-container>
			<el-header>
				<el-row :span="24" type="flex" justify="end">
					<el-col :span="4"><a>用户：admin</a></el-col>
					<el-col :span="1"><a @click="quit">退出</a></el-col>
				</el-row>
			</el-header>
			<el-main style="height: 100%;padding: 0;">
				<transition mode="out-in"><component :is="comName"></component></transition>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import AdminNavi from '../components/AdminNavi.vue';
	import BookList from '../components/BookList.vue';
	import GoodsList from '../components/GoodsList.vue';
	import UserList from '../components/UserList.vue'
	import Report from '../components/Report.vue'
	import ReviewList from '../components/ReviewList.vue'
	import { getCurrentInstance } from 'vue';
	let proxy;
	export default {
		name: 'Adminpage',
		components: {
			AdminNavi,
			BookList,
			GoodsList,
			UserList,
			Report,
			ReviewList
		},
		setup() {
			proxy = getCurrentInstance();
			return{
				proxy
			};
		},
		data() {
			return {
				comName: 'UserList',
			};
		},
		methods:{
			changeCom:function(msg){
				console.log(proxy.data.comName)
				proxy.data.comName = msg
			},
			quit(){
				this.$store.state.token = ''
				console.log("token" + this.$store.state.token)
				this.$router.push({
					path:'/login',
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.el-container
	margin-top 0px
	height 100%
	width 100%
	padding 0
	margin 0
	.user
		font-size 30px
		display flex
		flex-direction row
	.el-header
		padding-top 18px
		a:hover
			color #409eff
		a
			display inline-flex
			flex-direction row
			align-items center
			justify-content center
			vertical-align middle
			position relative
			text-decoration none
			outline none
			cursor pointer
			padding 0
			font-size 14px
			font-weight 500
			text-decoration none
	.el-divider
		width 2px
		height 100%
		margin 0
	.el-aside
		background-color #545c64
		min-height 500%
		min-width 20%
		padding 0
		margin 0
	.el-main
		background-color #f1f2f6
</style>

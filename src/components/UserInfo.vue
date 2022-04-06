<template>
	<div id="UserInfo">
		<!-- <el-table :data="users" style="width: 100%;">
			<el-table-column prop="user_id" label="用户编号" width="160"></el-table-column>
			<el-table-column prop="username" label="用户名" width="150"></el-table-column>
			<el-table-column prop="user_pwd" label="用户密码" width="130"></el-table-column>
			<el-table-column prop="is_admin" label="是否为管理员" width="130">
				<template #default="scope">
					<template v-if="scope.row.is_admin == 1">
						<el-tag class="mx-1" size="large">是</el-tag>
					</template>
					<template v-else>
						<el-tag class="mx-1" size="large">否</el-tag>
					</template>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)">删除</el-button>
				</template>
			</el-table-column>
		</el-table> -->
		<el-descriptions title="用户信息"  
			v-for="user in users" 
			style="margin-top: 15%;width: 60%;margin-left: 20%"
			border>
		  <el-descriptions-item label="用户编号">{{user.user_id}}</el-descriptions-item>
		  <el-descriptions-item label="用户名">{{user.username}}</el-descriptions-item>
		  <el-descriptions-item label="用户密码">{{user.user_pwd}}</el-descriptions-item>
		  <el-descriptions-item label="是否为管理员">
		    <template #default="scope">
		    	<template v-if="user.is_admin == 1">
		    		<el-tag class="mx-1" size="large">是</el-tag>
		    	</template>
		    	<template v-else>
		    		<el-tag class="mx-1" size="large">否</el-tag>
		    	</template>
		    </template>
		  </el-descriptions-item>
		  <el-descriptions-item label="修改信息">
			  <!-- <template #default="scope"> -->
				  <el-button size="small" type="text" @click="handleEdit(user.username, user, proxy)">编辑</el-button>
			  <!-- </template> -->
		  </el-descriptions-item>
		</el-descriptions>
		<el-dialog title="编辑信息" v-model="dialogTableVisible" center width="27%">
			<el-form ref="userInfo" :model="userInfo" :rules="rules" :label-position="right" label-width="80px">
				<!-- <el-form-item label="用户编号" prop="user_id">
					<el-input v-model="userInfo.user_id"></el-input>
				</el-form-item> -->
				<el-form-item label="用户名" prop="username">
				<el-input
				      name="username"
				      type="text"
					  @keyup.enter.native="onSubmit"
				      v-model="userInfo.username"
				      autocomplete="on"
				  >
				  </el-input>
				</el-form-item>
				<el-form-item label="修改密码" prop="user_pwd">
				  <el-input
				      name="user_pwd"
				      :type="pwdType"
				      @keyup.enter.native="onSubmit"
				      v-model="userInfo.user_pwd"
				      autocomplete="on"
				  >
				    <template #suffix>
				       <el-icon class="el-input__icon" @click="showPwd()"><user /></el-icon>
				    </template>
				  </el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPwd">
				  <el-input
				      name="checkPwd"
				      :type="pwdType"
				      @keyup.enter.native="onSubmit"
				      v-model="userInfo.checkPwd"
				      autocomplete="on"
				  >
				    <template #suffix>
				       <el-icon class="el-input__icon" @click="showPwd()"><user /></el-icon>
				    </template>
				  </el-input>
				</el-form-item>
				<el-form-item size="large">
					<el-button type="primary" @click="onSubmit('userInfo', proxy)" style="margin-right: 10%;">确定</el-button>
					<el-button @click="handleCancel(proxy)" style="margin-right: 20%;">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
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
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('确认密码不能为空'));
			} else if (value !== this.userInfo.user_pwd) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			userInfo: {
				user_id: '',
				username: '',
				user_pwd:'',
				checkPwd:'',
			},
			users: {
				user_id: '',
				username: '',
				user_pwd:'',
				checkPwd:'',
				is_admin: '',
			},
			pwdType: "password",
			rules: {
				username: [
					{  required: true, message: '用户名不能为空', trigger: 'blur' },
					{
						min: 1,
						max: 10,
						message: '用户名长度请控制在1-10个字符'
					}
				],
				user_pwd: [
					{  required: true, message: '密码不能为空', trigger: 'blur' },
					{
						min: 5,
						max: 20,
						message: '请检查输入密码是否规范，密码长度为8-20个字符',
						trigger: 'blur'
					}
				],
				checkPwd: [
					{  required: true, message: '确认密码不能为空', trigger: 'blur' },
					{
						min: 5,
						max: 20,
						message: '请检查输入密码是否规范，密码长度为8-20个字符',
						trigger: 'blur'
					},
					{ validator: validatePass, trigger: 'blur' }
				]
			},
			dialogTableVisible: false,
			dialogTableVisible1: false,
		}
	},
	setup() {
		let   proxy = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
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
		var user_id = Qs.stringify({"user_id": proxy.$store.state.user_id});
		console.log(user_id);
		proxy.$axios.post('api/user/info', user_id).then(res => {
			proxy.users = res.data.data;
			console.log('user_id: ' + proxy.$store.state.user_id);
			console.log('user_pwd:' + proxy.$store.state.user_pwd);
			console.log(proxy.users);
		});
	},
	methods: {
		dialog(){
			this.dialogTableVisible1 = true;
			console.log("弹窗出不来");
			console.log(proxy.dialogTableVisible1);
		},
		quit(){
			this.$store.state.token = ''
			console.log("token" + this.$store.state.token)
			this.$router.push({
				path:'/login',
			})
		},
		showPwd() {
		  if (this.pwdType === "password") {
		    this.pwdType = "";
		  } else {
		    this.pwdType = "password";
		  }
		},
		handleEdit(index, row, proxy) {
			proxy.user_id = row.user_id;
			proxy.userInfo = JSON.parse(JSON.stringify(row));
			this.dialogTableVisible = true;
			console.log("弹窗呢")
		},
		onSubmit(formName, proxy) {
			console.log("提交表单")
			this.$refs[formName].validate(valid => {
				console.log("进行表单验证")
				if (valid) {
					console.log('验证通过');
					console.log('id'+proxy.userInfo.user_id)
					if(proxy.user_id!=''||proxy.user_id!=null){
						proxy.userInfo.user_id = Number(proxy.user_id)
					}else{
						proxy.userInfo.user_id = 4;
					}
					var userData = Qs.stringify(proxy.userInfo);
					var query=this.$route.query;
					console.log("no"+userData)
					this.$axios.post('api/admin/upload', userData).then(res => {
						setTimeout(() => {
							console.log('发出去了');
							if (res.data.code == 200 && res.data.data != null) {
								if (proxy.user_id != null || proxy.user_id != '') {
									console.log('添加商品 ');
									this.dialogTableVisible = false
								} else {
									console.log('修改商品信息');
								}
								this.resetUserInfo(proxy)
							} else {
								alert(res.data.msg);
							}
						}, 1000);
					});
				} else {
					console.log("输入非法")
					alert('请检查输入是否合法');
					return false;
				}
			});
		},
		handleCancel(proxy) {
			this.dialogTableVisible = false;
			proxy.resetUserInfo(proxy)
		},
		resetUserInfo(proxy){
			proxy.userInfo ={
				user_id: '',
				username: '',
				user_pwd:'',
				checkPwd:'',
			}
		},
		
	}
};
</script>

<style>
	.card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}
	
	.text {
	  font-size: 14px;
	}
	
	.item {
	  margin-bottom: 18px;
	}
	
	.box-card {
	  width: 480px;
	}
</style>

<template>
	<div class="UserList">
	<el-table :data="users" style="width: 100%;">
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
	</el-table>
	<el-dialog title="编辑用户信息" v-model="dialogTableVisible" center width="27%">
		<el-form ref="userInfo" :model="userInfo" :rules="rules" :label-position="right" label-width="80px">
			<el-form-item label="用户编号" prop="user_id">
				<el-input v-model="userInfo.user_id"></el-input>
			</el-form-item>
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
			<el-form-item label="管理权限" prop="is_admin">
				<el-switch
				    v-model="userInfo.is_admin"
				    inline-prompt
					active-value="1"
					inactive-value="0"
				    active-text="是"
				    inactive-text="否"
				  />
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
	import Qs from 'qs';
	import { User, View } from '@element-plus/icons';
	export default {
		name: 'UserList',
		components: { User, View },
		data(){
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('确认密码不能为空'));
				} else if (value !== this.userInfo.user_pwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return{
				dialogTableVisible: false,
				users:[],
				userInfo: {
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
				}
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
			proxy.$axios.get('api/admin/list').then(res => {
				proxy.users = res.data.data;
				console.log('user' + proxy.$store.state.token);
				console.log(res.data);
			});
		},
		methods:{
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
				console.log(proxy.userInfo)
				proxy.dialogTableVisible = true;
			},
			handleDelete(index, row, proxy) {
				console.log(index, row);
				console.log(proxy);
				proxy.$axios.get('api/admin/delete',
				{params:{
					no:row.user_id
				}}).then(res => {
					setTimeout(()=>{
						alert(res.data.msg)
						if(res.data.code==200 && res.data.data!=null){
							proxy.getUserList(proxy)
						}
					},1000)
				})
			},
			getUserList(proxy){
				proxy.$axios.get('api/admin/list').then(res => {
					proxy.users = res.data.data;
					console.log(res.data.data);
				});
			},
			onSubmit(formName, proxy) {
				console.log("提交表单")
				this.$refs[formName].validate(valid => {
					console.log("进行表单验证")
					if (valid) {
						console.log('验证通过');
						console.log('id'+proxy.userInfo.user_id)
						if(proxy.user_id!='' || proxy.user_id!=null){
							proxy.userInfo.user_id = Number(proxy.user_id)
						}else{
							proxy.userInfo.user_id = 4;
						}
						var userData = Qs.stringify(proxy.userInfo);
						console.log("no"+proxy.user_id)
						proxy.$axios.post('api/admin/upload', userData).then(res => {
							setTimeout(() => {
								if (res.data.code == 200 && res.data.data != null) {
									if (proxy.user_id != null || proxy.user_id != '') {
										console.log('添加商品 ');
										proxy.dialogTableVisible = false
									} else {
										console.log('修改商品信息');
									}
									proxy.resetUserInfo(proxy)
									// proxy.user_id = 0;
									proxy.getUserList(proxy)
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
				proxy.dialogTableVisible = false;
				proxy.resetUserInfo(proxy)
			},
			resetUserInfo(proxy){
				proxy.userInfo ={
					user_id: '',
					username: '',
					user_pwd:'',
					checkPwd:'',
					is_admin: ''
				}
			},
		}
	}
</script>

<style>
</style>

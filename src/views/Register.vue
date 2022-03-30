<template>
	<div id="register">
		<el-card class="login-form-layout">
		  <el-form
		      autocomplete="on"
		      :model="registerForm"
			  :rules="rules"
		      ref="registerForm"
		      label-position="left"
		  >
		    <div style="text-align: center">
		      <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
		    </div>
		    <h2 class="login-title color-main">注册</h2>
		    <el-form-item prop="username">
		      <el-input
		          name="username"
		          type="text"
		          v-model="registerForm.username"
		          autocomplete="on"
		          placeholder="请输入用户名"
		      >
		        <span slot="prefix">
		          <svg-icon icon-class="user" class="color-main"></svg-icon>
		        </span>
		      </el-input>
		    </el-form-item>
		    <el-form-item prop="password">
		      <el-input
		          name="password"
		          :type="pwdType"
		          @keyup.enter.native="handleRegister"
		          v-model="registerForm.password"
		          autocomplete="on"
		          placeholder="请输入密码"
		      >
		        <template #suffix>
		           <el-icon class="el-input__icon" @click="showPwd()"><user /></el-icon>
		        </template>
		      </el-input>
		    </el-form-item>
			<el-form-item prop="checkPwd">
			  <el-input
			      name="checkPwd"
			      :type="pwdType"
			      @keyup.enter.native="handleRegister"
			      v-model="registerForm.checkPwd"
			      autocomplete="on"
			      placeholder="请确认密码"
			  >
			    <template #suffix>
			       <el-icon class="el-input__icon" @click="showPwd()"><user /></el-icon>
			    </template>
			  </el-input>
			</el-form-item>
		    <el-form-item style="margin-bottom: 20px; margin-top: 5px">
		      <el-button
		          style="width: 100%"
		          type="primary"
		          :loading="loading"
		          @click="handleRegister('registerForm', proxy)"
		      >提交注册</el-button>
		    </el-form-item>
		  </el-form>
		</el-card>
	</div>
</template>

<script>
	import {getCurrentInstance} from "vue";
	import Qs from "qs"
	import { User, View } from '@element-plus/icons';
	let loading;
	export default {
	  components: { User, View },
	  name: "register",
	  data() {
	  	var validatePass = (rule, value, callback) => {
	  		if (value === '') {
	  			callback(new Error('确认密码不能为空'));
	  		} else if (value !== this.registerForm.pass) {
	  			callback(new Error('两次输入密码不一致!'));
	  		} else {
	  			callback();
	  		}
	  	};
	  	return {
	  		registerForm: {
	  			username: '',
	  			password: '',
	  			checkPwd: '',
	  		},
			pwdType: "password",
	  		rules: {
	  			username: [
	  				{ required: true, message: '用户名不能为空', trigger: 'blur' },
	  				{
	  					min: 1,
	  					max: 10,
	  					message: '用户名长度请控制在1-10个字符'
	  				}
	  			],
	  			password: [
	  				{ required: true, message: '密码不能为空', trigger: 'blur' },
	  				{
	  					min: 5,
	  					max: 20,
	  					message: '请检查输入密码是否规范，密码长度为8-20个字符',
	  					trigger: 'blur'
	  				}
	  			],
	  			checkPwd: [
	  				{
	  					min: 5,
	  					max: 20,
	  					message: '请检查输入密码是否规范，密码长度为8-20个字符',
	  					trigger: 'blur'
	  				},
	  				{ validator: validatePass, trigger: 'blur' }
	  			]
	  		}
	  	};
	  },
	  setup() {
	  	const { proxy } = getCurrentInstance() // 使用proxy代替ctx，因为ctx只在开发环境有效
	  	console.log(proxy.$axios) // 路由信息
	  	// console.log(proxy.$systemName) // 全局挂载对象
	  	return{
	  		proxy
	  	}
	  },
	  methods: {
	    showPwd() {
	      if (this.pwdType === "password") {
	        this.pwdType = "";
	      } else {
	        this.pwdType = "password";
	      }
	    },
	    handleRegister(formName, proxy) {
	    	this.$refs[formName].validate(valid => {
	    		if (valid) {
	    			proxy.register(proxy)
	    		} else {
	    			alert('请检查输入是否合法');
	    			return false;
	    		}
	    	});
			// proxy.register(proxy)
	    },
		register(proxy) {
			var data = Qs.stringify({
				"username": proxy.registerForm.username,
				"user_pwd": proxy.registerForm.password
			})
			proxy.$axios.post('api/user/register', data).then(res => {
				setTimeout(() => {
					if (res.data.code == 404 && res.data.msg != null) {
						alert("用户已存在")
					} else {
						proxy.$router.push('/mainpage')
					}
				})
			})
		}
	  }
	};
</script>

<style>
	.login-form-layout {
	  position: absolute;
	  left: 0;
	  right: 0;
	  width: 360px;
	  margin: 140px auto;
	  border-top: 10px solid #409eff;
	}
	
	.login-title {
	  text-align: center;
	}
	
	.login-center-layout {
	  background: #409eff;
	  width: auto;
	  height: auto;
	  max-width: 100%;
	  max-height: 100%;
	  margin-top: 200px;
	}
</style>

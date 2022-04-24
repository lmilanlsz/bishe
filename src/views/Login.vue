<template>
  <div id="login" msg="login">
    <el-card class="login-form-layout">
      <el-form
          autocomplete="on"
          :model="loginForm"
		  :rules="rules"
          ref="loginForm"
          label-position="left"
      >
        <div style="text-align: center">
			<h2 class="login-title color-main">图书推荐分享平台</h2>
        </div>
        <el-form-item prop="username">
          <el-input
              name="username"
              type="text"
              v-model="loginForm.username"
              autocomplete="on"
              placeholder="请输入用户名"
          >
		    <!-- <template #suffix>
		        <el-icon class="el-input__icon"><user /></el-icon>
		    </template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              name="password"
              :type="pwdType"
              @keyup.enter.native="handleLogin"
              v-model="loginForm.password"
              autocomplete="on"
              placeholder="请输入密码"
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
			  plain
              :loading="loading"
              @click.native.prevent="handleLogin('loginForm', proxy)"
          >登录</el-button>
        </el-form-item>
		<el-form-item style="margin-bottom: 10px">
		  <el-button
		      style="width: 100%"
		      type="primary"
			  plain
		      @click.native.prevent="toRegister"
		  >注册</el-button>
		</el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {getCurrentInstance} from "vue";
import Qs from "qs";
import { User, View } from '@element-plus/icons';
let loading;
export default {
  name: "Login",
  props: {
  	msg: String,
  },
  components: { User, View },
  data() {
	  var validatePass = (rule, value, callback) => {
	  	if (value === '') {
	  		callback(new Error('确认密码不能为空'));
	  	} else if (value !== this.ruleForm.pass) {
	  		callback(new Error('两次输入密码不一致!'));
	  	} else {
	  		callback();
	  	}
	  };
    return {
      loginForm: {
        username: "admin",
        password: "12345"
      },
      loading: false,
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
	toRegister() {
		this.$router.push('/register')
	},
    handleLogin(formName,proxy) {
		console.log("clicked");
		console.log(this.$refs[formName])
    	this.$refs[formName].validate(valid => {
    		if (valid) {
    			// if(proxy.msg == 'login') {
    			// 	proxy.login(proxy)
    			// }
				proxy.login(proxy)
    		} else {
    			alert('请检查输入是否合法');
    			return false;
    		}
    	});
		// proxy.login(proxy)
    },
	login(proxy){
		// proxy.openFullScreen();
		var data = Qs.stringify({
			"username":proxy.loginForm.username,
			"user_pwd":proxy.loginForm.password
		})
		console.log(proxy.loginForm.username)
		console.log(proxy.loginForm.password)
		proxy.$axios.post('api/user/login', data).then(res => {
			setTimeout(()=>{
				// proxy.closeFullScreen();
				if (res.data.code == 200 && res.data.msg != null) {
					proxy.$store.state.token = res.data.msg;
					proxy.$store.state.user = res.data.data;
					proxy.$store.state.user_id = res.data.data.user_id;
					proxy.$store.state.user_pwd = res.data.data.user_pwd;
					console.log("token" + proxy.$store.state.user_id)
					console.log("token" + proxy.$store.state.token)
					proxy.$router.push('/mainpage')
					console.log("设置token")
					console.log("跳转置首页")
				} else if (res.data.code == 100) {
					proxy.$store.state.token = res.data.msg;
					proxy.$store.state.user = res.data.data;
					proxy.$router.push('/adminpage')
					console.log('user' + proxy.$store.state.token);
				} else {
					alert("密码错误或用户不存在！")
				}
			},1000)
		})
	},
  }
};
</script>

<style scoped>
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
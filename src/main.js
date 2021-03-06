import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import axios from 'axios'
import * as echarts from 'echarts'
import moment from 'moment'


axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

axios.interceptors.request.use(
  config =>{
    let token = store.state.token
    if(token){
        //这里面获取的请求头的键(tokenHeader)根据每个后端的习惯封装的名称各不相同  
      config.headers.common['authorization'] = token
    }
    return config
  }, error =>{
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$echarts = echarts
app.use(store).use(router).use(ElementPlus).mount('#app')

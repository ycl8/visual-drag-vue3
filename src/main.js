import { createApp } from 'vue'
import router from './router'

import './style.css'
import App from './App.vue'
import 'uno.css'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import 'ant-design-vue/dist/reset.css';


const app = createApp(App)




app.use(Antd);
app.use(router) //注册路由



app.mount('#app')

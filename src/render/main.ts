import {createApp} from 'vue';
import naive from "naive-ui";
import App from './App.vue'
import {router} from "@render/router";
import {createPinia} from 'pinia';

// 全局样式
import '@render/styles/css/global.css'
// 全局tailwind样式
import '@render/styles/css/tailwind.css'

createApp(App)
    .use(naive)
    .use(createPinia())
    .use(router)
    .mount('#app')

import Home from '@/views/Home.vue'
import Login from '@/views/Login/index.vue'
import {createRouter,createWebHistory} from "vue-router";
import dashboard from "@/router/modules/dashboard";


const routes = [
    {
        path: "/",
        redirect:"/Login"
        // component: Home
    },
    {
        path: "/Login",
        component: Login,
        name:"Login",
        meta: {
            title: "登录"
        }
    }
];
// ...为扩展运算符  可以访问到所有名为routes的属性
const baseRoutes = [...routes,...dashboard]

export const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes:baseRoutes // `routes: routes` 的缩写
})


router.beforeEach((to)=>{
    //设置每个页面标签名    !.称之为非空断言操作符，和?.相反，这个符号表示对象后面的属性一定不是null或undefined
    // const a = fetch(...) || {}        // 假设a是从后端拿到的一个对象类型数据
    // const safe = a.b.c        // 这样写时不安全的，无法确保b是否有值，如果为空则b.c会进行报错
    // const safeData = a?.b?.c        // 实际上就是相当于 const safeData = a && a.b && a.b.c
    //   总结 !. 为一定有   ?.为不一定有(可以没有)
    document.title = (to?.meta?.title as string) || document.title
    if(to.name!=='login' && !localStorage.getItem('token')){
        return '/login'
    }else if(to.name==='login' && localStorage.getItem('token')){
        return '/dashboard'
    }
    return
})


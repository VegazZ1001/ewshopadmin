//1.引入axios依赖包
import axios, {AxiosRequestConfig} from "axios";
//2.创建axios对象
const request = axios.create({
    baseURL:'https://api.shop.eduwork.cn/',//管理后台要使用的接口的基地址
    timeout:8000,  //超时时间
})
const win:any = window ;
//3.定义前置拦截器，【请求拦截器】，请求发送出去之前触发的
request.interceptors.request.use((config)=>{
    //config 接口请求的配置信息
    //1.获取token
    const token:string = localStorage.getItem('token') ?? ''
    //2.判断token是否存在
    if(token){
        //3.如果存在，添加到请求头参数中     内置的并没有这个变量所以我们要告诉ts这个东西是一定存在的  就是在变量前加一个!
        config.headers!.Authorization = `Bearer ${token}`
    }
    return config
},(error)=>{
    //报错的时候抛出一个错误信息
    return Promise.reject(error)
})

//4.定义后置拦截器，【响应拦截器】，服务器响应回来数据之前触发
request.interceptors.response.use((response)=>{
    //响应回来的数据操作
    return response.data
},(error)=>{
    const {response} = error;
    // 报错的是定义前置拦截器时候抛出一个报错信息
    switch (response.status) {
        case 401:
            win.$message.error("登陆失败，请重新登录");
            localStorage.removeItem("token");
            setTimeout(() =>{
                window.location.href = "/login";
            },500);
            break;
        case 404:
            win.$message.error("接口不存在");
            break;
        case 500:
        case 502:
            win.$message.error("网络异常");
            break;
        case 422:
        {const msg = response.data.errors[Object.keys(response.data.errors)[0]][0];
            win.$message.error(msg);
            // window.$message.error('邮箱已存在')
            break;}
    }
    //报错的时候抛出一个错误的信息
    return Promise.reject(error)
})

//5.抛出对象的信息
export default request
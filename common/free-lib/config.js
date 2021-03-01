export default {
    // #ifndef H5
    baseUrl:"https://chat.rwx850.cn",
	// baseUrl:"http://192.168.2.104:7001",
    // #endif
	
    // #ifdef H5
    baseUrl:"/api",
    // #endif 
    socketUrl:"wss://chat.rwx850.cn/ws",
	// socketUrl:"ws://192.168.2.104:7001/ws",
	
    env:"dev",
	
	codeUrl:"https://chat.rwx850.cn",
	
	// 表情包线上路径
	emoticonUrl:"https://chat.rwx850.cn/static/"
}
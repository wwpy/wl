import $C from './config.js'
export default {
    // 获取存储列表数据
    getStorage(key){
        let data = null;
		// #ifdef H5
		if($C.env === 'dev'){
		    data = window.sessionStorage.getItem(key)
		} else {
		    data = uni.getStorageSync(key)
		}
		// #endif
        // #ifndef H5
        data = uni.getStorageSync(key)
        // #endif
        return data
    },
    // 设置存储
    setStorage(key,data){
        // #ifdef H5
        if($C.env === 'dev'){
            return window.sessionStorage.setItem(key,data)
        } else {
            return uni.setStorageSync(key,data)
        }
        // #endif
		// #ifndef H5
		return uni.setStorageSync(key,data)
		// #endif
    },
    // 删除存储
    removeStorage(key){
        // #ifdef H5
        if($C.env === 'dev'){
            return window.sessionStorage.removeItem(key);
        } else {
            return uni.removeStorageSync(key)
        }
        // #endif
		// #ifndef H5
		return uni.removeStorageSync(key)
		// #endif
    },
}

// 数组置顶
export function __toFirst(arr, index){
	if (index != 0) {
		arr.unshift(arr.splice(index,1)[0]);
	}
	return arr;
}

export function formatUserinfo(obj) {
	// 第三方登录（已绑定）
	if (obj.user && obj.user_id > 0) {
		return {
			id: obj.user.id,
			username: obj.user.username || obj.nickname,
			userpic: obj.user.userpic || obj.avatarurl,
			phone: obj.user.phone,
			email: obj.user.email,
			status: obj.user.status,
			create_time: obj.user.create_time,
			logintype: obj.logintype,
			password:obj.user.password,
			token: obj.token,
			userinfo: {
				id: obj.user.userinfo.id,
				user_id: obj.user.userinfo.user_id,
				age: obj.user.userinfo.age,
				sex: obj.user.userinfo.sex,
				qg: obj.user.userinfo.qg,
				job: obj.user.userinfo.job,
				path: obj.user.userinfo.path,
				birthday: obj.user.userinfo.birthday,
			}
		}
	}
	// 第三方登录（未绑定）
	return {
		id: obj.user_id,
		username: obj.nickname,
		userpic: obj.avatarurl,
		phone: false,
		email: false,
		status: 1,
		create_time: false,
		logintype: obj.logintype,
		token: obj.token,
		userinfo: false
	}
}
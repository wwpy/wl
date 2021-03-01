'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const res = await uniCloud.getPhoneNumber({
		provider: 'univerify',
		apiKey: 'bee16298fa39030f16661dcd4a1c0396', // 在开发者中心开通服务并获取apiKey
		apiSecret: 'f155ac901432220096aeea0eaa878f6e', // 在开发者中心开通服务并获取apiSecret
		access_token: event.access_token,
		openid: event.openid
	});
	const res2 = await uniCloud.httpclient.request('https://chat.rwx850.cn/oneKeyLogin', {
		method: 'POST',
		data: {
			phone: res.phoneNumber
		},
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
	//返回数据给客户端
	console.log('dataUni', res2);
	if (res2.status === 200) {
		return res2.data.data;
	}
	return "0";
};

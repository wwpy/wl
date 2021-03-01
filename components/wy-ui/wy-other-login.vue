<template>
	<view class="align-center pt-2 pb-5">
		<!-- #ifdef APP-PLUS || MP-ALIPAY -->
		<view class="flex-1 flex align-center justify-center">
			<block v-for="(item,index) in providerList" :key="index" >
				<view @click="login(item)"
				:class="item.bgColor"
				class="align-center justify-center rounded-circle mr-3"
				style="width: 80rpx;height: 80rpx;">
					<image :src="item.icon" style="width: 50rpx;height: 50rpx;"></image>
				</view>
			</block>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">微信登录</button>
		<!-- #endif -->
		
	</view>
</template>

<script>
	import $H from '@/common/free-lib/request.js';
	import { formatUserinfo } from '@/common/free-lib/util.js';
		
	export default {
		data() {
			return {
				providerList: []
			}
		},
		mounted(){
			uni.getProvider({
				service: 'oauth',
				success: (result) => {
					this.providerList = result.provider.map((value) => {
						let providerName = '';
						let icon = ''
						let bgColor = ''
						switch (value) {
							case 'univerify':
								providerName = '一键登录'
								icon = "/static/images/other/onelogin.png"
								bgColor = 'bg-danger'
								break;
							case 'apple':
								providerName = '苹果登录'
								icon = "/static/images/other/apple.png"
								bgColor = 'bg-dark'
								break;
							case 'weixin':
								providerName = '微信登录'
								icon = '/static/images/other/weixin.png'
								bgColor = 'bg-success'
								break;
							case 'qq':
								providerName = 'QQ登录'
								icon = "/static/images/other/qq.png"
								bgColor = 'bg-primary'
								break;
							case 'sinaweibo':
								providerName = '新浪微博登录'
								icon = '/static/images/other/weibo.png'
								bgColor = 'bg-warning'
								break;
							case 'xiaomi':
								providerName = '小米登录'
								icon = '/static/images/other/mi.png'
								bgColor = 'bg-warning'
								break;
							case 'alipay':
								providerName = '支付宝登录';
								icon='/static/images/other/alipay.png';
								bgColor = 'bg-primary'
								break;
						}
						
						return {
							name: providerName,
							id: value,
							icon:icon,
							bgColor:bgColor
						}
					});
				},
				fail: (error) => {
					console.log('获取登录通道失败', error);
				}
			});
		},
		methods: {
			// 登录
			login(item) {
				uni.login({
					provider: item.id,
					univerifyStyle: {
						"otherLoginButton": {
							"visible": "false", // 是否显示其他登录按钮，默认值：true
						}
					},
					// #ifdef MP-ALIPAY
					scopes: 'auth_user',  //支付宝小程序需设置授权类型
					// #endif
					success: res => {
						if (item.id === 'univerify') {
							this.getPhoneNum(res.authResult)
						} else {
							this.userinfo(item)
						}
					},
					fail: () => {
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						});
					},
				});
			},
			// 一键登录获取电话号码
			getPhoneNum(authResult) {
				uniCloud.callFunction({
					name: 'one_key_login', // 你的云函数名称
					data: {
						'access_token': authResult.access_token, // 客户端一键登录接口返回的access_token
						'openid': authResult.openid // 客户端一键登录接口返回的openid
					}
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取用户信息
			userinfo(item) {
				// 获取用户信息
				uni.getUserInfo({
					 provider: item.id,
					 success:(infoRes)=> {
						let obj = {
							provider: item.id,
							openid: infoRes.userInfo.openId,
							expires_in: 0,
						}
						if(item.id === 'apple') {
							obj["nickName"] = infoRes.userInfo.familyName + infoRes.userInfo.giveName
							obj["avatarUrl"] = ""
						} else {
							obj["nickName"] = infoRes.userInfo.nickName
							obj["avatarUrl"] = infoRes.userInfo.avatarUrl
						}
						if (item.id === 'qq') {
							// obj["gender_type"] = infoRes.userInfo.gender_type
							obj["unionid"] = infoRes.userInfo.unionid || ''
						} 
						if (item.id === 'weixin') {
							obj["unionid"] = infoRes.userInfo.unionId || ''
						}
						// 登录逻辑
						this.loginEvent(obj);
					 }
				});
			},
			// 登录逻辑
			loginEvent(data){
				$H.post('/otherLogin', data, {token:false})
				.then(res=>{
					if (res == '-1') {
						uni.navigateTo({
							url: '/pages/common/register/register?userBind='+JSON.stringify(data),
						});
					} else {
						this.$store.dispatch('login',res)
						uni.switchTab({
							url:"/pages/tabbar/index/index"
						})
					}
				})
			},
			// #ifdef MP-WEIXIN
			mpGetUserInfo(result) {
				uni.showLoading({ title: '登录中...', mask: true });
				// 获取失败
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.hideLoading();
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + result.detail.errMsg,
						showCancel: false
					});
					return;
				}
				let userinfo = result.detail.userInfo;
				uni.login({
					provider:"weixin",
					success: (res) => {
						this.MpLogin({
							url:"/wxlogin",
							code:res.code,
							nickName:userinfo.nickName,
							avatarUrl:userinfo.avatarUrl
						})
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},
			// #endif
			MpLogin(options){
				this.$H.post(options.url,{
					code:options.code,
					nickName:options.nickName,
					avatarUrl:options.avatarUrl
				}).then(data=>{
					// 修改vuex的state,持久化存储
					this.$store.commit('login',this.$U.formatUserinfo(data))
					// 跳转到首页
					uni.switchTab({
						url: '../../pages/tabbar/index/index'
					})
				});
			},
		},
	}
</script>

<style>
	
</style>

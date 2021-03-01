<script>
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS-NVUE
			// 锁定屏幕
			// plus.screen.lockOrientation("portrait");
			// 加载公共图标库
			const domModule = weex.requireModule('dom')
			domModule.addRule('fontFace', {
			    'fontFamily': "iconfont",
			    'src': "url('https://at.alicdn.com/t/font_1365296_2ijcbdrmsg.ttf')"
			});
			// #endif
			
			// #ifdef APP-PLUS
			
			/*
			plus.push.getClientInfoAsync(function(info){

			}, function(e){
				console.log(JSON.stringify(e));
			})
			// 监听push推送通知
			plus.push.addEventListener('receive', ({type,title,content,payload})=>{ 
				//console.log(type,title,content,payload);
				console.log(type,'type');
				if(type=='receive' || uni.getSystemInfoSync().platform != "ios"){ 
					//如果type!='receive'是自己本地插件的push消息栏，“拦截”避免死循环'，安卓系统没有这个问题
					if(typeof payload != 'object'){ payload = JSON.parse(payload) }
					//判断是否为object，不是的话手动转一下。 hbuilderx 3.0以上版本已经修复此问题可省略
					plus.push.createMessage(content,JSON.stringify(payload),{
						title:payload.title,
						subtitle:payload.content
					});
				}
			});
			//监听点击通知栏
			plus.push.addEventListener('click', function({payload}) {
				if(typeof payload != 'object'){ payload = JSON.parse(payload) }
				
				let pages = getCurrentPages();
				let currentWebview = pages[pages.length - 1].$getAppWebview();
				if(currentWebview.__uniapp_route != 'pages/msg-center/msg-center'){
					uni.switchTab({url:'/pages/msg-center/msg-center'})
				}
				uni.$emit('readMsg',payload)
			});
			*/
			// #endif
			// 初始化录音管理器
			this.$store.commit('initRECORD')
			// 初始化登录状态
			this.$store.dispatch('initLogin')
			console.log('App Launch')
			// 监听键盘高度变化
			uni.onKeyboardHeightChange(res => {
			  this.$store.commit('changeKeyboardHeight',res.height)
			})
		},
		onShow: function() {
			this.$store.dispatch('reconnect')
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/free.css";
	@import "./common/common.css";
	/* #ifndef APP-PLUS-NVUE */
	@import "./common/free-icon.css";
	/* #endif */
	/* #ifdef MP */
	::-webkit-scrollbar{
		display: none;
	}
	/* #endif */
</style>

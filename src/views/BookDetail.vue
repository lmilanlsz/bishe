<template>
	<div id="BookDetail" v-if="getData">
		<div class="page_header">
			<el-page-header :icon="ArrowLeft" content="图书详情" @back="back()"/>
		</div>
		<div class="el-main">
			<div class="book_title">
				{{proxy.book.book_title}}
			</div>
			<div class="info">
				<div class="subInfo">
					<div class="cover">
						<el-image :src="require('@/assets/img/' + proxy.book.book_img)" :fit="'cover'"/>
					</div>
					<div class="detail">
						<span><p>作者:&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_author}}</p></span>
						<span><p>类型:&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.category_name}}</p></span>
						<span><p>页数:&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_page}}</p></span>
						<span><p>出版社:&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_press}}</p></span>
						<span><p>热门度:&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_is_liked}}</p></span>
						<span style="float: left;">分享到:&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://service.weibo.com/share/share.php?appkey=&title=&url=&searchPic=false&style=simple" target="_blank">微博</a></span>
						<br>
					</div>
				</div>
				<div class="book_rate">
					<span style="font-size: 25px;">评分</span>
					<br>
					<span style="font-size: 40px;">{{proxy.book.book_rate}}&nbsp;&nbsp;</span>
					<span style="font-weight: 400;color: #A6A9AD;">{{proxy.book.book_rate_num}}人评价</span>
					<span style="width: 20%;">
						<el-rate
							v-model="proxy.book.book_rate"
							disabled
							text-color="#ff9900"
						/>
					</span>
					<span style="margin-top: 15%;">
						<el-button ref="btn" type="text" @click="handleLike(proxy)" :disabled="dis">我要推荐</el-button>
					</span>
				</div>
			</div>
			<div class="desc">
				<div class="desc_title">
					内容简介
				</div>
				<div class="desc_content">
					<p>{{proxy.book.book_desc}}</p>
				</div>
			</div>
			<!-- <el-card class="box-card">
			    <template #header>
			        <div class="card-header">
						<span>图书详情</span>
			        </div>
			    </template> -->
				<!-- <div class="card-item">
					<span><p>图书标题:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;《{{proxy.book.book_title}}》</p></span>
					<span><p>图书作者:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_author}}</p></span>
					<span><p>图书类型:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.category_name}}</p></span>					
					<span>
						<div class="rate" style="display: flex;float: left;">
							图书评分:&nbsp;&nbsp;&nbsp;
						</div>
						<div style="margin-top: 25px;margin-bottom: 18px;">
							<el-rate
								v-model="proxy.book.book_rate"
								disabled
								show-score
								text-color="#ff9900"
							/>
						</div>
					</span>
					<span style="float: left;margin-bottom: 0;">被推荐数:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_is_liked}}</span>
					<br>
					<span style="float: left;margin-top: 10px;margin-bottom: 10%;">分享到:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://service.weibo.com/share/share.php?appkey=&title=&url=&searchPic=false&style=simple" target="_blank">微博</a></span>
					<br>
					<br>
					<span style="margin-left: 15%;margin-top: 15%;">
						<el-button ref="btn" type="success" @click="handleLike(proxy)" :disabled="dis">我要推荐</el-button>
					</span>
					<br>
					<br>
					<span style="margin-left: 40%;margin-top: 50%;">
						<el-button ref="btn" type="info" @click="handleWish(proxy)" :disabled="abled">加入愿望单</el-button>
					</span>
					<br>
				</div>
			</el-card> -->
			<span>
				<el-button ref="btn" type="text" @click="handleWish(proxy)" :disabled="abled">加入愿望单</el-button>
			</span>
			<div class="demo-collapse">
			    <el-collapse v-model="activeNames" @change="handleChange" style="width: 80%;margin-left: 10%;margin-top: 1%;">
			      <el-collapse-item title="查看评价" name="1">
					<template  v-if="getReview"> 
						<div class="UserReview" v-for="review in reviews.slice(0,3)" style="margin-left: 10%;;">
							<div class="rate" style="display: flex;float: left;font-size: 15px;">
								{{review.username}}
							</div>
							<div style="margin-top: 28px;margin-bottom: 15px;width: 18%;">
								<el-rate
									v-model="review.review_rate"
									disabled
									text-color="#ff9900"
								/>
							</div>
							<div class="date" style="font-size: 15px;text-align: left;width: 40%;margin-bottom: 5%" :formatter="dateFormat">
								{{review.review_content}}
							</div>
						</div>
						<div v-if="proxy.reviews.length > 1">
							<el-button type="text" style="margin-left: 16px" @click="drawer = true">显示更多</el-button>
						</div>
						<el-drawer
							v-model="drawer"
						    title="更多评论"
						    :direction="direction"
							size="40%"
						>
							<el-divider />
						    <div class="UserReview" v-for="review in reviews" style="margin-left: 10%;;">
						    	<div class="rate" style="display: flex;float: left;font-size: 15px;">
						    		{{review.username}}
						    	</div>
						    	<div style="margin-top: 28px;margin-bottom: 15px;width: 35%;">
						    		<el-rate
						    			v-model="review.review_rate"
						    			disabled
						    			text-color="#ff9900"
						    		/>
						    	</div>
						    	<div class="date" style="font-size: 15px;text-align: left;width: 40%;margin-bottom: 5%" :formatter="dateFormat">
						    		{{review.review_content}}
						    	</div>
						    </div>
						</el-drawer>
					</template>
					<template v-else-if="proxy.review.length == 0">
						<div class="NoReview">
							<p>暂无评价，赶快评价一下这本书吧！</p>
						</div>
					</template>
			      </el-collapse-item>
			      <el-collapse-item title="我的评价" name="2">
			        <div class="my_review">
			          <template v-if="!proxy.myReview">
						  <div class="myReview_rate">
							  <el-rate 
								v-model="rate_value" 
								allow-half 
								show-score
								@change="showScore(proxy)"
								/>
						  </div>
						  <div class="myReview_content" style="margin-top: 3%;">
							   <el-input
							      v-model="myReview_content"
							      :autosize="{ minRows: 2, maxRows: 4 }"
							      type="textarea"
							      placeholder="请输入你的评价内容"
							    />
						  </div>
						  <div class="myReview_submit" style="margin-top: 3%;">
							  <el-button type="primary" @click="handleSubmit(proxy)">提交评价</el-button>
						  </div>
					  </template>
					  <template v-else>
						  <div class="UserReview">
						  	<el-descriptions title="评价信息"
						  		style="width: 60%;margin-left: 20%"
						  		direction="vertical"
						  		border>
						  	<el-descriptions-item label="用户名" width="100px">{{proxy.myReview.username}}</el-descriptions-item>
						  	<br>
						  	<el-descriptions-item label="评价分数" width="150px">
						  		{{proxy.myReview.review_rate}}
						  	</el-descriptions-item>
						  	<el-descriptions-item label="评价内容">{{proxy.myReview.review_content}}</el-descriptions-item>
						  	</el-descriptions>
						  </div>
					  </template>
					  <span>
					  	<el-button ref="btn" type="text" @click="handleWish(proxy)" :disabled="abled">加入愿望单</el-button>
					  </span>
			        </div>
			      </el-collapse-item>
			    </el-collapse>
			  </div>
		</div>
	</div>
</template>

<script>
	import { ArrowLeft, ShoppingCart } from '@element-plus/icons'
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	import moment from 'moment';
	import Picture from '../components/Picture.vue'
	import { ElNotification } from 'element-plus'
	export default {
		components: {ArrowLeft, Picture, ShoppingCart},
		data() {
			return {
				drawer: false,
				getReview: false,
				getData: false,
				myReview_content: '',
				rate_value: 0,
				rate_disabled: true,
				book:[],
				activeNames: ['1'],
				reviews: {
					username:'',
					review_id:'',
					review_rate:'',
					review_content:'',
				},
				myReview: {
					username:'',
					review_id:'',
					review_rate:'',
					review_content:'',
				},
				review: [],
				url: '@/assets/img/',
				dis: false,
				abled: false,
				flag: 0,
			}
		},
		setup() {
			const { proxy } = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效
			return {
				proxy
			};
		},
		mounted() {
			const { proxy } = getCurrentInstance();
			var book_id = Qs.stringify({'book_id': proxy.$store.state.book_id})
			var my_review = Qs.stringify({'book_id': proxy.$store.state.book_id,
										'user_id': proxy.$store.state.user_id})
			proxy.$axios.post('api/book/detail', book_id).then(res => {
				proxy.book = res.data.data;
				console.log('book' + proxy.reviews);
				console.log(res.data.data);
				proxy.getData = true;
			});
			proxy.$axios.post('api/review/byBook', book_id).then(res => {
				proxy.reviews = res.data.data;
				console.log('有没有'+proxy.reviews);
				console.log('看看返回的码'+res.data.code);
				console.log(!proxy.reviews)
				if(res.data.code == 200) {
					proxy.getReview = true
				} else {
					proxy.getReview = false
				}
			});
			proxy.$axios.post('api/review/myReview', my_review).then(res => {
				if(res.data.code == 200)
				proxy.myReview = res.data.data;
				console.log('我的有没有'+res.data.data);
			});
		},
		methods: {
			handleClose(done) {
				
			},
			dateFormat:function(review_date) {
			        var date = review_date;
			        if(date == undefined){return ''};
			        return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			back() {
				this.$router.push('/mainpage');
			},
			handleChange(val) {
				console.log(val);
			},
			handleLike(proxy) {
				var book_id = Qs.stringify({'book_id': proxy.$store.state.book_id})
				this.$axios.post('api/book/like', book_id).then(res => {
					if(res.data.code == 200) {
						 ElNotification({
						    title: 'Success',
						    message: '推荐成功',
						    type: 'success',
						  })	  
					}
					this.dis = true;
					console.log(res.data);
				});
				var shareData = Qs.stringify({'book_id': proxy.$store.state.book_id,
											  'user_id': proxy.$store.state.user_id})
				this.$axios.post('api/share/new', shareData).then(res => {
					if(res.data.code == 200) {
						 ElNotification({
						    title: 'Success',
						    message: '分享成功',
						    type: 'success',
						  })	  
					}
					this.dis = true;
					console.log(res.data);
				});
			},
			handleWish(proxy) {
				var new_wish = Qs.stringify({'book_id': proxy.$store.state.book_id,
											 'user_id': proxy.$store.state.user_id})
				this.$axios.post('api/wishlist/upload', new_wish).then(res => {
					if(res.data.code == 200) {
						 ElNotification({
						    title: 'Success',
						    message: '愿望单添加成功',
						    type: 'success',
						  })	  
					} else if(res.data.code == 404) {
						ElNotification({
						   title: 'Error',
						   message: '该图书已存在于愿望单之中',
						   type: 'error',
						 })	
					}
					this.abled = true;
					console.log(res.data.code);
					console.log(res.data);
				});
			},
			showScore(proxy) {
				console.log("分数在不在")
				console.log(proxy.rate_value)
				proxy.rate_disabled = false
			},
			handleSubmit(proxy) {
				var new_review = Qs.stringify({'book_id': proxy.$store.state.book_id,
											   'user_id': proxy.$store.state.user_id,
											   'review_rate': proxy.rate_value,
											   'review_content': proxy.myReview_content})
				proxy.$axios.post('api/review/new', new_review).then(res => {
					if(res.data.code == 200) {
						ElNotification({
							title: 'Success',
						    message: '评价添加成功',
						    type: 'success',
						})	  
					}
					console.log(res.data);
				})
				var book_id = Qs.stringify({'book_id': proxy.$store.state.book_id})
				proxy.$axios.post('api/book/detail', book_id).then(res => {
					proxy.book = res.data.data;
					console.log('book' + proxy.reviews);
					console.log(res.data.data);
					proxy.getData = true;
				});
			}
		}
	}
</script>

<style>
	.page_header {
		margin-top: 5%;
		margin-left: 5%;
	}
	.cover {
		width: 360px;
		height: 400px;
		margin-left: 235px;
		margin-top: 0%;
		margin-right: 0;
		margin-bottom: 3%;
		border-radius: 3px;
		display: flex;
		float: left;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		font-size: 25px;
		text-align: center;
		font-weight: 30000;
	}
	
	.card-item {
		margin-bottom: 18px;
		font-size: 18px;
		text-align: left;
		line-height: 40px;
	}
	
	.box-card {
		width: 480px;
		margin-left: 33.5%;
		margin-bottom: 7%;
	}
	
	.book_title {
		margin-top: 2%;
		margin-left: 13%;
		text-align: left;
		font-weight: bold;
		font-size: 33px;
	}
	
	.detail {
		margin-top: 1%;
		margin-bottom: 20%;
		width: 30%;
		text-align: left;
		font-size: 17px;
		
	}
	
	.subInfo {
		display: flex;
		float: left;
	}
	
	.info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0;
		width: 100%;
	}
	
	.book_rate {
		border-left: 1px solid #eaeaea;
		width: 30%;
		height: 100%;
		text-align: left;
		padding-left: 3%;
	}
	
	.desc_content {
		width: 40%;
		margin-left: 20%;
		text-align: left;
		text-indent: 35px;
		margin-bottom: 3%;
	}
	
	.desc_title {
		margin-top: 2%;
		text-align: left;
		margin-left: 15%;
		font-size: 25px;
	}
</style>
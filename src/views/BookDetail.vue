<template>
	<div id="BookDetail" v-if="getData">
		<div class="page_header">
			<el-page-header :icon="ArrowLeft" content="图书详情" @back="back()"/>
		</div>
		<div class="el-main">
			<div class="cover">
				<el-image :src="require('@/assets/img/' + proxy.book.book_img)" :fit="'cover'"/>
			</div>
			<el-card class="box-card">
			    <template #header>
			        <div class="card-header">
						<span>图书详情</span>
			        </div>
			    </template>
				<div class="card-item">
					<span><p>图书标题:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;《{{proxy.book.book_title}}》</p></span>
					<span><p>图书作者:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_author}}</p></span>
					<span><p>图书类型:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{proxy.book.book_category}}</p></span>					
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
			</el-card>
			<div class="demo-collapse">
			    <el-collapse v-model="activeNames" @change="handleChange" style="width: 80%;margin-left: 10%;">
			      <el-collapse-item title="查看评价" name="1">
					<template  v-if="proxy.reviews"> 
						<div class="UserReview">
							<el-descriptions title="评价信息"
								v-for="review in reviews" 
								style="width: 60%;margin-left: 20%"
								direction="vertical"
								border>
							<el-descriptions-item label="用户名" width="100px">{{review.username}}</el-descriptions-item>
							<br>
							<el-descriptions-item label="评价分数" width="150px">
								<!-- <el-rate
									v-model="review.review_rate"
									disabled
									show-score
									text-color="#ff9900"
								/> -->
								{{review.review_rate}}
							</el-descriptions-item>
							<el-descriptions-item label="评价内容">{{review.review_content}}</el-descriptions-item>
							</el-descriptions>
						</div>
					</template>
					<template v-else-if="!proxy.reviews">
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
			        </div>
			      </el-collapse-item>
			    </el-collapse>
			  </div>
		</div>
	</div>
</template>

<script>
	import { ArrowLeft } from '@element-plus/icons'
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	import Picture from '../components/Picture.vue'
	import { ElNotification } from 'element-plus'
	export default {
		components: {ArrowLeft, Picture},
		data() {
			return {
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
				console.log('book' + proxy.reviews.length);
				console.log('@/assets/img/'+ proxy.book.book_img);
				console.log(res.data);
				proxy.getData = true;
			});
			proxy.$axios.post('api/review/byBook', book_id).then(res => {
				if(res.data.code == 200)
				proxy.reviews = res.data.data;
				console.log('有没有'+res.data);
				console.log(!proxy.reviews)
			});
			proxy.$axios.post('api/review/myReview', my_review).then(res => {
				if(res.data.code == 200)
				proxy.myReview = res.data.data;
				console.log('我的有没有'+res.data);
			});
		},
		methods: {
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
		width: 20%;
		height: 20%;
		align-center: center;
		margin-left: 37%;
		margin-top: 5%;
		margin-right: 0;
		margin-bottom: 3%;
		border-radius: 3px;
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
</style>
<template>
	<div class="ReviewList">
	<!-- <div style="width: 100%; background-color: white;">
		<el-button @click="handleAdd(proxy)" type="primary">添加图书</el-button>
	</div> -->
	<el-table :data="review" style="width: 100%;">
		<el-table-column prop="review_id" label="评价编号" width="160"></el-table-column>
		<el-table-column prop="user_id" label="用户编号" width="160"></el-table-column>
		<el-table-column prop="username" label="用户名称" width="160"></el-table-column>
		<el-table-column prop="book_id" label="图书编号" width="160"></el-table-column>
		<el-table-column prop="book_title" label="图书标题" width="160"></el-table-column>
		<el-table-column prop="review_rate" label="评价评分" width="160">
			<template #default="scope">
			  <el-rate
			    v-model="scope.row.review_rate"
			    disabled
			    show-score
			    text-color="#ff9900"
			  />
			</template>
		</el-table-column>
		<el-table-column prop="review_content" label="评价内容" width="160"></el-table-column>
		<!-- <el-table-column prop="type" label="操作类型" width="160"></el-table-column>
		<el-table-column prop="time" label="操作时间"></el-table-column> -->
		<el-table-column label="操作">
			<template #default="scope">
				<!-- <template v-if="(Date.parse(scope.row.time)<new Date()-3*24*60*60*1000)||scope.row.type != '销售'">
					<el-button size="small" @click="handleRefund(scope.$index, scope.row, proxy)" disabled="true">退款</el-button>
				</template>
				<template v-else>
					<el-button size="small" @click="handleRefund(scope.$index, scope.row, proxy)">退款</el-button>
				</template> -->
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)">删除</el-button>
			</template>
			<!-- <template #default="scope">
				<el-button size="mini" @click="handlePurchase(scope.$index, scope.row, proxy)">进货</el-button>
				<el-button size="mini" @click="handleEdit(scope.$index, scope.row, proxy)">编辑</el-button>
				<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)">删除</el-button>
			</template> -->
		</el-table-column>
	</el-table>
	<el-dialog title="编辑评价信息" v-model="dialogTableVisible" center width="27%">
		<el-form ref="reviewInfo" :model="reviewInfo" :rules="rules" :label-position="right" label-width="80px">
			<el-form-item label="评价编号" prop="review_id">
				<el-input v-model="reviewInfo.review_id"></el-input>
			</el-form-item>
			<el-form-item label="用户编号" prop="user_id">
			<el-input
			      name="user_id"
			      type="text"
				  @keyup.enter.native="onSubmit"
			      v-model="reviewInfo.user_id"
			      autocomplete="on"
			  >
			  </el-input>
			</el-form-item>
			<el-form-item label="图书编号" prop="book_id">
			  <el-input
			      name="book_id"
			      type="text"
			      @keyup.enter.native="onSubmit"
			      v-model="reviewInfo.book_id"
			      autocomplete="on"
			  >
			  </el-input>
			</el-form-item>
			<el-form-item label="评价分数" prop="review_rate">
			  <el-input
			      name="review_rate"
			      type="text"
			      @keyup.enter.native="onSubmit"
			      v-model="reviewInfo.review_rate"
			      autocomplete="on"
			  >
			  </el-input>
			</el-form-item>
			<el-form-item label="评价内容" prop="review_content">
				<el-input
				    name="review_content"
				    type="text"
				    @keyup.enter.native="onSubmit"
				    v-model="reviewInfo.review_content"
				    autocomplete="on"
				>
				</el-input>
			</el-form-item>
			<el-form-item size="large">
				<el-button type="primary" @click="onSubmit('reviewInfo', proxy)" style="margin-right: 10%;">确定</el-button>
				<el-button @click="handleCancel(proxy)" style="margin-right: 20%;">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	</div>
</template>

<script>
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	import { User, Plus } from '@element-plus/icons';
	export default {
		name: 'ReviewList',
		components: { User, Plus },
		data(){
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('确认密码不能为空'));
				} else if (value !== this.userInfo.user_pwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return{
				dialogTableVisible: false,
				review:[],
				imageUrl:'',
				reviewInfo: {
					user_id: '',
					review_id: '',
					review_rate:'',
					review_content:'',
					book_id: '',
				},
				url:'@/assets/img/',
				rules: {
					user_id: [
						{ required:true, message: '用户编号不能为空', trigger: 'blur' },
					],
					review_rate: [
						{ required:true, message: '评价评分不能为空', trigger: 'blur' },
					],
					review_content: [
						{ required:true, message: '评价内容不能为空', trigger: 'blur' },
					],
					book_id: [
						{ required:true, message: '图书编号不能为空', trigger: 'blur' },
					],
				}
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
			proxy.$axios.get('api/review/list').then(res => {
				proxy.review = res.data.data;
				console.log('review' + proxy.$store.state.token);
				console.log(res.data);
			});
		},
		methods:{
			handleAvatarSuccess(res, file) {
			    this.imageUrl = URL.createObjectURL(file.raw);
				console.log(this.imageUrl);
		    },
			beforeAvatarUpload(file) {
			    const isJPG = file.type === 'image/jpeg';
			    const isLt2M = file.size / 1024 / 1024 < 2;
			
			    if (!isJPG) {
			        this.$message.error('上传头像图片只能是 JPG 格式!');
			    }
			    if (!isLt2M) {
			        this.$message.error('上传头像图片大小不能超过 2MB!');
			    }
			        return isJPG && isLt2M;
			},
			handleAdd(proxy){
				proxy.dialogTableVisible = true;
			},
			handleEdit(index, row, proxy) {
				proxy.review_id = row.review_id;
				proxy.reviewInfo = JSON.parse(JSON.stringify(row));
				console.log(proxy.reviewInfo)
				proxy.dialogTableVisible = true;
			},
			handleDelete(index, row, proxy) {
				console.log(index, row);
				console.log(proxy);
				proxy.$axios.get('api/review/delete',
				{params:{
					no:row.review_id
				}}).then(res => {
					setTimeout(()=>{
						alert(res.data.msg)
						if(res.data.code==200 && res.data.data!=null){
							proxy.getReviewList(proxy)
						}
					},1000)
				})
			},
			getReviewList(proxy){
				proxy.$axios.get('api/review/list').then(res => {
					proxy.review = res.data.data;
					console.log(res.data.data);
				});
			},
			onSubmit(formName, proxy) {
				console.log("提交表单")
				this.$refs[formName].validate(valid => {
					console.log("进行表单验证")
					if (valid) {
						console.log('验证通过');
						console.log('id'+proxy.bookInfo.book_id)
						if(proxy.book_id!=''||proxy.book_id!=null){
							proxy.bookInfo.book_id = Number(proxy.book_id)
						}else{
							proxy.bookInfo.book_id = 4;
						}
						var bookData = Qs.stringify(proxy.bookInfo);
						console.log("no"+proxy.book_id)
						proxy.$axios.post('api/book/upload', bookData).then(res => {
							setTimeout(() => {
								if (res.data.code == 200 && res.data.data != null) {
									if (proxy.book_id != null || proxy.book_id != '') {
										console.log('添加商品 ');
										proxy.dialogTableVisible = false
									} else {
										console.log('修改商品信息');
									}
									proxy.resetBookInfo(proxy)
									// proxy.user_id = 0;
									proxy.getBookList(proxy)
								} else {
									alert(res.data.msg);
								}
							}, 1000);
						});
					} else {
						console.log("输入非法")
						alert('请检查输入是否合法');
						return false;
					}
				});
			},
			handleCancel(proxy) {
				proxy.dialogTableVisible = false;
				proxy.resetBookInfo(proxy)
			},
			resetBookInfo(proxy){
				proxy.bookInfo ={
					book_id: '',
					book_title: '',
					book_img:'',
					book_category:'',
					book_author: '',
				}
			},
		}
	}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style scoped="scoped">
	.avatar-uploader .el-upload {
	  border: 1px dashed #d9d9d9;
	  border-radius: 6px;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	  transition: var(--el-transition-duration-fast);
	}
	
	.avatar-uploader .el-upload:hover {
	  border-color: var(--el-color-primary);
	}
	
	.el-icon.avatar-uploader-icon {
	  font-size: 28px;
	  color: #8c939d;
	  width: 178px;
	  height: 178px;
	  text-align: center;
	}
</style>

<template>
	<div class="ReviewList">
	<div class="select" style="margin-top: 2%;margin-bottom: 2%;">
		<!-- <template slot-scope="scope"> -->
			<el-dropdown style="margin-right: 5%;">
			    <el-button type="primary">
			        按书名查看
					<el-icon class="el-icon--right"><arrow-down /></el-icon>
			    </el-button>
			    <template #dropdown>
					<el-dropdown-menu>
						<div>
							<el-dropdown-item @click="handleAll(proxy)">
								全部
							</el-dropdown-item>
						</div>
						<div @click="handleTitle(title, proxy)" v-for="title in titles">
							<el-dropdown-item>{{title}}</el-dropdown-item>
						</div>
			        </el-dropdown-menu>
			    </template>
			</el-dropdown>
		<!-- </template> -->
		<!-- <el-dropdown style="margin-right: 5%;">
		    <el-button type="primary">
		        按用户查看
				<el-icon class="el-icon--right"><arrow-down /></el-icon>
		    </el-button>
		    <template #dropdown>
				<el-dropdown-menu>
					<div>
						<el-dropdown-item @click="handleAll(proxy)">
							全部
						</el-dropdown-item>
					</div>
					<div @click="handleUser(user, proxy)"  v-for="user in users">
						<el-dropdown-item>{{user}}</el-dropdown-item>
					</div>
		        </el-dropdown-menu>
		    </template>
		</el-dropdown> -->
		<el-dropdown @command="(command)=>{handleCommand(command, proxy)}">
		    <el-button type="primary" >
		        按评价查看
				<el-icon class="el-icon--right"><arrow-down /></el-icon>
		    </el-button>
		    <template #dropdown>
				<el-dropdown-menu>
					<div>
						<el-dropdown-item command="0">全部</el-dropdown-item>
						<el-dropdown-item command="4">大于4分</el-dropdown-item>
						<el-dropdown-item command="3">大于3分</el-dropdown-item>
						<el-dropdown-item command="2">大于2分</el-dropdown-item>
					</div>
		        </el-dropdown-menu>
		    </template>
		</el-dropdown>
	</div>
	<el-table :data="filterData(review.slice((currentPage - 1) * pagesize, currentPage * pagesize), search)" 
			style="width: 100%;" 
			:default-sort = "{prop: 'review_id', order: 'aescending'}"
			stripe>
		<el-table-column prop="review_id" label="评价编号" width="100px"></el-table-column>
		<!-- <el-table-column prop="user_id" label="用户编号" width="100px" sortable></el-table-column> -->
		<el-table-column prop="username" label="用户名称" width="160px"></el-table-column>
		<!-- <el-table-column prop="book_id" label="图书编号" width="100px" sortable></el-table-column> -->
		<el-table-column prop="book_title" label="图书标题" width="200px"></el-table-column>
		<el-table-column prop="category_name" label="图书类别" width="100px" sortable></el-table-column>
		<el-table-column prop="review_rate" label="评价评分" width="180px" sortable>
			<template #default="scope">
			  <el-rate
			    v-model="scope.row.review_rate"
			    disabled
			    show-score
			    text-color="#ff9900"
			  />
			</template>
		</el-table-column>
		<el-table-column prop="review_content" label="评价内容" width="220px"></el-table-column>
		<el-table-column prop="review_date" label="评价时间" width="250px" :formatter="dateFormat" sortable></el-table-column>
		<el-table-column label="操作">
			<template #default="scope">
				<!-- <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)">编辑</el-button> -->
				<div v-if="scope.row.review_status == 0">
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)">屏蔽</el-button>
				</div>
				<div v-else>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)" disabled>屏蔽</el-button>
				</div>
			</template>
		</el-table-column>
		<el-table-column align="right">
			<template #header>
			    <el-input v-model="search" size="small" placeholder="Type to search" />
			</template>
		</el-table-column>
	</el-table>
	<el-pagination
		class="pagination"
	    layout="prev, pager, next"
	    @current-change="current_change"
	    :total=100
	    background="true"
	    >
	</el-pagination>
	</div>
</template>

<script>
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	import { User, Plus, ArrowDown } from '@element-plus/icons';
	import moment from 'moment';
	export default {
		name: 'ReviewList',
		components: { User, Plus, ArrowDown },
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
			return {
				total: 1000,//默认数据总数
				pagesize: 10,//每页的数据条数
				currentPage: 1,//默认开始页面
				dialogTableVisible: false,
				btnDisable: true,
				review:[],
				title:{
					
				},
				imageUrl:'',
				reviewInfo: {
					user_id: '',
					review_id: '',
					review_rate:'',
					review_content:'',
					book_id: '',
				},
				selectForm: {
					book_title: '',
					review_rate: '',
				},
				search: '',
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
				console.log(res.data.data);
				
			});
			proxy.$axios.get('api/review/title').then(res => {
				proxy.titles = res.data.data;
				console.log('title' + proxy.$store.state.token);
				console.log(res.data.data);
			});
			proxy.$axios.get('api/review/user').then(res => {
				proxy.users = res.data.data;
				console.log('user' + proxy.$store.state.token);
				console.log(res.data.data);
			});
		},
		methods:{
			handleAll(proxy) {
				proxy.$axios.get('api/review/list').then(res => {
					proxy.review = res.data.data;
					console.log('review' + proxy.$store.state.token);
					console.log(res.data.data);
				});
			},
			handleCommand(command, proxy) {
				console.log(command)
				if (command == "0") {
					proxy.$axios.get('api/review/list').then(res => {
						proxy.review = res.data.data;
						console.log('review' + proxy.$store.state.token);
						console.log(res.data.data);
					});
				} else {
					var rateData = Qs.stringify({"review_rate": command});
						proxy.$axios.post('api/review/byRate', rateData).then(res => {
						setTimeout(() => {
							proxy.review = res.data.data;
							console.log('rate' + proxy.$store.state.token);
							console.log(res.data.data);
						}, 1000);
					});
				}
			},
			handleTitle(title, proxy) {
					console.log(title)
					var titleData = Qs.stringify({"book_title": title});
					proxy.$axios.post('api/review/byTitle', titleData).then(res => {
						setTimeout(() => {
							proxy.review = res.data.data;
							console.log('title' + proxy.$store.state.token);
							console.log(res.data.data);
						}, 1000);
					});
			},
			handleUser(user, proxy) {
					console.log(user)
					var userData = Qs.stringify({"username": user});
					proxy.$axios.post('api/review/byUser', userData).then(res => {
						setTimeout(() => {
							proxy.review = res.data.data;
							console.log('user' + proxy.$store.state.token);
							console.log(res.data.data);
						}, 1000);
					});
			},
			dateFormat:function(row,column) {
			        var date = row[column.property];
			        if(date == undefined){return ''};
			        return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			filterData(data,searchContent) {
			      //var input = this.searchContent && this.searchContent.toLowerCase();
			      var input = searchContent.toLowerCase()
			      var items = data;
			      var items1;
			      if (input) {
			        items1 = items.filter(function(item) {
			          return Object.keys(item).some(function(key1) {
			            return String(item[key1])
			              .toLowerCase()
			              .match(input);
			          });
			        });
			      } else {
			        items1 = items;
			      }
			      return items1;
			    },
			current_change: function(currentPage){
			    this.currentPage = currentPage;
			},
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
				console.log(scope.row.review.status);
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
				proxy.btnDisable = false
				proxy.$axios.get('api/review/list').then(res => {
					proxy.review = res.data.data;
					console.log('review' + proxy.$store.state.token);
					console.log(res.data.data);
				});
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
						console.log('id'+proxy.reviewInfo.review_id)
						if(proxy.review_id!=''||proxy.review_id!=null){
							proxy.reviewInfo.review_id = Number(proxy.review_id)
						}else{
							proxy.reviewInfo.review_id = 4;
						}
						var reviewData = Qs.stringify(proxy.reviewInfo);
						console.log("no"+proxy.review_id)
						proxy.$axios.post('api/review/upload', reviewData).then(res => {
							setTimeout(() => {
								if (res.data.code == 200 && res.data.data != null) {
									if (proxy.review_id != null || proxy.review_id != '') {
										console.log('添加商品 ');
										proxy.dialogTableVisible = false
									} else {
										console.log('修改商品信息');
									}
									proxy.resetReviewInfo(proxy)
									// proxy.user_id = 0;
									proxy.getReviewList(proxy)
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
				proxy.resetreviewInfo(proxy)
			},
			resetReviewInfo(proxy){
				proxy.reviewInfo ={
					user_id: '',
					review_id: '',
					review_rate:'',
					review_content:'',
					book_id: '',
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
	
	.el-dropdown {
		vertical-align: top;
	}
	
	.el-dropdown + .el-dropdown {
	    margin-left: 15px;
	}
	
	.el-icon-arrow-down {
	    font-size: 12px;
	}
</style>

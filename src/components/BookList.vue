<template>
	<div class="BookList">
	<div style="width: 100%;margin-bottom: 2%;">
		<el-button @click="handleAdd(proxy)" type="primary">添加图书</el-button>
	</div>
	<div class="select" style="margin-top: 2%;margin-bottom: 2%;">
		<!-- <template slot-scope="scope"> -->
			<el-dropdown style="margin-right: 5%;" @command="(command)=>{handleCategoryCommand(command, proxy)}">
			    <el-button type="primary">
			        按分类查看
					<el-icon class="el-icon--right"><arrow-down /></el-icon>
			    </el-button>
			    <template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="all">全部</el-dropdown-item>
						<div  v-for="category in u_categories">
							<el-dropdown-item :command="category.category_name">{{category.category_name}}</el-dropdown-item>
						</div>
			        </el-dropdown-menu>
			    </template>
			</el-dropdown>
		<!-- </template> -->
		<el-dropdown @command="(command)=>{handleCommand(command, proxy)}">
		    <el-button type="primary" >
		        按评价查看
				<el-icon class="el-icon--right"><arrow-down /></el-icon>
		    </el-button>
		    <template #dropdown>
				<el-dropdown-menu>
					<div>
						<el-dropdown-item command="0">全部</el-dropdown-item>
						<el-dropdown-item command="1">好评</el-dropdown-item>
						<el-dropdown-item command="2">中评</el-dropdown-item>
						<el-dropdown-item command="3">差评</el-dropdown-item>
					</div>
		        </el-dropdown-menu>
		    </template>
		</el-dropdown>
	</div>
	<el-table 
		:data="filterData(book.slice((currentPage - 1) * pagesize, currentPage * pagesize), search)" 
		style="width: 100%;"  
		:default-sort = "{prop: 'book_id', order: 'aescending'}"
		stripe
		border
		>
		<el-table-column prop="book_id" label="图书编号" width="60"></el-table-column>
		<el-table-column prop="book_img" label="图书图片" width="160">
			<template class="demo-image" #default="scope">
			    <div :key="'fill'" class="block">
					<!-- :src="require('@/assets/img/' + scope.row.book_img)" -->
			      <el-image style="width: 100px; height: 100px" :src="require('@/assets/img/' + scope.row.book_img)" :fit="'fill'" />
			    </div>
			</template>
		</el-table-column>
		<el-table-column prop="book_title" label="图书标题" width="160"></el-table-column>
		<el-table-column prop="book_author" label="图书作者" width="160"></el-table-column>
		<el-table-column prop="category_name" label="图书类别" width="120"></el-table-column>
		<el-table-column prop="book_press" label="图书出版社" width="160"></el-table-column>
		<el-table-column prop="book_page" label="图书页数" width="60" sortable></el-table-column>
		<el-table-column prop="book_is_liked" label="图书被推荐数" width="60" sortable>
			<template #default="scope">
				<span @click="showShare(scope.$index, scope.row, proxy)">{{scope.row.book_is_liked}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="book_rate_num" label="图书评价数" width="60" sortable></el-table-column>
		<el-table-column prop="book_rate" label="图书评分" width="160" sortable>
			<template #default="scope">
			  <el-rate
			    v-model="scope.row.book_rate"
			    disabled
			    show-score
			    text-color="#ff9900"
			  />
			</template>
		</el-table-column>
		<el-table-column prop="book_desc" label="图书简介" width="160" :show-overflow-tooltip="true">
			<template #default="scope">
				<span>{{scope.row.book_desc}}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template #default="scope">
				<template v-if="scope.row.book_status != 1">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)" disabled>编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)" disabled>留档</el-button>
				</template>
				<template v-else>
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)">删除</el-button>
				</template>
			</template>
		</el-table-column>
		<el-table-column align="right">
			<template #header>
			    <el-input v-model="search" size="small" placeholder="Type to search" />
			</template>
		</el-table-column>
	</el-table>
	<el-drawer
		v-model="drawer"
	    title="分享数据"
	    :direction="direction"
		size="30%"
	>
	<el-divider />
	    <div class="UserShare" v-for="share in shares" style="margin-left: 10%;;">
	    	<div class="name" style="display: flex;float: left;font-size: 15px;">
	    		{{share.username}}
	    	</div>
	    	<div class="date" style="font-size: 15px;text-align: left;width: 40%;margin-bottom: 5%" :formatter="dateFormat">
	    		{{share.share_date}}
	    	</div>
			<div style="width: 20%;"> 
				<el-button size="mini" type="danger" @click="shareDelete(share.share_id, proxy)">删除</el-button>
			</div>
	    </div>
	</el-drawer>
	<el-pagination 
		class="pagination"
	    layout="prev, pager, next"
	    @current-change="current_change"
	    :total=1000
	    background="true"
	    >
	</el-pagination>
	<el-dialog title="添加图书分类" v-model="categoryDialogVisble" center width="27%" @close="resetCategoryInfo(proxy)">
		<el-form ref="categoryInfo" :model="categoryInfo" :label-position="right" label-width="80px">
			<el-form-item label="类别编号" prop="category_id">
				<el-input
				    name="category_id"
				    type="text"
					@keyup.enter.native="submitCate"
				    v-model="categoryInfo.category_id"
				    autocomplete="on"
				  >
				</el-input>
			</el-form-item>
			<el-form-item label="类别名称" prop="category_name">
				<el-input
				    name="category_name"
				    type="text"
					@keyup.enter.native="submitCate"
				    v-model="categoryInfo.category_name"
				    autocomplete="on"
				  >
				</el-input>
			</el-form-item>
			<el-form-item label="类别备注" prop="category_value">
				<el-input
				    name="category_value"
				    type="text"
					@keyup.enter.native="submitCate"
				    v-model="categoryInfo.category_value"
				    autocomplete="on"
				  >
				 </el-input> 
			</el-form-item>
			<el-form-item size="large">
				<el-button type="primary" @click="submitCate('categoryInfo', proxy)" style="margin-right: 10%;">确定</el-button>
				<el-button @click="handleCancel(proxy)" style="margin-right: 20%;">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<el-dialog title="编辑图书信息" v-model="dialogTableVisible" center width="27%" @close="resetBookInfo(proxy)">
		<el-form ref="bookInfo" :model="bookInfo" :rules="rules" :label-position="right" label-width="80px">
			<el-form-item label="图书编号" prop="book_id">
				<el-input v-model="bookInfo.book_id"></el-input>
			</el-form-item>
			<el-form-item label="图书标题" prop="book_title">
			<el-input
			      name="book_title"
			      type="text"
				  @keyup.enter.native="onSubmit"
			      v-model="bookInfo.book_title"
			      autocomplete="on"
			  >
			  </el-input>
			</el-form-item>
			<el-form-item label="图书作者" prop="book_author">
			  <el-input
			      name="book_author"
			      type="text"
			      @keyup.enter.native="onSubmit"
			      v-model="bookInfo.book_author"
			      autocomplete="on"
			  >
		    </el-input>
			</el-form-item>
			<el-form-item label="图书图片" prop="book_img">
			  <template #default="scope">
			   <el-upload
			     class="avatar-uploader"
			     action='api/book/list'
			     :show-file-list="false"
			     :on-success="handleAvatarSuccess"
			     :before-upload="beforeAvatarUpload"
			   >
			     <img v-if="imageUrl" :src="imageUrl" class="avatar" />
			     <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
			    </el-upload>
			  </template>
			</el-form-item>
			<el-form-item label="图书类别" prop="category_id">
				<el-select v-model="bookInfo.category_id" class="m-2" placeholder="Select" size="large">
				    <el-option
				      v-for="category in categories"
				      :key="category.category_id"
				      :label="category.category_name"
				      :value="category.category_id"
				    />
				</el-select>
				<div  style="margin-left: 2%;" @click="categoryDialog(proxy)">
					<el-icon><circle-plus /></el-icon>  
				</div>
			</el-form-item>
			<el-form-item label="图书评分" prop="book_img">
				<el-rate
					v-model="bookInfo.book_rate" 
					allow-half 
					show-score
					@change="showScore(proxy)"
				/>
			</el-form-item>
			<div v-if="proxy.bookInfo.is_add == 0">
				<el-form-item label="图书被推荐数" prop="book_is_liked">
					<el-input
					    name="book_is_liked"
					    type="text"
					    @keyup.enter.native="onSubmit"
					    v-model="bookInfo.book_is_liked"
					    autocomplete="on"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="图书评价数" prop="book_rate_num">
					<el-input
					    name="book_rate_num"
					    type="text"
					    @keyup.enter.native="onSubmit"
					    v-model="bookInfo.book_rate_num"
					    autocomplete="on"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="图书出版社" prop="book_press">
					<el-input
					    name="book_press"
					    type="text"
					    @keyup.enter.native="onSubmit"
					    v-model="bookInfo.book_press"
					    autocomplete="on"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="图书页数" prop="book_page">
					<el-input
					    name="book_page"
					    type="text"
					    @keyup.enter.native="onSubmit"
					    v-model="bookInfo.book_page"
					    autocomplete="on"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="图书简介" prop="book_desc">
					<el-input
					    name="book_desc"
					    type="text"
					    @keyup.enter.native="onSubmit"
					    v-model="bookInfo.book_desc"
					    autocomplete="on"
					>
					</el-input>
				</el-form-item>
				
			</div>
			<el-form-item size="large">
				<el-button type="primary" @click="onSubmit('bookInfo', proxy)" style="margin-right: 10%;">确定</el-button>
				<el-button @click="handleCancel(proxy)" style="margin-right: 20%;">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	</div>
</template>

<script>
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	import { User, Plus, ArrowDown, CirclePlus } from '@element-plus/icons';
	import moment from 'moment';
	export default {
		name: 'BookList',
		components: { User, Plus, ArrowDown, CirclePlus },
		filters: {
		    ellipsis(value) {
		      if (!value) return "";
		      if (value.length > 30) {
		        return value.slice(0, 30) + "...";
		      }
		      return value;
		    }
		  },

		data(){
			return{
				drawer: false,
				total: 1000,//默认数据总数
				pagesize: 5,//每页的数据条数
				currentPage: 1,//默认开始页面
				dialogTableVisible: false,
				categoryDialogVisble: false,
				book:[],
				rate_value: '',
				imageUrl:'',
				categoryInfo: {
					category_id: '',
					category_name: '',
					category_value: '',
				},
				bookInfo: {
					book_id: '',
					book_title: '',
					book_img:'',
					category_id:'',
					book_author: '',
					book_rate: '',
					book_is_liked: '',
					book_rate_num: '',
					book_press: '',
					book_page: '',
					book_desc: '',
					is_add: 0,
				},
				search: '',
				url:'@/assets/img/',
				rules: {
					book_id: [
						{ required:true, message: '图书编号不能为空', trigger: 'blur' },
					],
					book_author: [
						{ required:true, message: '图书作者不能为空', trigger: 'blur' },
					],
					book_title: [
						{ required:true, message: '图书标题不能为空', trigger: 'blur' },
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
			proxy.$axios.get('api/book/list').then(res => {
				proxy.book = res.data.data;
				console.log('book' + proxy.$store.state.token);
				console.log(res.data);
				// proxy.total = proxy.book.length
				console.log(proxy.total)
			});
			proxy.$axios.get('api/category/list').then(res => {
				proxy.categories = res.data.data;
				console.log('categories' + proxy.$store.state.token);
				console.log(res.data);
			});
			proxy.$axios.get('api/category/usedList').then(res => {
				proxy.u_categories = res.data.data;
				console.log('u_categories' + proxy.$store.state.token);
				console.log(res.data);
			});
		},
		created: function(){
		         this.total=this.book.length;
		},
		methods:{
			shareDelete(share_id, proxy) {
				var shareData = Qs.stringify({"share_id": share_id});
				proxy.$axios.post('api/share/delete', shareData).then(res => {
					setTimeout(() => {
						proxy.shares = res.data.data;
						console.log('share' + proxy.$store.state.token);
						console.log(res.data.data);
					}, 100);
				});
			},
			dateFormat:function(row, column) {
			        var date = row[column.property];
			        if(date == undefined){return ''};
			        return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			showShare(index, row, proxy) {
				proxy.drawer = true
				var shareData = Qs.stringify({"book_id": row.book_id});
				proxy.$axios.post('api/share/list', shareData).then(res => {
					setTimeout(() => {
						proxy.shares = res.data.data;
						console.log('share' + proxy.$store.state.token);
						console.log(res.data.data);
					}, 100);
				});
			},
			handleCommand(command, proxy) {
				if (command == "0") {
					proxy.$axios.get('api/book/list').then(res => {
						proxy.book = res.data.data;
						console.log('book' + proxy.$store.state.token);
						console.log(res.data);
					});
				} else {
					var rateData = Qs.stringify({"book_rate": command});
					proxy.$axios.post('api/book/byRate', rateData).then(res => {
						setTimeout(() => {
							proxy.book = res.data.data;
							console.log('book' + proxy.$store.state.token);
							console.log(res.data.data);
						}, 100);
					});
				}
			},
			categoryDialog(proxy) {
				proxy.categoryDialogVisble = true
			},
			handleCategoryCommand(command, proxy) {
					console.log(command)
					if (command == "all") {
						proxy.$axios.get('api/book/list').then(res => {
							proxy.book = res.data.data;
							console.log('book' + proxy.$store.state.token);
							console.log(res.data);
						});
					} else {
						var cateData = Qs.stringify({"category_name": command});
						proxy.$axios.post('api/book/byCate', cateData).then(res => {
							setTimeout(() => {
								proxy.book = res.data.data;
								console.log('book' + proxy.$store.state.token);
								console.log(res.data.data);
							}, 100);
						});
					}
			},
			showScore(proxy) {
				console.log("分数在不在")
				console.log(proxy.bookInfo.book_rate_num)
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
				this.bookInfo.book_img = file.name
				console.log("file:" + file.name)
				console.log("book_url:" + this.imageUrl);
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
				proxy.bookInfo.is_add = 1;
				proxy.dialogTableVisible = true;
			},
			handleEdit(index, row, proxy) {
				proxy.book_id = row.book_id;
				proxy.bookInfo = JSON.parse(JSON.stringify(row));
				console.log(proxy.bookInfo)
				proxy.bookInfo.is_add = 0
				proxy.dialogTableVisible = true;
			},
			handleDelete(index, row, proxy) {
				console.log(index, row);
				console.log(proxy);
				proxy.$axios.get('api/book/delete',
				{params:{
					no:row.book_id
				}}).then(res => {
					setTimeout(()=>{
						alert(res.data.msg)
						if(res.data.code==200 && res.data.data!=null){
							proxy.getBookList(proxy)
						}
					},1000)
				})
			},
			getBookList(proxy){
				proxy.$axios.get('api/book/list').then(res => {
					proxy.book = res.data.data;
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
						var bookData = Qs.stringify(proxy.bookInfo);
						console.log("no"+proxy.bookInfo.book_rate_num)
						console.log(bookData)
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
			submitCate(formName, proxy) {
				var cate = Qs.stringify(proxy.categoryInfo)
				proxy.$axios.post('api/category/insert', cate).then(res => {
					setTimeout(() => {
						proxy.resetCategoryInfo(proxy)
						proxy.categoryDialogVisble = false
						// proxy.user_id = 0;
						proxy.$axios.get('api/category/list').then(res => {
							proxy.categories = res.data.data;
							console.log('categories' + proxy.$store.state.token);
							console.log(res.data);
						});
					}, 1000);
				});
			},
			handleCancel(proxy) {
				proxy.dialogTableVisible = false;
				proxy.resetCategoryInfo(proxy)
				proxy.resetBookInfo(proxy)
			},
			resetBookInfo(proxy){
				proxy.bookInfo ={
					book_id: '',
					book_title: '',
					book_img:'',
					category_id:'',
					book_author: '',
				}
			},
			resetCategoryInfo(proxy){
				proxy.categoryInfo ={
					category_id:'',
					category_name:'',
					category_value:'',
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

<style>
	.el-tooltip__popper {
	    max-width:20%;
	}
	.el-tooltip__popper,.el-tooltip__popper.is-dark {
	    background:rgb(48, 65, 86) !important;
	    color: #fff !important;
	    line-height: 24px;
	}
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
	.el-pagination{
	  text-align: center;
	}
</style>

<template>
	<div class="BookList">
	<div style="width: 100%; background-color: white;">
		<el-button @click="handleAdd(proxy)" type="primary">添加图书</el-button>
	</div>
	<el-table 
		:data="book.slice((currentPage - 1) * pagesize, currentPage * pagesize)" 
		style="width: 100%;"  
		:default-sort = "{prop: 'book_id', order: 'aescending'}"
		stripe=true
		>
		<el-table-column prop="book_id" label="图书编号" width="160"></el-table-column>
		<el-table-column prop="book_img" label="图书图片" width="160">
			<template class="demo-image" #default="scope">
			    <div :key="'fill'" class="block">
			      <el-image style="width: 100px; height: 100px" :src="require('@/assets/img/' + scope.row.book_img)" :fit="'fill'" />
			    </div>
			</template>
		</el-table-column>
		<el-table-column prop="book_title" label="图书标题" width="160"></el-table-column>
		<el-table-column prop="book_author" label="图书作者" width="160"></el-table-column>
		<el-table-column prop="book_category" label="图书类别" width="160"></el-table-column>
		<el-table-column prop="book_rate" label="图书评分" width="160">
			<template #default="scope">
			  <el-rate
			    v-model="scope.row.book_rate"
			    disabled
			    show-score
			    text-color="#ff9900"
			  />
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template #default="scope">
				<template v-if="scope.row.book_status != 1">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)" disabled=true>编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)" disabled=true>留档</el-button>
				</template>
				<template v-else>
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, proxy)">删除</el-button>
				</template>
			</template>
		</el-table-column>
	</el-table>
	<el-pagination 
		class="pagination"
	    layout="prev, pager, next"
	    @current-change="current_change"
	    :total=100
	    background=true
	    >
	</el-pagination>
	<el-dialog title="编辑图书信息" v-model="dialogTableVisible" center width="27%">
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
			<el-form-item label="图书类别" prop="book_category">
				<el-input
				    name="book_category"
				    type="text"
				    @keyup.enter.native="onSubmit"
				    v-model="bookInfo.book_category"
				    autocomplete="on"
				>
				</el-input>
			</el-form-item>
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
	import { User, Plus } from '@element-plus/icons';
	export default {
		name: 'BookList',
		components: { User, Plus },
		data(){
			
			return{
				total: 1000,//默认数据总数
				pagesize: 5,//每页的数据条数
				currentPage: 1,//默认开始页面
				dialogTableVisible: false,
				book:[],
				imageUrl:'',
				bookInfo: {
					book_id: '',
					book_title: '',
					book_img:'',
					book_category:'',
					book_author: '',
				},
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
					book_category: [
						{ required:true, message: '图书类别不能为空', trigger: 'blur' },
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
			});
		},
		created: function(){
		         this.total=this.book.length;
		},
		methods:{
			current_change:function(currentPage){
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
				proxy.book_id = row.book_id;
				proxy.bookInfo = JSON.parse(JSON.stringify(row));
				console.log(proxy.bookInfo)
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
	.el-pagination{
	  text-align: center;
	}
</style>

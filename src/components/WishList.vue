<template>
	<div id="WishList">
		<el-table :data="filterData(wishlist, search)"
			style="width: 75%;margin-left: 10%;margin-top: 5%;" 
			border
			:default-sort="{ prop: 'wish_date', order: 'ascending' }"
			stripe>
			<el-table-column prop="book_id" label="图书编号" width="160px"></el-table-column>
			<el-table-column prop="book_title" label="图书标题" width="250px"></el-table-column>
			<el-table-column prop="username" label="用户名" width="200px"></el-table-column>
			<el-table-column prop="wish_date" label="添加时间" width="250px" :formatter="dateFormat" sortable></el-table-column>
			<el-table-column prop="wish_status" label="图书状态" width="160px">
				<template #default="scope">
					<template v-if="scope.row.wish_status == 1">
						<el-tag class="mx-1" type="success" size="large" disable=true>已读</el-tag>
					</template>
					<template v-else>
						<el-popconfirm
						  confirm-button-text="确定"
						  cancel-button-text="取消"
						  title="看完了吗?"
						  @confirm="handleRead(scope.$index, scope.row, proxy)"
						>
						  <template #reference>
						    <el-tag class="mx-1" type="info" size="large">未读</el-tag>
						  </template>
						</el-popconfirm>	
					</template>
				</template>
			</el-table-column>
			<el-table-column align="right" style="text-align: center;">
				<template #header>
				        <el-input v-model="search" size="small" placeholder="Type to search" />
				</template>
				<template #default="scope">
					<!-- <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row, proxy)">已读</el-button> -->
					<el-popconfirm
						confirm-button-text="确定"
						cancel-button-text="取消"
						title="确定要移出愿望单吗?"
						@confirm="handleDelete(scope.$index, scope.row, proxy)"
					>
						<template #reference>
							<el-button size="small" type="danger" style="margin-right: 35%;">移出愿望单</el-button>
						</template>
					</el-popconfirm>	
				</template>
			</el-table-column>
		</el-table>
		<div class="btn" style="margin-top: 5%;">
			<el-affix position="bottom">
				<el-button type="primary" @click="handleRecommend(proxy)">猜你喜欢</el-button>
			</el-affix>
		</div>
		<div class="bookList" v-if="getData" v-for="book in books">
			<el-card :body-style="{ padding: '0px' }" class="card" @click="handleDetail(book)">
				<div class="img">
					<img
						:src="require('@/assets/img/' + book.book_img)"
						class="image"
						:fit="'cover'"
					/>
				</div>
			    <div style="padding: 14px">
					<span>{{book.book_title}}</span>
					<div class="bottom">
						<el-rate
							v-model="book.book_rate"
							disabled
							show-score
							text-color="#ff9900"
						/>
			        </div>
			    </div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { getCurrentInstance } from 'vue';
	import Qs from 'qs';
	import moment from 'moment';
	export default {
		name: "WishList",
		data() {
			return {
				getData: false,
				wishlist: [],
				search: '',
				books: {
					book_id: '',
					book_title: '',
					book_img: '',
					book_rate: '',
				},
				book: {
					book_id: '',
					book_title: '',
					book_img: '',
					book_rate: '',
				},
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
			var user_id = Qs.stringify({"user_id": proxy.$store.state.user_id});
			proxy.$axios.post('api/user/wishlist', user_id).then(res => {
				proxy.wishlist = res.data.data;
				console.log('wishlist' + proxy.$store.state.token);
				console.log(res.data);
			});
		},
		methods: {
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
			dateFormat:function(row,column) {
			        var date = row[column.property];
			        if(date == undefined){return ''};
			        return moment(date).format("YYYY-MM-DD");
			},
			handleRead(index, row, proxy) {
				var wishlist_id = Qs.stringify({"wishlist_id": row.wishlist_id});
				proxy.$axios.post('api/wishlist/read', wishlist_id).then(res => {
					if(res.data.code==200){
						proxy.getWishlist(proxy);
						console.log("更新一下");
					} else {
						console.log("还是有问题");
					}
				});
			},
			handleDelete(index, row, proxy) {
				var wishlist_id = Qs.stringify({"wishlist_id": row.wishlist_id});
				proxy.$axios.post('api/wishlist/delete', wishlist_id).then(res => {
					if(res.data.code==200){
						proxy.getWishlist(proxy);
						console.log("更新一下");
					} else {
						console.log("还是有问题");
					}
				});
			},
			getWishlist(proxy) {
				var user_id = Qs.stringify({"user_id": proxy.$store.state.user_id});
				proxy.$axios.post('api/user/wishlist', user_id).then(res => {
					proxy.wishlist = res.data.data;
					console.log('wishlist' + proxy.$store.state.token);
					console.log(res.data);
				});
			},
			handleRecommend(proxy) {
				var user_id = Qs.stringify({"user_id": proxy.$store.state.user_id});
				proxy.$axios.post('api/recommend/res', user_id).then(res => {
					proxy.books = res.data;
					console.log(res.data)
					console.log(proxy.books);
					proxy.getData = true;
				});
			}
		}
	}
</script>

<style scoped>
.el-alert {
	margin: 20px 0 0;
}
.el-alert:first-child {
	margin: 0;
}

.bookList {
	margin-left: 10%;
}
	
.card {
	height: 10%;
	width: 20%;
	float: left;
	display: flex;
	margin-left: 7%;
	margin-top: 3%;
}
	
.bottom {
	margin-top: 13px;
	line-height: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-left: 25%;
}
	
.button {
	padding: 0;
	min-height: auto;
}
	
.image {
	width: 350px;
	height: 450px;
	display: block;
}
</style>


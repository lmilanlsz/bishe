<template>
	<div id="UserMain">
		  <a href="http://service.weibo.com/share/share.php?appkey=&title=&url=&searchPic=false&style=simple" target="_blank">分享到微博</a>
	</div>
</template>

<script>
	import {
		getCurrentInstance
	} from 'vue';
	import Qs from 'qs';
	let proxy;
	export default {
		name: "",
	}
</script>

<style>
</style>

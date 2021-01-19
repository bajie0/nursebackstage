<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		created() {
			let width = window.screen.width
			document.body.style.minWidth = width + 'px'
		}
	}
</script>

<style>
	.ui-container-table-page{
		z-index: 1;
	}
	.bottombox{
		background-color: white;
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		height: 7vh;
		
	}
	html {
		/*隐藏滚动条，当IE下溢出，仍然可以滚动*/
		-ms-overflow-style: none;
		/*火狐下隐藏滚动条*/
		overflow: -moz-scrollbars-none;
	}

	/* 	//谷歌适用 */
	::-webkit-scrollbar {
		display: none;
	}

	.bottombox {
		background-color: #ffffff;
		padding: 0 2.5rem;
	}

	.el-card {
		height: calc(100vh - 190px - 11vh);
		overflow: scroll;
		padding: 0 1.25rem;
	}
</style>

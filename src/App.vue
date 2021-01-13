<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
	html{
	    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
	    -ms-overflow-style:none;
	    /*火狐下隐藏滚动条*/
	    overflow:-moz-scrollbars-none;
	}
	
/* 	//谷歌适用 */
	::-webkit-scrollbar{
	    display:none;
	}
	
	.bottombox{
		background-color: #ffffff;
		padding: 0 2.5rem;
	}
	.el-card{
		height: calc(100vh - 190px - 11vh);
		overflow: scroll;
		padding: 0 1.25rem;
	}
/* 	.el-form-item__label{
		width: 7.5rem!important;
		padding-right: 1.25rem!important;
	}
	.el-form-item__content{
		display: flex;
		margin-left: 0!important;
	}
	.el-form-item{
		display: flex;
		width: 100%;
		align-items: center;
	}
	.el-form-item:last-child{
		padding: 0 2.5rem;
	} */
</style>

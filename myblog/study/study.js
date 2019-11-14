// 设置d1—hide最初隐藏
$(document).ready(function() {
	$("#d1-hide-1").slideUp();
	$("#d1-hide-2").slideUp();
})

// 获取按钮和隐藏
var btn_s = $('#directory-b-show')
var btn_h = $('#directory-b-hide')
var spread = $("#directory")

btn_s.click(function(){
	spread.animate({
		right:'0px'
	},200)
})
btn_h.click(function(){
	spread.animate({
		right:'-125px'
	},200)
})



// 
var btn_1 = $('#button-1')
var spread_1 = $("#d1-hide-1")

btn_1.click(function(){
	spread_1.slideToggle()
})

// 
var btn_2 = $('#button-2')
var spread_2 = $("#d1-hide-2")

btn_2.click(function(){
	spread_2.slideToggle()
})
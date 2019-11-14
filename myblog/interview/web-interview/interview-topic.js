
var answer = $(".answer")
function answerShow( i ){
	$(answer[i]).slideToggle(200);
}
function answerHide( i ){
	$(answer[i]).slideUp();
}
function answerClear( i ){
	$(answer[i]).hide();
	$(answer[i]).animate({
		display: 'block'
	},200);
}
// 设置一个annimate，是为了一开始闪一下的画面不出现

// $(document).ready(function(){
// 	var i = 0;
// 	do{
// 		answerClear( i )
// 		i = i+1;
// 	}while(answer[i])
// });
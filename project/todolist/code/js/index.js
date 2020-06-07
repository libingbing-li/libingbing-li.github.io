

// 全局组件
// 不使用全局，因为后面是父组件的子组件，所以还是变量，
//  每一个vue的组件,都是一个vue的实例
// vue中,父组件向子组件传值,是通过属性的形式传值的(v-bind，:)
// 定义一个全局组件（在任何地方都可以用）,名字为'task'
// Vue.component('task-show',{
//     // 父给组件传递了值,此时组件需要接受该值,不可直接使用
//     props: ['value','tasks','star','time'],
//     // props:本组件接受的外部传来的属性
// 	template:'<li><span>{{value}}</span><span>{{tasks}}</span></li>',
//     methods:{
//     	handleClick: function() {
//     		this.$emit('delete',this.index)
//     // [本条]$emit触发了一个事件'delete',这个事件将被父组件监听,并传递了一个参数
//     // $emit() 子组件调用父组件的方法并传递数据
//     // $refs() 父组件调用子组件的方法,可以传递数据
//     	}
//     }
// })


window.onload = function(){
    // 初始化task页数据
    var today = new Date();
    pageTask.timeYear = today.getFullYear();
    pageTask.timeMonth = today.getMonth();
    pageTask.timeDate = today.getDate();
    pageTask.time = pageTask.timeYear+'-'+(pageTask.timeMonth+1)+'-'+pageTask.timeDate;
    // pageTime获取日历对象
    pageTime.getDate("now");
    
    //读取存储在localStorage中的数据，分别是任务页list、清单页tasksList、目标页starList
    // 选择窗口tasksList、starList
    // localStorage 以键值对存储
    // JSON.parse() JSON字符串转js对象
    var list = JSON.parse(localStorage.getItem("list") || '[]');
    var tasksList = JSON.parse(localStorage.getItem("tasksList") || JSON.stringify([{tasksName:'收集箱',tasksColor:'#ddd',task:[]}]));
    var starList = JSON.parse(localStorage.getItem("starList") || '[]');
    var selectTasksList = JSON.parse(localStorage.getItem("selectTasksList") || JSON.stringify([{name: '收集箱',color:'ddd'}]));
    var selectStarList = JSON.parse(localStorage.getItem("selectStarList") || '[]');
    // 转回对象中，日期对象仍然为字符串，将其转为日期对象
    // list-time; tasksList-task-time; starList-time,startTime,endTime,task-time; 
    for(var i = 0; i < list.length; i++){
        var time = new Date(list[i].time)
        list[i].time = time;
    }
    for(var i = 0; i < tasksList.length; i++){
        for(var j = 0; j < tasksList[i].task.length; j++){
            var time = new Date(tasksList[i].task[j].time)
            tasksList[i].task[j].time = time;
        }
    }
    for(var i = 0; i < starList.length; i++){
        var time = new Date(starList[i].time)
        var timeS = new Date(starList[i].startTime)
        var timeE = new Date(starList[i].endTime)
        starList[i].time = time;
        starList[i].startTime = timeS;
        starList[i].endTime = timeE;
        for(var j = 0; j < starList[i].task.length; j++){
            var timeT = new Date(starList[i].task[j].time)
            starList[i].task[j].time = timeT;
        }
    }
    pageTask.list = list;
    pageSide.tasksList = tasksList;
    pageStar.starList = starList;
    selectWindow.tasksList = selectTasksList;
    selectWindow.starList = selectStarList;
}
// 解决软件盘推起页面的问题
var Height = document.body.clientHeight;
window.onresize = function(){
    var nowHeight = document.body.clientHeight;
    if(Height-nowHeight > 50){
        document.getElementById("body").style.height = Height+"px";
    }
    else {
        document.getElementById("body").style.height = "100%";
    }
}
// $('body').height($('body')[0].clientHeight);    
// 任务组件
var taskShow = {
    // 父给组件传递了值,此时组件需要接受该值,不可直接使用
    props:['item','index','showtask'], //showtask(html属性必须小写)告诉组件使用组件的是哪个清单，以便编写id和增加不同效果
    template:`<li 
              :class=getClass(showtask) 
              :id=getId(showtask,index,item) 
              :style=getStyle(1,item,showtask)
              >
                <!-- 完成按钮 -->
                <div 
                class="task-show-item-style" 
                @click="taskShowFinish(showtask,item,index)" 
                :style=getStyle(2,item,showtask)
                ></div>
                <!-- 文本内容 -->
                <span class="task-show-item-text">{{item.value}}</span>
                <!-- 任务更多信息 -->
                <div class="task-show-item-moreinfo">
                    <!-- 任务时间 -->
                    <div 
                    :style=getStyle(3,item,showtask)
                    >{{item.time.getFullYear()}}.{{item.time.getMonth()+1}}.{{item.time.getDate()}}</div>
                    <!-- 任务目标 -->
                    <div class="task-show-item-star" 
                    :style=getStyle(4,item,showtask)>{{item.star}}</div>
                </div>
                <!-- 编辑按钮 -->
                <div class="task-show-item-edit" @click="taskEdit(item,index)"></div>
              </li>`,
    methods:{
        getId: function(showtask,index,item){
            // 只设一个整体的id，之后通过操作元素子元素来给进行css操作
            switch(showtask){
                case "morning": return "taskShowMorning_"+index;
                case "afternoon": return "taskShowAfternoon_"+index;
                case "evening": return "taskShowEvening_"+index;
                case "today": return "taskShowToday_"+index;
                case "tomorrow": return "taskShowTomorrow_"+index;
                case "past": return "taskShowPast_"+index;
                case "tasks": 
                    for(var i = 0; i < pageSide.tasksList.length; i++){
                        if(item.tasks.name === pageSide.tasksList[i].tasksName){
                            var boxIndex = i;
                            break;
                        }
                    }
                    return "taskShowTasks_"+boxIndex+"_"+index;
                case "star":
                    for(var i = 0; i < pageStar.starList.length; i++){
                        if(item.star === pageStar.starList[i].starName){
                            var boxIndex = i;
                            break;
                        }
                    }
                    return "taskShowStar_"+boxIndex+"_"+index;
                case "time": return "taskShowTime_"+index;
            }
        },
        getStyle: function(num,item,showtask){
            //使用num区分边框线和完成框，此时为元素构建时期，使用id达不到效果
            if(num === 1){
                if(item.status){//是已完成的任务，那么
                    return "border-bottom-color:#eee;color:#aaa;background-color:#eee";
                }
                else{
                    if(showtask === "past"){ //过期任务
                        return "border-bottom-color:"+item.tasks.color+";color:#f73535;"
                    }
                    return "border-bottom-color:"+item.tasks.color+";background:none;color:#000;";
                }
            }
            else if(num === 2){
                if(item.status){//是已完成的任务，那么
                    return "border-color:#aaa;background-color:#aaa";
                }
                else{
                    return "border-color:"+item.tasks.color+";background:none;";
                }
            }
            else if(num === 3){ //时间
                if(showtask === "past" || showtask === "tasks" || showtask === "star"){ //过期任务
                    return "display:block;"
                }
                else{
                    return "display:none;"
                }
            }
            else if(num === 4){ // 目标
                if(showtask === "star" || showtask === "tasks"){
                    return "display:none;";
                }
                else {
                    return "display:block";
                }
            }
        },
        getClass: function(showtask){
            switch(showtask){
                case 'tasks':
                    return "side-item";
                case 'star':
                    return "star-item";
                case 'time':
                    return "time-task-item";
                default:
                    return "task-item";
            }
        },
        // 点击改变任务完成状态
        taskShowFinish: function(showtask,item,index) {
            // 数据改变
            // 构建循环任务并插入
            if(!item.status && item.cycle !== 0 && !item.cyclePush){
                if(!item.cyclePush)
                var cycleTask = new Object();
                cycleTask.status = false;
                cycleTask.value = item.value;
                cycleTask.tasks = new Object();
                cycleTask.tasks.name = item.tasks.name;
                cycleTask.tasks.color = item.tasks.color;
                cycleTask.star = item.star;
                cycleTask.time = new Date(item.time.getFullYear(),item.time.getMonth(),item.time.getDate()+item.cycle);
                cycleTask.period = item.period;
                cycleTask.cycle = item.cycle;
                cycleTask.cyclePush = false;
                
                // 总数据
                pageTask.list.push(cycleTask);
                // 清单列表
                for(var j = 0; j < pageSide.tasksList.length; j++){
                    if(item.tasks.name === pageSide.tasksList[j].tasksName){
                        pageSide.tasksList[j].task.push(cycleTask);
                        break;
                    }
                }
                // 目标列表
                if(item.star !==''){
                    for(var m = 0; m < pageStar.starList.length; m++){
                        if(item.star === pageStar.starList[m].starName){
                            pageStar.starList[m].task.push(cycleTask);
                            break;
                        }
                    }
                }
            }
            switch(showtask){
                case "morning": 
                    var obj = document.getElementById("taskShowMorning_"+index);
                    break;
                case "afternoon": 
                    var obj = document.getElementById("taskShowAfternoon_"+index);
                    break;
                case "evening":
                    var obj = document.getElementById("taskShowEvening_"+index);
                    break;
                case "today":
                    var obj = document.getElementById("taskShowToday_"+index);
                    break;
                case "tomorrow": 
                    var obj = document.getElementById("taskShowTomorrow_"+index);
                    break;
                case "past": 
                    var obj = document.getElementById("taskShowPast_"+index);
                    break;
                case "tasks":
                    for(var i = 0; i < pageSide.tasksList.length; i++){
                        if(item.tasks.name === pageSide.tasksList[i].tasksName){
                            var boxIndex = i;
                            break;
                        }
                    }
                    var obj = document.getElementById("taskShowTasks_"+boxIndex+'_'+index);
                    break;
                case "star":
                    for(var i = 0; i < pageStar.starList.length; i++){
                        if(item.star === pageStar.starList[i].starName){
                            var boxIndex = i;
                            break;
                        }
                    }
                    var obj = document.getElementById("taskShowStar_"+boxIndex+'_'+index);
                    break;
                case "time": 
                    var obj = document.getElementById("taskShowTime_"+index);
                    break;
            }
            if(item.status){
                obj.style.background = "none";
                obj.style.borderColor = item.tasks.color;
                obj.style.color = "#000";
                obj.firstElementChild.style.borderColor = item.tasks.color; //完成框
                obj.firstElementChild.style.background = "none";
            }
            else {
                obj.style.background = "#eee";
                obj.style.borderColor = "#eee";
                obj.style.color = "#aaa";
                obj.firstElementChild.style.borderColor = "#aaa"; //完成框
                obj.firstElementChild.style.background = "#aaa";
            }
            item.status = !item.status; 
            //js对象变量中保存的事通向对象的地址，所以改变这个地址指向的数据之后所有数据都改变了，因为列表中保存的都是地址
            
            // 数据保存到本地
            localStorage.setItem('list',JSON.stringify(pageTask.list));
            localStorage.setItem('tasksList',JSON.stringify(pageSide.tasksList));
            localStorage.setItem('starList',JSON.stringify(pageStar.starList));
        },
        // 点击编辑任务
        taskEdit: function(item,index){
            if(item.status){
                alert("已完成的任务不可编辑！");
                return;
            }
            // 修改数据
            moreWindow.taskEditIndex = index;//此时的index是在对应morningList的index
            moreWindow.taskEditItem = item;
            moreWindow.taskEditValue = item.value;
            moreWindow.taskEditTasks = item.tasks.name;
            moreWindow.taskEditYear = item.time.getFullYear();
            moreWindow.taskEditMonth = item.time.getMonth();
            moreWindow.taskEditDate = item.time.getDate();
            moreWindow.taskEditTimePeriod = item.period;
            moreWindow.taskEditTimeCycle = item.cycle;
            if(item.star !== ''){
                moreWindow.taskEditStar = item.star;
            }
            switch(item.period){
                case 'morning': moreWindow.taskEditPeriod = '-上午';break;
                case 'afternoon': moreWindow.taskEditPeriod = '-下午';break;
                case 'evening': moreWindow.taskEditPeriod = '-晚上';break;
                case 'none': moreWindow.taskEditPeriod = '';break;
            }
            if(item.cycle !== 0){
                moreWindow.taskEditCycle = "-["+item.cycle+"]";
            }
            // 出现更多窗口--编辑任务
            moreWindow.taskEditSwitch = true;
            moreWindow.taskEditShow = true;
            moreWindow.show = true;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        }
    }
}


 

// 选择小窗口
// 清单/目标组件
var selectTasksItem = {
    props:['item','index'],
    template:`<div 
               class="select-window-item" 
               :id = getId(index) 
               :style=getStyle(1,item) 
               @click="changeTasksSelect(index)">
                    <!-- 颜色圆点 -->
                    <div class="select-window-item-style" 
                     :style=getStyle(2,item)></div>
                    {{item.name}}
               </div>`,
    methods: {
        getId: function(index){
            return "selectTasksItem_"+index;
        },
        // 获取清单对应的背景颜色
        getStyle: function(num,item) {
            if(num === 1 && item.name === "收集箱"){
                return "background:#eee";
            }
            else if(num === 2){
                return "background-color: " + item.color +";";
            }
        },
        //修改tasksSelect
        changeTasksSelect: function(index) {
            selectWindow.tasksSelect = index;
            // css
            for(var i = 0; i < selectWindow.tasksList.length; i++){
                var obj = document.getElementById("selectTasksItem_"+i);
                obj.style.background = "none";
            }
            var obj = document.getElementById("selectTasksItem_"+index);
            obj.style.background = "#eee";
        }
    }
}
var selectStarItem = {
    props:['item','index'],
    template:`<div 
              class="select-window-item" 
              :id = getId(index) 
              @click="changeStarSelect(index)">
                    <!-- 颜色圆点 -->
                    <div 
                    class="select-window-item-style" 
                    v-bind:style=getStyle(item)></div>
                    {{item.name}}
              </div>`,
    methods: {
        getId: function(index){
            return "selectStarItem_"+index;
        },
        getStyle: function(item) {
            return "background-color: " + item.color +";";
        },
        //修改starSelect
        changeStarSelect: function(index) {
            selectWindow.starSelect = index;
            // css
            for(var i = 0; i < selectWindow.starList.length; i++){
                var obj = document.getElementById("selectStarItem_"+i);
                obj.style.background = "none";
            }
            var obj = document.getElementById("selectNoStar");
            obj.style.background = "none";
            var obj = document.getElementById("selectStarItem_"+index);
            obj.style.background = "#eee";
        }
    }
}
// 选择小窗口日历组件
var selectTimeItem = {
    props:['item','index'],
    template:`<div 
              class="select-time-item" 
              :id=getId(index) 
              @click="selectDate(index)">
                {{item}}
              </div>`,
    methods:{
        getId: function(index) {
            if(index > (selectWindow.timeSelectDate-1)){
                var obj = document.getElementById("selectTimeItem_"+(selectWindow.timeSelectDate-1));
                obj.style.background = "#eee";
            }
            return "selectTimeItem_"+index;
        },
        selectDate: function(index) {
            // 任务编辑
            selectWindow.timeSelectYear = selectWindow.year;
            selectWindow.timeSelectMonth = selectWindow.monthShow-1;
            selectWindow.timeSelectDate = index+1;
            pageTask.time = selectWindow.timeSelectYear+'-'+selectWindow.monthShow+'-'+selectWindow.timeSelectDate;
            for(var i = 0; i < selectWindow.timeSelectList.length; i++){
                var obj = document.getElementById("selectTimeItem_"+i);
                obj.style.background = "none";
            }
            var obj = document.getElementById("selectTimeItem_"+index);
            obj.style.background = "#eee";
        }
    }
}
//选择小窗口(总)vue实例
var selectWindow = new Vue({
    el: "#selectWindow",
    data: {
        //是否出现
        show: false,//总
        //清单相关
        tasksSwitch:false,
        tasksSelect:0,//清单选择
        tasksList:[
            {name: '收集箱',color:'#ddd'}
        ],
        //目标相关
        starSwitch:false,
        starSelect:-1,//目标无默认,0之后更改为无
        starList:[],
        // 日期相关
        timeSwitch:false,
        timeSelectYear:0,
        timeSelectMonth:0,
        timeSelectDate:0,
        timeSelectList:[],
        year:0,
        monthShow:0
    },
    components: {
        'time-s-item': selectTimeItem,
        'tasks-s-item': selectTasksItem,
        'star-s-item':selectStarItem
    },
    methods:{
        // 清单相关
        // 打开新建清单页面
        newTasks: function() {
            if(moreWindow.starNewSwitch){
                alert("新建目标时不可新建清单~")
            }
            else if(moreWindow.starEditSwitch){
                alert("编辑目标时不可新建清单~")
            }
            else if(moreWindow.taskEditSwitch){
                alert("编辑任务时不可新建清单~")
            }
            else {
                moreWindow.show = true;
                moreWindow.tasksNewSwitch = true;
                this.show = false;
            }
        },
        
        //目标相关
        // 打开新建目标页面
        newStar: function() {
            if(moreWindow.taskEditSwitch){
                alert("编辑任务时不可新建目标~")
            }
            else {
                moreWindow.show = true;
                moreWindow.starNewSwitch = true;
                moreWindow.starNewTasks = "收集箱"
                moreWindow.starNewTasksColor = "#bababa"
                var today = new Date();
                moreWindow.starNewTimeYear = today.getFullYear();
                moreWindow.starNewTimeMonth = today.getMonth()+1;
                moreWindow.starNewTimeDate = today.getDate();
                this.show = false;
                this.starSwitch = false;
            }
        },
        noStar:function() {
            this.starSelect = -1;
            // css
            for(var i = 0; i < this.starList.length; i++){
                var obj = document.getElementById("selectStarItem_"+i);
                obj.style.background = "none";
            }
            var obj = document.getElementById("selectNoStar");
            obj.style.background = "#eee";
        },
        // 日期相关
        getDate: function(str) {
            pageTime.getDate(str);
            this.year = pageTime.year;
            this.monthShow = pageTime.monthShow;
            this.timeSelectList = pageTime.timeMonthList;
        },
        period: function(){
            // 如果是设置目标的时间,那么不允许设置时期
            if(moreWindow.starNewSwitch || moreWindow.starEditSwitch){
                alert("目标不可设置时段~");
            }
            else{
                if(moreWindow.taskEditSwitch){
                    moreWindow.taskEditShow = true;
                    moreWindow.taskEditSwitch = false;
                }
                moreWindow.show = true;
                moreWindow.timePeriodSwitch = true;
                this.show = false;
            }
        },
        cycle: function(){
            if(moreWindow.starNewSwitch || moreWindow.starEditSwitch){
                alert("目标不可设置循环~");
            }
            else{
                if(moreWindow.taskEditSwitch){
                    moreWindow.taskEditShow = true;
                    moreWindow.taskEditSwitch = false;
                }
                moreWindow.show = true;
                moreWindow.timeCycleSwitch = true;
                this.show = false;
            }
        },
        //关闭
        btnClose: function() {
            if(this.timeSwitch){
                //如果是日期窗口，那么取消要恢复原本task页数据(今天)
                var today = new Date();
                pageTask.timeYear = today.getFullYear();
                pageTask.timeMonth = today.getMonth();
                pageTask.timeDate = today.getDate();
                
                pageTask.time = pageTask.timeYear+'-'+(pageTask.timeMonth+1)+'-'+pageTask.timeDate;
            }
            if(moreWindow.starNewSwitch || moreWindow.starEditSwitch || moreWindow.taskEditSwitch){
                this.show = false;
                this.tasksSwitch = false;
                this.starSwitch = false;
                this.timeSwitch = false;
                moreWindow.show = true;
            }
            if(this.timeSwitch){
                // 清除之前的选择
                for(var i = 0; i < selectWindow.timeSelectList.length; i++){
                    var obj = document.getElementById("selectTimeItem_"+i);
                    obj.style.background = "none";
                }
                this.show = false;
                this.timeSwitch = false;
            }
            else {
                this.show = false;
                this.tasksSwitch = false;
                this.starSwitch = false;
                this.timeSwitch = false;
            }
            //清除覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "none";
        },
        //确认
        btnSure: function() {
            //确认按钮分几个情况 确认清单?目标?日期?
            // 清单
            if(this.tasksSwitch){
                // 给目标设置清单
                if(moreWindow.starNewSwitch || moreWindow.starEditSwitch){
                    moreWindow.starNewTasks = this.tasksList[this.tasksSelect].name;
                    moreWindow.starNewTasksColor = this.tasksList[this.tasksSelect].color;
                    
                    this.show = false;//最后关闭窗口
                    this.tasksSwitch = false;
                    // 返回新建目标页面
                    moreWindow.show = true;
                    return;
                }
                // 给任务编辑设置清单
                else if(moreWindow.taskEditShow){
                    moreWindow.taskEditTasks = pageSide.tasksList[this.tasksSelect].tasksName;
                    moreWindow.taskEditTasksIndex = this.tasksSelect;
                    
                    this.show = false;//最后关闭窗口
                    this.tasksSwitch = false;
                    
                    // 返回新建目标页面
                    moreWindow.show = true;
                    return;
                }
                // 给任务设置清单
                else{
                    pageTask.tasksIndex = this.tasksSelect;
                    pageTask.tasks = this.tasksList[this.tasksSelect].name;
                    this.show = false;//最后关闭窗口
                    this.tasksSwitch = false;
                }
            }
            // 目标
            else if(this.starSwitch){
                // 给任务编辑设置目标
                if(moreWindow.taskEditSwitch){
                    moreWindow.taskEditStarIndex = this.starSelect;
                    if(this.starSelect === -1){
                        moreWindow.taskEditStar = "无目标";
                    }
                    else{
                        moreWindow.taskEditStar = pageStar.starList[this.starSelect].starName;
                    }
                    this.show = false;//最后关闭窗口
                    this.starSwitch = false;
                    // 返回新建目标页面
                    moreWindow.show = true;
                    return;
                }
                else {
                    pageTask.starIndex = this.starSelect;
                    if(this.starSelect === -1){
                        pageTask.star = "无目标";
                    }
                    else{
                        pageTask.star = this.starList[this.starSelect].name;
                    }
                    
                    this.show = false;//最后关闭窗口
                    this.starSwitch = false;
                }
            }
            // 时间
            else if(this.timeSwitch){
                // 给目标设置时间
                if(moreWindow.starNewSwitch || moreWindow.starEditSwitch){
                    moreWindow.starNewTimeYear = this.timeSelectYear;
                    moreWindow.starNewTimeMonth = this.timeSelectMonth+1;
                    moreWindow.starNewTimeDate = this.timeSelectDate;
                    
                    this.show = false;//最后关闭窗口
                    this.timeSwitch = false;
                    // 返回新建目标页面
                    moreWindow.show = true;
                    return;
                }
                // 给任务编辑设置时间
                if(moreWindow.taskEditSwitch){
                    moreWindow.taskEditYear = this.timeSelectYear;
                    moreWindow.taskEditMonth = this.timeSelectMonth;
                    moreWindow.taskEditDate = this.timeSelectDate;
                    this.show = false;//最后关闭窗口
                    this.timeSwitch = false;
                    // 返回新建目标页面
                    moreWindow.show = true;
                    return;
                }
                // 给任务设置时间
                else{
                    pageTask.timeYear = this.timeSelectYear;
                    pageTask.timeMonth = this.timeSelectMonth;
                    pageTask.timeDate = this.timeSelectDate;
                    pageTask.time = this.timeSelectYear+'-'+this.monthShow+'-'+this.timeSelectDate;
                    this.show = false;//最后关闭窗口
                    this.timeSwitch = false;
                }
            }
            //清除覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "none";
        }
    }
})

//小窗口导出的更多小窗 vue实例  ()
var moreWindow = new Vue({
    el: "#moreWindow",
    //data是一个对象
    data: {
        //是否出现
        show:false,
        //清单相关
        tasksNewSwitch:false,
        tasksNewName:'',
        tasksNewColor: '#bababa',
        tasksEditSwitch:false,
        tasksEditColor:'',
        tasksEditValue:'',
        tasksEditIndex:'',
        tasksEditItem:'',
        tasksDeleteSwitch:false,
        //目标相关
        starNewSwitch:false,
        starNewName:'',
        starNewTasks:'收集箱',
        starNewTasksColor:'#bababa',
        starNewTimeYear:'',
        starNewTimeMonth:'',
        starNewTimeDate:'',
        starEditItem:'',
        starEditIndex:'',
        starEditValue:'',
        starDeleteSwitch:false,
        starFinishSwitch:false,
        starFinishItem:'',
        starEditSwitch:false,
        starFinishIndex:'',
        // 时间相关
        timePeriodSwitch:false,
        timeCycleSwitch:false,
        timeCycleDays:0,
        // 任务编辑相关
        taskEditSwitch:false,
        taskEditShow:false, //用于选择时期判断是否是编辑任务
        taskEditIndex:'',
        taskEditItem:'',
        taskEditValue:'',
        taskEditTasks:'',
        taskEditTasksIndex:-1,
        taskEditStar:'无目标',
        taskEditStarIndex:-2,//-1是无目标，-2代表没修改 其余的-1代表没修改
        taskEditTimeIndex:-1,
        taskEditYear:0,
        taskEditMonth:0,
        taskEditDate:0,
        taskEditPeriod:'',
        taskEditCycle:'',
        taskEditTimePeriod:'',
        taskEditTimeCycle:0,
    },
    methods: {
        // color按钮背景颜色
        InputColorBackground: function() {
            if(this.tasksNewSwitch){
                return "background-color: " + this.tasksNewColor +";";
            }
            else if(this.tasksEditSwitch){
                return "background-color: " + this.tasksEditColor +";";
            }
            else if(this.starNewSwitch || this.starEditSwitch){
                return "background-color: " + this.starNewTasksColor +";";
            }
        },
        // 日期时段选择
        selectTimePeriod: function(str){
            if(this.taskEditShow){
                this.taskEditTimePeriod = str;
            }
            else{
                pageTask.timePeriod = str;
            }
            //清除其他选择
            for(var i = 0; i < 4; i++){
                var obj = document.getElementById("morePeriod_"+i);
                obj.style.background = "none";
            }
            if(this.taskEditShow){
                this.taskEditPeriod = "";
            }
            else{
                pageTask.timePeriodStr = "";
            }
            if(str === "morning"){
                var obj = document.getElementById("morePeriod_1");
                obj.style.background = "#eee";
                if(this.taskEditShow){
                    this.taskEditPeriod = "-上午";
                }
                else{
                    pageTask.timePeriodStr = "-上午";
                }
            }
            else if(str === "afternoon"){
                var obj = document.getElementById("morePeriod_2");
                obj.style.background = "#eee";
               if(this.taskEditShow){
                   this.taskEditPeriod = "-下午";
               }
               else{
                   pageTask.timePeriodStr = "-下午";
               }
            }
            else if(str === "evening"){
                var obj = document.getElementById("morePeriod_3");
                obj.style.background = "#eee";
                if(this.taskEditShow){
                    this.taskEditPeriod = "-晚上";
                }
                else{
                    pageTask.timePeriodStr = "-晚上";
                }
            }
            else{
                var obj = document.getElementById("morePeriod_0");
                obj.style.background = "#eee";
            }
        },
        // 任务编辑
        taskEditSelectTasks:function(){
            this.show = false;
            selectWindow.show = true;
            selectWindow.tasksSwitch = true;
        },
        taskEditSelectStar:function(){
            this.show = false;
            selectWindow.show = true;
            selectWindow.starSwitch = true;
        },
        taskEditSelectTime:function(){
            this.show = false;
            this.taskEditTimeIndex = 0; //表示选择过了时间
            pageTask.selectTime();
            selectWindow.show = true;
            selectWindow.timeSwitch = true;
        },
        taskEditDelete:function(){
            //list  删除保存的地址
            for(var i = 0; i < pageTask.list.length; i++){
                if(this.taskEditItem === pageTask.list[i]){
                    pageTask.list.splice(i,1);
                    break;
                }
            }
            //tasklist
            for(var j = 0; j < pageSide.tasksList.length; j++){
                if(this.taskEditItem.tasks.name === pageSide.tasksList[j].tasksName){
                    for(var k = 0; k < pageSide.tasksList[j].task.length; k++){
                        if(this.taskEditItem === pageSide.tasksList[j].task[k]){
                            pageSide.tasksList[j].task.splice(k,1);
                            break;
                        }
                    }
                }
            }
            //starlist
            
            if(this.taskEditItem.star !== ''){
                for(var m = 0; m < pageStar.starList.length; m++){
                    if(this.taskEditItem.star === pageStar.starList[m].starName){
                        for(var n = 0; n < pageStar.starList[m].task.length; n++){
                            if(this.taskEditItem === pageStar.starList[m].task[n]){
                                pageStar.starList[m].task.splice(n,1);
                                break;
                            }
                        }
                    }
                }
            }
            this.taskEditSwitch = false;
            this.taskEditShow = false;
            this.show = false;
            //清除覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "none";
            
            // 保存更新到本地
            localStorage.setItem('list',JSON.stringify(pageTask.list));
            localStorage.setItem('tasksList',JSON.stringify(pageSide.tasksList));
            localStorage.setItem('starList',JSON.stringify(pageStar.starList));
        },
        // 清单删除
        tasksEditDelate:function(){
            this.tasksEditSwitch = false;
            this.tasksDeleteSwitch = true;
        },
        // 目标
        // 目标选择时间
        starNewTimeF: function(){
            pageTask.selectTime();
            // this.starNewSwitch = false;  之后要返回,不删除
            this.show = false;
        },
        // 目标选择清单
        starNewTasksF: function(){
           pageTask.selectTasks();
           this.show = false;
        },
        // 删除
        starEditDelete:function(){
           this.starEditSwitch = false;
           this.starDeleteSwitch = true;
        },
        // 按钮
        // 确定取消
        moreWindowClose: function() {
            // 时期选择,清除相关数据
            if(this.timePeriodSwitch){
                for(var i = 1; i < 4; i++){
                    var obj = document.getElementById("morePeriod_"+i);
                    obj.style.background = "none";
                }
                var obj = document.getElementById("morePeriod_0");
                obj.style.background = "#eee";
                pageTask.timePeriod = 'none';
                pageTask.time = selectWindow.timeSelectYear+'-'+selectWindow.monthShow+'-'+selectWindow.timeSelectDate;
                
                //清除覆盖页 
                var cover = document.getElementById("windowCover");
                cover.style.display = "none";
            }
            else if(this.starNewSwitch){ //因为新建目标中用到选择框,所以点开的时候starSwitch会false，取消后我们要把它重新打开
                selectWindow.starSwitch = true;
            }
            else if(this.tasksDeleteSwitch){
                this.tasksDeleteSwitch = false;
                this.tasksEditSwitch = true;
            }
            else if (this.starDeleteSwitch){
                this.starDeleteSwitch = false;
                this.starEditSwitch = true;
            }
            // 如果是从pageStar/Time/Side/编辑/完成进入的,那么不出现选择框
            if(pageStar.pageSwitch || 
               pageTime.pageSwitch ||
               this.tasksEditSwitch ||
               this.starEditSwitch ||
               this.starFinishSwitch ||
               this.taskEditSwitch ||
               document.getElementById("sideList").style.left === "0px"){
                this.show = false;
                this.tasksNewSwitch = false;
                this.tasksEditSwitch = false;
                this.starNewSwitch = false;
                this.starEditSwitch = false;
                this.starFinishSwitch = false;
                this.timePeriodSwitch = false;
                this.taskEditSwitch = false;
                this.taskEditShow = false;
                this.timeCycleSwitch = false;
                //清除覆盖页 出现弹窗后禁止其他
                var cover = document.getElementById("windowCover");
                cover.style.display = "none";
            }
            else{
                this.show = false;
                this.tasksNewSwitch = false;
                this.tasksEditSwitch = false;
                this.starNewSwitch = false;
                this.starEditSwitch = false;
                this.starFinishSwitch = false;
                this.timePeriodSwitch = false;
                this.timeCycleSwitch = false;
                this.taskEditSwitch = false;
                this.taskEditShow = false;
                selectWindow.show = true;
            }
        },
        moreWindowSure: function() {
            // 清单
            //清单新建页面
            if(this.tasksNewSwitch){
                //检测
                if(this.tasksNewName === ''){
                    alert("清单名不可为空！");
                    return;
                }
                for(var i = 0; i < pageSide.tasksList.length; i++){
                    if(this.tasksNewName === pageSide.tasksList[i].tasksName){
                        alert("清单名不可重复！");
                        return;
                    }
                }
                // 将新建清单添加到总-清单列表中
                var obj = new Object();
                obj = new Object();
                obj.tasksName = this.tasksNewName;
                obj.tasksColor = this.tasksNewColor;
                obj.task = [];
                pageSide.tasksList.push(obj);
                //将清单和对应颜色添加到清单选择列表中
                var objS = new Object();
                objS.name = this.tasksNewName;
                objS.color = this.tasksNewColor;
                selectWindow.tasksList.push(objS);
                // 清除恢复初始值
                this.tasksNewName = '';
                this.tasksNewColor = "#bababa";
                this.tasksNewSwitch = false;
            }
            // 清单编辑页面 
            else if(this.tasksEditSwitch){
                //检测
                if(this.tasksEditValue === ''){
                    alert("清单名不可为空！");
                    return;
                }
                if(this.tasksEditValue !== this.tasksEditItem.tasksName){
                    for(var i = 0; i < pageSide.tasksList.length; i++){
                        if(this.tasksEditValue === pageSide.tasksList[i].tasksName){
                            alert("清单名不可重复！");
                            return;
                        }
                    }
                }
                var tasksName = pageSide.tasksList[this.tasksEditIndex].tasksName;
                // 修改添加清单页面中的清单数据
                selectWindow.tasksList[this.tasksEditIndex].name = this.tasksEditValue;
                selectWindow.tasksList[this.tasksEditIndex].color = this.tasksEditColor;
                // 修改展示清单页面中的清单数据
                pageSide.tasksList[this.tasksEditIndex].tasksColor = this.tasksEditColor;
                pageSide.tasksList[this.tasksEditIndex].tasksName = this.tasksEditValue;
                for(var i = 0; i < pageSide.tasksList[this.tasksEditIndex].task.length; i++){
                    // 展示清单任务修改
                    var tasks = new Object();
                    tasks.name = this.tasksEditValue;
                    tasks.color = this.tasksEditColor;
                    pageSide.tasksList[this.tasksEditIndex].task[i].tasks = tasks;
                }
                // 修改总任务列表中的清单任务
                for(var i = 0; i < pageTask.list.length; i++){
                    if(pageTask.list[i].tasks.name === tasksName){
                        var tasks = new Object();
                        tasks.name = this.tasksEditValue;
                        tasks.color = this.tasksEditColor;
                        pageTask.list[i].tasks = tasks;
                    }
                }
            }
            // 清单删除页面
            else if(this.tasksDeleteSwitch){
                // 删除总任务列表中的清单任务
                for(var i = 0; i < pageTask.list.length; i++){
                    if(pageTask.list[i].tasks.name === this.tasksEditItem.tasksName){
                        pageTask.list.splice(i,1);
                        i = i-1;
                    }
                }
                // 删除目标和移除目标任务目标
                for(var m = 0; m < pageStar.starList.length; m++){
                    if(pageStar.starList[m].tasks.name === this.tasksEditItem.tasksName){
                        // 移除目标任务目标，由于存放的是地址，所以只要更改就好
                        for(var n = 0; n < pageStar.starList[m].task.length; n++){
                            pageStar.starList[m].task[n].star = '';
                        }
                        // 删除目标
                        pageStar.starList.splice(m,1);
                        // 选择框删除
                        selectWindow.starList.splice(m,1);
                        m = m-1; //此时已经删除了一下，这个下标又下一个目标顶上
                    }
                }
                // 删除清单添加页面中的被删清单
                selectWindow.tasksList.splice(this.tasksEditIndex,1);
                // 删除展示清单页面中的被删清单
                pageSide.tasksList.splice(this.tasksEditIndex,1);
            }
            // 目标新建页面
            else if(this.starNewSwitch){
                //检测
                if(this.starNewName === ''){
                    alert("目标名不可为空！");
                    return;
                }
                for(var i = 0; i < pageStar.starList.length; i++){
                    if(this.starNewName === pageStar.starList[i].starName){
                        alert("目标名不可重复！");
                        return;
                    }
                }
                // 将新建目标添加到总-目标列表中
                var obj = new Object();
                var objDate = new Date(this.starNewTimeYear,this.starNewTimeMonth-1,this.starNewTimeDate);
                var objTasks = new Object();
                objTasks.name = this.starNewTasks;
                objTasks.color = this.starNewTasksColor;
                obj.starName = this.starNewName;
                obj.status = false; //默认目标未完成
                obj.tasks = objTasks;
                obj.time = objDate;
                obj.task = [];
                obj.description = "该目标暂时没有描述~"; //目标完成后添加描述
                // 添加开始时间和结束时间
                var st = new Date();
                obj.startTime = new Date(st.getFullYear(),st.getMonth(),st.getDate());
                obj.endTime = obj.startTime;
                // 以时间顺序添加入starList列表
                if(pageStar.starList.length === 0){
                    pageStar.starList.push(obj);
                }
                else{
                    var length = pageStar.starList.length;
                    for(var i = 0; i < length; i++){
                        if(!pageStar.starList[i].status && obj.time.getTime() < pageStar.starList[i].time.getTime()){
                            pageStar.starList.splice(i,0,obj);
                            break;
                        }
                        else if(i === (length-1)){
                            pageStar.starList.push(obj);
                            break;
                        }
                    }
                }
                //将目标添加到目标选择列表中
                var sobj = new Object();
                sobj.name = this.starNewName;
                sobj.color = this.starNewTasksColor;
                selectWindow.starList.push(sobj);
                // 修改star页的noStar以显示目标
                if(pageStar.starList.length !== 0){
                    pageStar.noStar = false;
                }
                // 返回选择框,打开选择框的star[时间相关的会被赋值]
                selectWindow.starSwitch = true;
                // 清除恢复旧值
                this.starNewName='';
                this.starNewTasks='收集箱';
                this.starNewTasksColor='#bababa';
                this.starNewSwitch = false;
            }
            // 目标编辑页面
            else if(this.starEditSwitch){
                //检测
                if(this.starEditValue === ''){
                    alert("目标名不可为空！");
                    return;
                }
                if(this.starEditValue !== this.starEditItem.starName){
                    for(var i = 0; i < pageStar.starList.length; i++){
                        if(this.starEditValue === pageStar.starList[i].starName){
                            alert("目标名不可重复！");
                            return;
                        }
                    }
                }
                // 将新建目标添加到总-目标列表中
                var objDate = new Date(this.starNewTimeYear,this.starNewTimeMonth-1,this.starNewTimeDate);
                var objTasks = new Object();
                objTasks.name = this.starNewTasks;
                objTasks.color = this.starNewTasksColor;
                pageStar.starList[this.starEditIndex].starName = this.starEditValue;
                pageStar.starList[this.starEditIndex].tasks = objTasks;
                pageStar.starList[this.starEditIndex].time = objDate;
                // 检测时间以排序
                for(var m = 0; m < pageStar.starList.length; m++){
                    if(pageStar.starList[this.starEditIndex].time.getTime() < pageStar.starList[m].time.getTime()){
                        pageStar.starList.splice(m,0,pageStar.starList[this.starEditIndex]);
                        pageStar.starList.splice(this.starEditIndex+1,1);
                    }
                }
                // 修改目标选择列表
                selectWindow.starList[this.starEditIndex].name = this.starEditValue;
                selectWindow.starList[this.starEditIndex].color = this.starNewTasksColor;
                // 动态刷新
                pageStar.pageSwitch = false;
                pageStar.pageSwitch = true;
            }
            // 目标删除页面
            else if(this.starDeleteSwitch){
                // 移除目标任务的目标 (存放的是地址)
                for(var i = 0; i < this.starEditItem.task.length; i++){
                    this.starEditItem.task[i].star = '';
                }
                // 删除目标添加页面中的被删目标
                selectWindow.starList.splice(this.starEditIndex,1);
                // 删除展示目标页面中的被删目标
                pageStar.starList.splice(this.starEditIndex,1);
                // 判断是否有目标
                if(pageStar.starList.length === 0){
                    pageStar.noStar = true;
                }
            }
            // 目标完成确认页面
            else if(this.starFinishSwitch){
                // 改变数据
                // 增加完成时间
                var et = new Date();
                this.starFinishItem.endTime = new Date(et.getFullYear(),et.getMonth(),et.getDate());
                // 删除list中目标任务（未完成)
                for(var i = 0; i < pageTask.list.length; i++){
                    if(pageTask.list[i].star === this.starFinishItem.starName &&
                       (!pageTask.list[i].status)){
                           pageTask.list.splice(i,1);
                       }
                }
                // 删除starList的task（未完成）以及修改次序
                for(var j = 0; j < pageStar.starList[this.starFinishIndex].task.length; j++){
                    if(!pageStar.starList[this.starFinishIndex].task[j].status){
                        pageStar.starList[this.starFinishIndex].task.splice(j,1);
                    }
                }
                for(var m = 0; m < pageStar.starList.length; m++){
                    if(pageStar.starList[m].status && m !== pageStar.starList.length-1 && !pageStar.starList[m+1].status){
                        pageStar.starList.splice(m+1,0,this.starFinishItem);
                        pageStar.starList.splice(this.starFinishIndex+1,1);
                        this.starFinishIndex = m+1;
                        this.starFinishItem.status = true;//也改变了pageStar starList列表中该项的值
                        break;
                    }
                    continue;
                }
                if(!pageStar.starList[0].status){
                    pageStar.starList.splice(0,0,this.starFinishItem);
                    pageStar.starList.splice(this.starFinishIndex+1,1);
                    this.starFinishIndex = 0;
                    this.starFinishItem.status = true;
                }
                // 删除star选择
                for(var k = 0; k < selectWindow.starList.length; k++){
                    if(selectWindow.starList[k].name === this.starFinishItem.starName){
                        selectWindow.starList.splice(k,1);
                    }
                }
                // 改变css
                var style = document.getElementById("starNameStyle_"+this.starFinishIndex);
                var name = document.getElementById("starName_"+this.starFinishIndex);
                var list = document.getElementById("star_"+this.starFinishIndex);
                name.lastElementChild.display = "block";
                style.style.border = "none";
                style.style.backgroundColor = this.starFinishItem.tasks.color;
                list.firstElementChild.style.display = "block";
                
                if(list.style.height !== "0px"){
                    name.click();
                }
            }
            // 任务编辑界面
            else if(this.taskEditSwitch){
                // 修改数据
                if(this.taskEditStarIndex === -1) {
                    for(var i = 0; i < pageStar.starList.length; i++){
                        if(pageStar.starList[i].starName === this.taskEditItem.star){
                            for(var j = 0; j < pageStar.starList[i].task.length; j++){
                                if(pageStar.starList[i].task[j] === this.taskEditItem){
                                    pageStar.starList[i].task.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                    this.taskEditItem.star = '';
                }
                else if(this.taskEditStarIndex !== -2 &&
                   pageStar.starList[this.taskEditStarIndex].starName !== this.taskEditItem.star){
                       for(var i = 0; i < pageStar.starList.length; i++){
                           if(pageStar.starList[i].starName === this.taskEditItem.star){
                               for(var j = 0; j < pageStar.starList[i].task.length; j++){
                                   if(pageStar.starList[i].task[j] === this.taskEditItem){
                                       pageStar.starList[i].task.splice(j,1);
                                       break;
                                   }
                               }
                           }
                       }
                       pageStar.starList[this.taskEditStarIndex].task.push(this.taskEditItem);
                       this.taskEditItem.star = pageStar.starList[this.taskEditStarIndex].starName;
                       // star时间排序
                       for(var m = 0; m < pageStar.starList[this.taskEditStarIndex].task.length-1; m++){
                           for(var n = 0; n < pageStar.starList[this.taskEditStarIndex].task.length-1-m; n++){
                               if(pageStar.starList[this.taskEditStarIndex].task[n].time.getTime() > pageStar.starList[this.taskEditStarIndex].task[n+1].time.getTime()){
                                   pageStar.starList[this.taskEditStarIndex].task.splice(n+2,0,pageStar.starList[this.taskEditStarIndex].task[n]); //在下标为k+2处增加一个项
                                   pageStar.starList[this.taskEditStarIndex].task.splice(n,1);
                               }
                           }
                       }
                }
                
                
                if(this.taskEditTasksIndex !== -1 &&
                   this.taskEditItem.tasks.name !== pageSide.tasksList[this.taskEditTasksIndex].tasksName){
                    for(var i = 0; i < pageSide.tasksList.length; i++){
                        if(pageSide.tasksList[i].tasksName === this.taskEditItem.tasks.name){
                            for(var j = 0; j < pageSide.tasksList[i].task.length; j++){
                                if(pageSide.tasksList[i].task[j] === this.taskEditItem){
                                    pageSide.tasksList[i].task.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                    pageSide.tasksList[this.taskEditTasksIndex].task.push(this.taskEditItem);
                    this.taskEditItem.tasks.name = pageSide.tasksList[this.taskEditTasksIndex].tasksName;
                    this.taskEditItem.tasks.color = pageSide.tasksList[this.taskEditTasksIndex].tasksColor;
                    // 排序
                    for(var i = 0; i < pageSide.tasksList[this.taskEditTasksIndex].task.length-1; i++){
                        for(var j = 0; j < pageSide.tasksList[this.taskEditTasksIndex].task.length-1-i; j++){
                            if(pageSide.tasksList[this.taskEditTasksIndex].task[j].time.getTime() > pageSide.tasksList[this.taskEditTasksIndex].task[j+1].time.getTime()){
                                pageSide.tasksList[this.taskEditTasksIndex].task.splice(j+2,0,pageSide.tasksList[this.taskEditTasksIndex].task[j]); //在下标为k+2处增加一个项
                                pageSide.tasksList[this.taskEditTasksIndex].task.splice(j,1);
                            }
                        }
                    }
                }
                this.taskEditItem.value = this.taskEditValue;
                if(this.taskEditTimeIndex !== -1){
                    this.taskEditItem.time = new Date(this.taskEditYear,this.taskEditMonth,this.taskEditDate);
                    this.taskEditItem.period = this.taskEditTimePeriod;
                    this.taskEditItem.cycle = this.taskEditTimeCycle;
                }
            }
            // 日期选择时段
            else if(this.timePeriodSwitch){
                if(this.taskEditShow){
                    this.taskEditSwitch = true;
                    this.timePeriodSwitch = false;
                    return;
                 }
                 else{
                    pageTask.timeYear = selectWindow.timeSelectYear;
                    pageTask.timeMonth = selectWindow.timeSelectMonth;
                    pageTask.timeDate = selectWindow.timeSelectDate;
                    selectWindow.timeSwitch = false;
                 }
            }
            // 日期选择循环
            else if(this.timeCycleSwitch){
                if(parseInt(this.timeCycleDays,10) === "NaN"){
                    alert("循环间隔天数必须为数字(为0则无循环)！");
                    return;
                }
                else {
                    var timeCycleDays = parseInt(this.timeCycleDays,10);
                    if(this.taskEditShow){
                        this.taskEditTimeCycle = timeCycleDays;
                        if(timeCycleDays !== 0){
                            var str = "-["+timeCycleDays+']';
                            this.taskEditCycle = str;
                        }
                        else{
                            this.taskEditCycle = '';
                        }
                        this.taskEditSwitch = true;
                        this.timeCycleSwitch = false;
                        return;
                    }
                    else{
                        pageTask.timeCycle = timeCycleDays;
                        if(timeCycleDays !== 0){
                            var str = "-["+timeCycleDays+']';
                            pageTask.timeCycleStr = str;
                        }
                        else{
                            pageTask.timeCycleStr = '';
                        }
                    }
                }
                pageTask.timeYear = selectWindow.timeSelectYear;
                pageTask.timeMonth = selectWindow.timeSelectMonth;
                pageTask.timeDate = selectWindow.timeSelectDate;
                selectWindow.timeSwitch = false;
            }
            //初始化添加任务的数据（选择了清单/目标，没有提交就删除/完成了他们，此时需要初始化一下以免出现错误）
            // 在编辑中使用过他们，需要初始化一下
            if(this.tasksEditSwitch ||
               this.tasksDeleteSwitch ||
               this.starEditSwitch ||
               this.starDeleteSwitch ||
               this.starFinishSwitch ||
               this.taskEditSwitch){
                // 初始化数据
                pageTask.value = '';
                pageTask.tasksIndex = 0;
                pageTask.starIndex = -1;
                pageTask.timePeriod = '';
                //按钮
                pageTask.tasks='收集箱';
                pageTask.star='无目标';
                //初始化时间
                var today = new Date();
                pageTask.timeYear = today.getFullYear();
                pageTask.timeMonth = today.getMonth();
                pageTask.timeDate = today.getDate();
                pageTask.time = pageTask.timeYear+'-'+(pageTask.timeMonth+1)+'-'+pageTask.timeDate;
                pageTask.timeCycle = 0;
                pageTask.timeCycleStr = '';
                // 恢复日期选项css 
                for(var i = 0; i < selectWindow.timeSelectList.length; i++){
                    var obj = document.getElementById("selectTimeItem_"+i);
                    obj.style.background = "none";
                }
                // 恢复时段选项css
                for(var i = 1; i < 4; i++){
                    var obj = document.getElementById("morePeriod_"+i);
                    obj.style.background = "none";
                }
                var obj = document.getElementById("morePeriod_0");
                moreWindow.timeCycleDays = 0;
                // 恢复清单/目标选择css
                for(var i = 0; i < selectWindow.tasksList.length; i++){
                    var tobj = document.getElementById("selectTasksItem_"+i);
                    tobj.style.background = "none";
                }
                var tobj = document.getElementById("selectTasksItem_0");
                tobj.style.background = "#eee";
                for(var j = 0; j < selectWindow.starList.length; j++){
                    var sobj = document.getElementById("selectStarItem_"+j);
                    sobj.style.background = "none";
                }
            }
            // 恢复初始值
            this.show = false;
            // 如果是从pageStar/pageTime/Side/编辑/删除/完成/日期更多选择进入的,那么不出现选择框
            if(pageStar.pageSwitch || 
               pageTime.pageSwitch ||
               this.timePeriodSwitch ||
               this.timeCycleSwitch ||
               this.starEditSwitch ||
               this.starDeleteSwitch ||
               this.starFinishSwitch ||
               this.tasksEditSwitch ||
               this.tasksDeleteSwitch ||
               this.taskEditSwitch ||
               this.taskEditShow ||
               document.getElementById("sideList").style.left === "0px"){
                selectWindow.show = false;
                selectWindow.starSwitch = false;
                this.timePeriodSwitch = false;
                this.timeCycleSwitch = false;
                this.starFinishSwitch = false;
                this.starEditSwitch = false;
                this.starDeleteSwitch = false;
                this.tasksEditSwitch = false;
                this.tasksDeleteSwitch = false;
                this.taskEditSwitch = false;
                this.taskEditShow = false;
                
                //清除覆盖页 出现弹窗后禁止其他
                var cover = document.getElementById("windowCover");
                cover.style.display = "none";
            }
            else if(pageTime.pageSwitch){
                selectWindow.show = false;
                selectWindow.starSwitch = false;
                // 动态刷新
                pageTime.pageSwitch = false;
                pageTime.pageSwitch = true;
                //清除覆盖页 出现弹窗后禁止其他
                var cover = document.getElementById("windowCover");
                cover.style.display = "none";
            }
            else{
                selectWindow.show = true;
            }
            
            // 保存更新到本地
            localStorage.setItem('list',JSON.stringify(pageTask.list));
            localStorage.setItem('tasksList',JSON.stringify(pageSide.tasksList));
            localStorage.setItem('starList',JSON.stringify(pageStar.starList));
            localStorage.setItem('selectTasksList',JSON.stringify(selectWindow.tasksList));
            localStorage.setItem('selectStarList',JSON.stringify(selectWindow.starList));
        }
    }
})


// 三个页面的vue实例  
//任务页
var pageTask = new Vue({
    // 局部组件需要用components在vue实例中注册
    el:"#pageTask",
    data:{
        //任务页是否出现
        pageSwitch: true,
        value:'',
        //list: 基础表单,保存任务数据-内容(清单,目标,日期)
        list: [
            // { value: '编辑', tasks: {name:'收集箱',color:'#666666'}, star:'', time:'', period:'', cycle:0, status:false}
        ],  // 要向列表添加对象
        //清单
        tasksIndex:0,//让select页传值index,默认为收集箱
        // 目标
        starIndex:-1,//任务可以没有目标
        // 时间
        timeYear:0,
        timeMonth:0,
        timeDate:0,
        timePeriod:'',
        timeCycle:0,
        // 按钮展示
        tasks:'收集箱',
        star:'无目标',
        time:'',
        timePeriodStr:'',
        timeCycleStr:'',
        // 显示清单
        morningList:[],
        afternoonList:[],
        eveningList:[],
        todayList:[],
        tomorrowList:[],
        pastList:[]
    },
    components:{
        "task-show": taskShow,
        },
    methods:{
    	// 将输入框中的内容提交到列表
    	taskSubmit: function() {
            if(this.value === ''){
                alert("任务不可为空！");
                return;
            }
            //首先建立一个对象 
            var pushList = new Object();
            //内容
            pushList.value = this.value;
            //清单(name,color
            var tasksObj = new Object();
            tasksObj.name = pageSide.tasksList[this.tasksIndex].tasksName;
            tasksObj.color = pageSide.tasksList[this.tasksIndex].tasksColor;
            pushList.tasks = tasksObj;
            //日期
            pushList.time = new Date(this.timeYear,this.timeMonth,this.timeDate);
            pushList.period = this.timePeriod;
            pushList.cycle = this.timeCycle;
            pushList.cyclePush = false; //表示没有完成过，所以没有创建过新的循环任务，
            // 如果点击完成（循环创建）之后取消，再次完成时，根据这个判断是否要创建循环
            // 给任务添加状态:未完成
            pushList.status = false;
            //目标
            if(this.starIndex === -1){
                pushList.star = '';
            }
            else {
                pushList.star = pageStar.starList[this.starIndex].starName;
                pageStar.starList[this.starIndex].task.push(pushList);
            }
            // 添加任务到tasksList
            pageSide.tasksList[this.tasksIndex].task.push(pushList);
            //添加任务到总列表     本处的this为pageTask实例 
    		this.list.push(pushList);
            // 给清单/目标任务单时间排序（冒泡）
            // 进行n-1轮比较
            for(var i = 0; i < pageSide.tasksList[this.tasksIndex].task.length-1; i++){
                for(var j = 0; j < pageSide.tasksList[this.tasksIndex].task.length-1-i; j++){
                    if(pageSide.tasksList[this.tasksIndex].task[j].time.getTime() > pageSide.tasksList[this.tasksIndex].task[j+1].time.getTime()){
                        pageSide.tasksList[this.tasksIndex].task.splice(j+2,0,pageSide.tasksList[this.tasksIndex].task[j]); //在下标为k+2处增加一个项
                        pageSide.tasksList[this.tasksIndex].task.splice(j,1);
                    }
                }
            }
            if(this.starIndex !== -1){
                for(var m = 0; m < pageStar.starList[this.starIndex].task.length-1; m++){
                    for(var n = 0; n < pageStar.starList[this.starIndex].task.length-1-m; n++){
                        if(pageStar.starList[this.starIndex].task[n].time.getTime() > pageStar.starList[this.starIndex].task[n+1].time.getTime()){
                            pageStar.starList[this.starIndex].task.splice(n+2,0,pageStar.starList[this.starIndex].task[n]); //在下标为k+2处增加一个项
                            pageStar.starList[this.starIndex].task.splice(n,1);
                        }
                    }
                }
            }
            // 初始化数据
    		this.value = '';
            this.tasksIndex = 0;
            this.starIndex = -1;
            this.timePeriod = '';
            //按钮
            this.tasks='收集箱';
            this.star='无目标';
            //初始化时间
            var today = new Date();
            this.timeYear = today.getFullYear();
            this.timeMonth = today.getMonth();
            this.timeDate = today.getDate();
            this.time = this.timeYear+'-'+(this.timeMonth+1)+'-'+this.timeDate;
            this.timeCycle = 0;
            this.timeCycleStr = '';
            // 恢复日期选项css 
            for(var i = 0; i < selectWindow.timeSelectList.length; i++){
                var obj = document.getElementById("selectTimeItem_"+i);
                obj.style.background = "none";
            }
            // 恢复时段选项css
            for(var i = 1; i < 4; i++){
                var obj = document.getElementById("morePeriod_"+i);
                obj.style.background = "none";
            }
            var obj = document.getElementById("morePeriod_0");
            moreWindow.timeCycleDays = 0;
            // 恢复清单/目标选择css 数据
            for(var i = 0; i < selectWindow.tasksList.length; i++){
                var tobj = document.getElementById("selectTasksItem_"+i);
                tobj.style.background = "none";
            }
            var tobj = document.getElementById("selectTasksItem_0");
            tobj.style.background = "#eee";
            for(var j = 0; j < selectWindow.starList.length; j++){
                var sobj = document.getElementById("selectStarItem_"+j);
                sobj.style.background = "none";
            }
            selectWindow.tasksSelect = 0;//清单选择
            selectWindow.starSelect = -1;//目标无默认
            
            // 保存更新到本地
            localStorage.setItem('list',JSON.stringify(pageTask.list));
            localStorage.setItem('tasksList',JSON.stringify(pageSide.tasksList));
            localStorage.setItem('starList',JSON.stringify(pageStar.starList));
        },
        // 清单
        //选择清单
        selectTasks: function(){
            //出现选择框
            selectWindow.show = true;
            //出现清单选择
            selectWindow.tasksSwitch = true;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        },
        //目标
        //选择目标
        selectStar: function(){
            //出现选择框
            selectWindow.show = true;
            //出现目标选择
            selectWindow.starSwitch = true;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        },
        // 日期
        //选择日期
        selectTime: function(){
            // 添加数据
            pageTime.getDate("now");
            selectWindow.year = pageTime.year;
            selectWindow.monthShow = pageTime.monthShow;
            selectWindow.timeSelectList = pageTime.timeMonthList;
            // 默认为当前天
            selectWindow.timeSelectYear = pageTask.timeYear;
            selectWindow.timeSelectMonth = pageTask.timeMonth;
            selectWindow.timeSelectDate = pageTask.timeDate;
            //出现选择框
            selectWindow.show = true;
            //出现日期选择
            selectWindow.timeSwitch = true;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        },
        // 显示
        //点击显示or收起
        showList: function(index) {
            //收起所有清单列表,同一时刻只能有一个清单列表出现
            for(var i = 0 ; i < index; i++){
                var otherId = "showList_"+i;
                var otherTasks = document.getElementById(otherId);
                otherTasks.style.height = "0px";
            }
            i = index + 1;
            for(; i < 6; i++){
                var otherId = "showList_"+i;
                var otherTasks = document.getElementById(otherId);
                otherTasks.style.height = "0px";
            }
            //获得显示任务清单
            var date = new Date();
            //此处要用到getTime方法，保证对比双方都是0点
            var today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            switch(index){
                case 0: //上午
                    this.morningList = []; //初始化
                    for(var i = 0; i < this.list.length; i++){
                        if(this.list[i].time.getTime() === today.getTime() &&
                        this.list[i].period === "morning" &&
                        !this.list[i].status){
                            this.morningList.push(this.list[i]);
                        }
                    }
                    //展开动作
                    //然后展开点击清单,再次点击收起
                    var id = "showList_"+index;
                    var tasks = document.getElementById(id);
                    if(this.morningList.length === 0){
                        var num = 1;
                    }
                    else{
                        var num = this.morningList.length;
                    }
                    var tasksHeight = 2.15*num+"rem";
                    if(tasks.style.height === "0px"){
                        tasks.style.height = tasksHeight;
                    }
                    else {
                        tasks.style.height = "0px";
                    }
                    break;
                case 1: //下午
                    this.afternoonList = []; //初始化
                    for(var i = 0; i < this.list.length; i++){
                        if(this.list[i].time.getTime() === today.getTime() &&
                        this.list[i].period === "afternoon" &&
                        !this.list[i].status){
                            this.afternoonList.push(this.list[i]);
                        }
                    }
                    //展开动作
                    //然后展开点击清单,再次点击收起
                    var id = "showList_"+index;
                    var tasks = document.getElementById(id);
                    if(this.afternoonList.length === 0){
                        var num = 1;
                    }
                    else{
                        var num = this.afternoonList.length;
                    }
                    var tasksHeight = 2.15*num+"rem";
                    if(tasks.style.height === "0px"){
                        tasks.style.height = tasksHeight;
                    }
                    else {
                        tasks.style.height = "0px";
                    }
                    break;
                case 2: //晚上
                    this.eveningList = []; //初始化
                    for(var i = 0; i < this.list.length; i++){
                        if(this.list[i].time.getTime() === today.getTime() &&
                        this.list[i].period === "evening" &&
                        !this.list[i].status){
                            this.eveningList.push(this.list[i]);
                        }
                    }
                    //展开动作
                    //然后展开点击清单,再次点击收起
                    var id = "showList_"+index;
                    var tasks = document.getElementById(id);
                    if(this.eveningList.length === 0){
                        var num = 1;
                    }
                    else{
                        var num = this.eveningList.length;
                    }
                    var tasksHeight = 2.15*num+"rem";
                    if(tasks.style.height === "0px"){
                        tasks.style.height = tasksHeight;
                    }
                    else {
                        tasks.style.height = "0px";
                    }
                    break;
                case 3: //今日
                    this.todayList = []; //初始化
                    for(var i = 0; i < this.list.length; i++){
                        if(this.list[i].time.getTime() === today.getTime()){
                            this.todayList.push(this.list[i]);
                        }
                    }
                    // 将所有完成任务放到一个数组中，并删除原数组中的任务，
                    // 循环完成后，将临时数组中任务放至原数组中。这样就达成了完成任务放末尾的需求
                    var finish = new Array();
                    for(var j = 0; j <this.todayList.length; j++){
                        if(this.todayList[j].status){
                            finish.push(this.todayList[j]);
                            this.todayList.splice(j,1);
                            j = j-1;
                        }
                    }
                    for(var k = 0; k < finish.length; k++){
                        this.todayList.push(finish[k]);
                    }
                    //展开动作
                    //然后展开点击清单,再次点击收起
                    var id = "showList_"+index;
                    var tasks = document.getElementById(id);
                    if(this.todayList.length === 0){
                        var num = 1;
                    }
                    else{
                        var num = this.todayList.length;
                    }
                    var tasksHeight = 2.15*num+"rem";
                    if(tasks.style.height === "0px"){
                        tasks.style.height = tasksHeight;
                    }
                    else {
                        tasks.style.height = "0px";
                    }
                    break;
                case 4: //明天
                    this.tomorrowList = []; //初始化
                    for(var i = 0; i < this.list.length; i++){
                        if(((this.list[i].time.getTime()-today.getTime())/1000/60/60/24) === 1){
                            this.tomorrowList.push(this.list[i]);
                        }
                    }
                    var finish = new Array();
                    for(var j = 0; j < this.tomorrowList.length; j++){
                        if(this.tomorrowList[j].status){
                            finish.push(this.tomorrowList[j]);
                            this.tomorrowList.splice(j,1);
                            j = j-1;
                        }
                    }
                    for(var k = 0; k < finish.length; k++){
                        this.tomorrowList.push(finish[k]);
                    }
                    //展开动作
                    //然后展开点击清单,再次点击收起
                    var id = "showList_"+index;
                    var tasks = document.getElementById(id);
                    if(this.tomorrowList.length === 0){
                        var num = 1;
                    }
                    else{
                        var num = this.tomorrowList.length;
                    }
                    var tasksHeight = 2.15*num+"rem";
                    if(tasks.style.height === "0px"){
                        tasks.style.height = tasksHeight;
                    }
                    else {
                        tasks.style.height = "0px";
                    }
                    break;
                case 5: //过期
                    this.pastList = []; //初始化
                    for(var i = 0; i < this.list.length; i++){
                        if(this.list[i].time.getTime() < today.getTime() &&
                           !this.list[i].status){
                            this.pastList.push(this.list[i]);
                        }
                    }
                    // 按时间排序  (冒泡排序)
                    // 进行n-1轮比较
                    for(var j = 0; j < this.pastList.length-1; j++){
                        for(var k = 0; k < this.pastList.length-1-j; k++){
                            if(this.pastList[k].time.getTime() > this.pastList[k+1].time.getTime()){
                                this.pastList.splice(k+2,0,this.pastList[k]); //在下标为k+2处增加一个项
                                this.pastList.splice(k,1);
                            }
                        }
                    }
                    //展开动作
                    //然后展开点击清单,再次点击收起
                    var id = "showList_"+index;
                    var tasks = document.getElementById(id);
                    if(this.pastList.length === 0){
                        var num = 1;
                    }
                    else{
                        var num = this.pastList.length;
                    }
                    var tasksHeight = 2.15*num+"rem";
                    if(tasks.style.height === "0px"){
                        tasks.style.height = tasksHeight;
                    }
                    else {
                        tasks.style.height = "0px";
                    }
                    break;
            }
        }
    }
})



//目标页
//目标页组件
var starShow = {
    // 父给组件传递了值,此时组件需要接受该值,不可直接使用
    props: ['item','index','tasklist','year','month','date','tasks','daynum','showtask'],
    // props:本组件接受的外部传来的属性
    template: `<div class="star-box">
                    <!-- 目标名 -->
                    <div 
                    class="star-name" 
                    :style=getStyle(1,item) 
                    :id=getId(0,index) 
                    @click=starSwitch(item,index)>
                        <!-- 目标完成按钮 -->
                        <div 
                        class="star-name-style" 
                        :id=getId(1,index) 
                        :style = getStyle(6,item)
                        @click=starFinish(item,index)></div>
                        <!-- 目标文本内容 -->
                        <span 
                        class="star-name-text">
                            {{item.starName}}
                        </span>
                        <!-- 目标更多信息 -->
                        <div class="star-name-moreinfo">
                            <!-- 目标期望完成日期 -->
                            <div class="star-name-time">
                                {{year}}-{{month}}-{{date}}
                            </div>
                            <!-- 目标所属清单 - 当前日期距离完成日期天数 -->
                            <div class="star-name-tasks">
                            {{tasks}}-{{daynum}}</div>
                        </div>
                        <!-- 目标编辑按钮 -->
                        <div class="side-tasks-edit" 
                        @click="starEdit(item,index)"
                        ></div>
                        <div class="star-finish-background" :style=getStyle(8,item)></div>
                    </div>
                    <!-- 目标包含任务清单/目标完成详情 -->
                    <ul 
                    :style=getStyle(3,item) 
                    class="star-tasks" 
                    :id=getId(2,index)>
                        <!-- 目标完成详情 -->
                        <div class="star-finish" :style=getStyle(7,item)>
                            目标【{{item.starName}}】已完成！<br>
                            [{{item.startTime.getFullYear()}}.{{item.startTime.getMonth()+1}}.{{item.startTime.getDate()}}-{{item.endTime.getFullYear()}}.{{item.endTime.getMonth()+1}}.{{item.endTime.getDate()}}]
                            <br>
                            该目标下共完成了【{{item.task.length}}】个任务，用时【{{parseInt(Math.abs(item.startTime.getTime()-item.endTime.getTime())/1000/60/60/24)}}】天
                            <!-- 目标描述-装饰 -->
                            <div class="star-finish-description-title" 
                            :style=getStyle(5,item)>
                                <div class="star-finish-description-title-border" 
                                :style=getStyle(4,item)>
                                </div>
                                目标描述
                            </div>
                            <!-- 目标内容描述 -->
                            <textarea 
                            v-model="item.description" 
                            class="star-finish-description">
                            </textarea>
                        </div>
                        <!-- 新建目标任务按钮 -->
                        <div class="star-item-notask" 
                        :style=getStyle(2,item) 
                        @click=newTask(item,index)>新建目标任务~</div>
                        <!-- 目标任务展示，使用task子组件 -->
                        <task 
                        v-for="(item,index) of tasklist" 
                        :item="item" 
                        :index="index" 
                        :showtask="showtask">
                        </task>
                    </ul>
                </div>`,
    components:{ //定义组件的子组件
        "task": taskShow
    },
    methods: {
        getStyle: function(num,item){
            if(num === 1){
                return "border-color:"+item.tasks.color+";";
            }
            else if(num === 2){
                if(item.status){
                    return "display:none;";
                }
                else {
                    return "display:block;";
                }
            }
            else if(num === 3){
                return "height:0px;";
            }
            else if(num === 4){
                return "background:"+item.tasks.color+";";
            }
            else if(num === 5){
                return "color:"+item.tasks.color+";";
            }
            else if(num === 6 && item.status){
                return "border:none;backgroundColor:"+item.tasks.color+";";
            }
            else if(num === 7 && item.status){
                return "display:block;";
            }
            else if(num === 8 && item.status){
                if(item.status){
                    return "display:block;background-color:"+item.tasks.color+";";
                }
                return "background-color:"+item.tasks.color+";";
            }
        },
        //为目标名和目标任务列表动态绑定id
        getId: function(str,index){
            if(str === 0){
                return "starName_"+index
            }
            else if(str === 1){
                return "starNameStyle_"+index
            }
            else if(str === 2){
                return "star_"+index
            }
        },
        // 编辑目标
        starEdit: function(item,index){
            moreWindow.starEditIndex = index;
            moreWindow.starEditValue = item.starName;
            moreWindow.starEditItem = item;
            moreWindow.starNewTasks = item.tasks.name;
            moreWindow.starNewTasksColor = item.tasks.color;
            moreWindow.starNewTimeYear = item.time.getFullYear();
            moreWindow.starNewTimeMonth = item.time.getMonth()+1;
            moreWindow.starNewTimeDate = item.time.getDate();
            moreWindow.starEditSwitch = true;
            moreWindow.show = true;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        },
        //点击目标名
        starSwitch: function(item,index) {
            //收起所有目标列表,同一时刻只能有一个目标列表出现
            for(var i = 0 ; i < index; i++){
                var otherId = "star_"+i;
                var otherStar = document.getElementById(otherId);
                otherStar.style.height = "0px";
            }
            i = index + 1;
            for(; i < pageStar.starList.length; i++){
                var otherId = "star_"+i;
                var otherStar = document.getElementById(otherId);
                otherStar.style.height = "0px";
            }
            // 变更任务列表（完成任务放下面）
            var finish = new Array();
            for(var j = 0; j < item.task.length; j++){
                if(item.task[j].status){
                    finish.push(item.task[j]);
                    item.task.splice(j,1);
                    j = j-1;
                }
            }
            for(var k = 0; k < finish.length; k++){
                item.task.push(finish[k]);
            }
            //然后展开点击清单,再次点击收起
            var id = "star_"+index;
            var star = document.getElementById(id);
            if(item.status){
                var starHeight = "8.6rem";
            }
            else if(item.task.length === 0){
                var starHeight = "2.15rem";
            }
            else {
                var starHeight = 2.15*(item.task.length+1)+"rem";
            }
            if(star.style.height === "0px"){
                star.style.height = starHeight;
            }
            else {
                star.style.height = "0px";
            }
        },
        // 目标已完成
        starFinish: function(item,index){
            // 如果此时目标为完成状态，再次更改为未完成状态
            if(item.status){
                // 改变数据
                item.status = false;
                // 修改次序 删除原本位置，加在列表后面
                pageStar.starList.push(item);
                pageStar.starList.splice(index,1);
                // 添加star选择
                var obj = new Object();
                obj.name = item.starName;
                obj.color = item.tasks.color;
                selectWindow.starList.push(obj);
                // 改变css
                var style = document.getElementById("starNameStyle_"+index);
                var name = document.getElementById("starName_"+index);
                var list = document.getElementById("star_"+index);
                name.lastElementChild.style.display = "none";
                var str = "solid 3px "+ item.tasks.color;
                style.style.border = str;
                style.style.backgroundColor = "transparent";
                list.firstElementChild.style.display = "none";
            }
            else {
                // 给予弹窗数据
                moreWindow.starFinishItem = item;
                moreWindow.starFinishIndex = index;
                // 点击后弹出窗口，确认后再执行
                moreWindow.show = true;
                moreWindow.starFinishSwitch = true;
                //覆盖页 出现弹窗后禁止其他
                var cover = document.getElementById("windowCover");
                cover.style.display = "block";
            }
            event.stopPropagation();//阻止本事件冒泡，如果不加，那么事件会冒泡到父元素上执行它的click事件
            // 保存更新到本地
            localStorage.setItem('starList',JSON.stringify(pageStar.starList));
            localStorage.setItem('selectStarList',JSON.stringify(selectWindow.starList));
        },
        // 跳转新建目标
        newTask: function(item,index){
            pageTask.starIndex = index;
            pageTask.star = item.starName;
            var btn = document.getElementById("iconHfHome");
            btn.click();
            var input = document.getElementById("taskInput");
            input.click();
        }
    }
}
//目标页
var pageStar = new Vue({
    el:"#pageStar",
    data:{
        pageSwitch: false,
        noStar: false,
        finishBtnText: '隐藏',
        //目标
        starList:[]//无默认,但和tasksList结构一样    {starName:'',status:false,tasks:{name: ,color:},time:{Date对象},}
    },
    components: {
        'star-show': starShow
    },
    methods: {
        //新建目标
        newStar: function() {
            selectWindow.newStar();
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        },
        //目标显示
        //获得月份天数
        getMonthNum: function(year,month){
            return new Date(year, month + 1, 0).getDate();
        },
        // 返回目标的额外信息
        getStarMoreInfo: function(str,item) {
            switch(str){
                case 'tasks':
                    return item.tasks.name;
                case 'day':
                    var day = new Date();
                    var today = new Date(day.getFullYear(),day.getMonth(),day.getDate());
                    var num = parseInt(Math.abs(item.time.getTime() - today.getTime()) / 1000 / 60 / 60 /24);//把相差的毫秒数转换为天数
                    
                    if(item.status){
                        return "完成日期:"+item.endTime.getFullYear()+"."+(item.endTime.getMonth()+1)+"."+item.endTime.getDate();
                    }
                    else if(today.getTime() < item.time.getTime()){
                        return "距离到期还有"+num+"天";
                    }
                    else if(num === 0){
                        return "目标已到期";
                    }
                    else {
                        return "目标已过期"+num+"天";
                    }
                case 'year':
                    return item.time.getFullYear();
                case 'month':
                    return item.time.getMonth()+1;
                case 'date':
                    return item.time.getDate();
            }
        },
        // 显示、隐藏已完成目标
        starFinishSwitch: function() {
            if(this.finishBtnText === "隐藏"){
                for(var i = 0; i < this.starList.length; i++){
                    if(this.starList[i].status){
                        document.getElementById("starName_"+i).parentElement.style.display = "none";
                    }
                }
                this.finishBtnText = "显示";
            }
            else {
                for(var i = 0; i < this.starList.length; i++){
                    if(this.starList[i].status){
                        document.getElementById("starName_"+i).parentElement.style.display = "block";
                    }
                }
                this.finishBtnText = "隐藏";
            }
        }
    }
})

// 日历页
//日历组件
// 本月日期对象
var timeItem = {
    props:['item','index'],
    template:`<div class="time-item" :id=getId(index) @click="select(index)" :style = getBorder(index)>
                <!-- 日期是否有清单任务（非收集箱） -->
                <div class="time-item-tasks" :style=getTasks(index)></div>
                {{item}}
                <!-- 日期是否有目标 小三角 -->
                <div class="time-item-star" v-if=getStar(1,index) :style=getStar(2,index)></div>
              </div>`,
    methods: {
        // 是当天的话,就显示选中状态
        getBorder: function(index) {
            // 此时是最后一个日期对象,所有日期对象已经被建立(最后一个没有被建立)
            if(index === (pageTime.timeMonthList.length-1)){
                for(var i = 0; i < (pageTime.timeMonthList.length-1); i++){
                    var id = "time_"+i;
                    var item = document.getElementById(id);
                    item.style.border = "none";
                }
                var id = "time_"+(pageTime.selectDate-1);
                var item = document.getElementById(id);
                item.style.border = "solid 2px #46d367";
            }
        },
        // 获取背景(显示当天清单/目标等)
        getTasks: function(index) {
            var list = [];
            var now = new Date(pageTime.year,pageTime.month,index+1);
            for(var i = 0; i < pageTask.list.length; i++){
                if(pageTask.list[i].time.getTime() === now.getTime()){
                   list.push(pageTask.list[i]);
                }
            }
            // 检测任务清单和列表
            if(list.length === 0){
                return "background:none;";
            }
            // 一个背景颜色收集表 因为同一天可能有多个清单任务 如果是收集箱任务则不计
            var tasksColorList = [];
            for(var j = 0; j < list.length; j++){
                // 检测清单是否是收集箱，是的话不添加背景
                if(list[j].tasks.name !== '收集箱'){
                       tasksColorList.push(list[j].tasks.color);
                }
            }
            if(tasksColorList.length === 0){
                return "background:none;";
            }
            else{
                return "background-color:"+tasksColorList[0]+';';
            }
        },
        getStar: function(str,index) {
            var starColorList = [];
            // 检测有无目标
            for(var i = 0; i < pageStar.starList.length; i++){
                if(pageStar.starList[i].time !== '' &&
                   !pageStar.starList[i].status &&
                   pageStar.starList[i].time.getFullYear() === pageTime.year &&
                   pageStar.starList[i].time.getMonth() === pageTime.month &&
                   pageStar.starList[i].time.getDate() === (index+1)){
                   starColorList.push(pageStar.starList[i].tasks.color);
                }
            }
            if (str === 1){
                if(starColorList.length === 0){
                    return false;
                }
                else{
                    return true;
                }
            }
            else if (str === 2 && starColorList.length !== 0){
                return "border-top-color:"+starColorList[0]+';'+"border-right-color:"+starColorList[0]+';';
            }
        },
        // 获取id
        getId: function(index){
            return "time_"+index;
        },
        // 点击改变当前选中日期
        select: function(index){
            if(index === (pageTime.timeMonthList.length-1)){
                return;
            }
            for(var i = 0; i < pageTime.timeMonthList.length; i++){
                var id = "time_"+i;
                var item = document.getElementById(id);
                item.style.border = "none";
            }
            var id = "time_"+index;
            var item = document.getElementById(id);
            item.style.border = "solid 2px #46d367";
            // item.style.backgroundColor = "rgba(245, 245, 245, 100)";
            pageTime.selectDate = index+1;
            //获得当天任务
            pageTime.dayTask = []; //初始化
            pageTime.dayStar = [];
            pageTime.noTask = true;
            var today = new Date(pageTime.year,pageTime.month,pageTime.selectDate);
            for(var i = 0; i < pageTask.list.length; i++){
                if(pageTask.list[i].time.getTime() === today.getTime()){
                    pageTime.dayTask.push(pageTask.list[i]);
                }
            } 
            if(pageTime.dayTask.length !== 0){
                pageTime.noTask = false;
            }
            //获得当天目标
            for(var i = 0; i < pageStar.starList.length; i++){
                if(pageStar.starList[i].time.getTime() === today.getTime()){
                    pageTime.dayStar.push(pageStar.starList[i]);
                }
            }
        }
    }
}

// 当日目标
var dayStar = {
    props:['item','index'],
    template:`<div 
              @click="timeStarSwitch(item)" 
              class="time-task-item">
                <!-- 装饰 -->
                <div 
                class="time-star-item-style" 
                :style=getStyle(item)></div>
                {{item.starName}}
              </div>`,
    methods: {
        getStyle: function(item){
            return "background:"+item.tasks.color+";";
        },
        timeStarSwitch: function(item){
            // 转到那个目标
            for(var i = 0; i < pageStar.starList.length; i++){
                if(item === pageStar.starList[i]){
                    var index = i;
                    break;
                }
            }
            id = "starName_"+index;
            var obj = document.getElementById(id);
            document.getElementById("iconHfStar").click()
            window.location.hash = id;
            // 模拟点击事件，展开or合上 (等待一秒进行)
            setTimeout(function() {
                obj.click();
            }, 100);
        }
    }
}

//日历
var pageTime = new Vue({
    el:"#pageTime",
    data:{
        pageSwitch: false,
        year:0, // 2020
        month:0,// 0-11
        selectDate:0,//1-31
        monthShow:1,
        timeMonthList:[],//其中是日期的对象,包含{日期:31,星期:0,特殊属性:}
        dayTask:[], //每日任务
        dayStar:[]
    },
    components:{
        'time-item': timeItem,
        'day-task':taskShow,
        'day-star':dayStar
    },
    methods: {
        // 获得要求日期对象 
        getDate: function(str) {
            if(str === "last"){
                this.month = this.month-1;
                var date = new Date(this.year,this.month);//上月
            }
            else if(str === "next"){
                this.month = this.month+1;
                var date = new Date(this.year,this.month);//下月
            }
            else if(str === "now"){
                var today = new Date();
                var date = new Date(today.getFullYear(),today.getMonth(),today.getDate());//获取当前天的date对象
            }
            this.getNowMonth(date);
        },
        //获得月份天数
        getMonthNum: function(year,month){
            return new Date(year, month + 1, 0).getDate();
        },
        //获得日期对象
        getNowMonth: function(today) {
            this.timeMonthList = [];
            this.year = today.getFullYear();
            // 当前月
            this.month = today.getMonth();
            this.monthShow = this.month+1;
            var monthFirst = new Date(this.year,this.month); //当前月的第一天
            var dateNum = this.getMonthNum(this.year,this.month); //当前月的天数 (1-31)
            var monthFirstDay = monthFirst.getDay(); //当前月第一天是星期几 (0-6)[0周日,6周六]
            // 日期的对象 (日期:1-31
            var j = monthFirstDay;
            for(var i = 1 ; i <= dateNum ; i++ ){
                this.timeMonthList.push(i);
            }
            this.timeMonthList.push(''); //最后给日期加一个空值,是为了控制显示'今日选中状态',否则加载每月最后日期的时候,会跳过不去对它的样式进行操控
            // 默认选中今天
            this.selectDate = today.getDate();
            // 根据本月第一天的day,得到第一行的空格数
            var sEmpty = document.getElementById("selectTimeEmpty");
            var empty = document.getElementById("timeShowBlock");
            empty.style.display = "block";
            sEmpty.style.display = "block"
            var num = monthFirstDay*14.28;
            var str = num+"%";
            empty.style.width = str;
            sEmpty.style.width = str;
            //获得当天任务
            this.dayTask = []; //初始化
            this.dayStar = [];
            this.noTask = true;
            for(var i = 0; i < pageTask.list.length; i++){
                if(pageTask.list[i].time.getTime() === today.getTime()){
                    this.dayTask.push(pageTask.list[i]);
                }
            } 
            if(this.dayTask.length !== 0){
                this.noTask = false;
            }
            //获得当天目标
            for(var i = 0; i < pageStar.starList.length; i++){
                if(pageStar.starList[i].time.getTime() === today.getTime() &&
                   !pageStar.starList[i].status){
                    this.dayStar.push(pageStar.starList[i]);
                }
            }
        },
        //转到新建任务界面,日期为当前选中日期
        timeTaskNew: function() {
            pageTask.timeYear = this.year;
            pageTask.timeMonth = this.month;
            pageTask.timeDate = this.selectDate;
            pageTask.time = this.year+'-'+this.monthShow+'-'+this.selectDate;
            var btn = document.getElementById("iconHfHome");
            btn.click();
            var input = document.getElementById("taskInput");
            input.click();
        },
        //转到新建目标界面,日期为当前选中日期
        timeStarNew: function() {
            moreWindow.starNewTimeYear = this.year;
            moreWindow.starNewTimeMonth = this.month+1;
            moreWindow.starNewTimeDate = this.selectDate;
            moreWindow.show = true;
            moreWindow.starNewSwitch = true;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        }
    }
})

// 侧边栏
//侧边页的子组件(清单展示)
var tasksShow = {
    // 父给组件传递了值,此时组件需要接受该值,不可直接使用
    props: ['item','index','tasklist','showtask'],
    // props:本组件接受的外部传来的属性
    template: `<div class="side-box">
                    <!-- 清单名 -->
                    <div 
                    class="side-name" 
                    :style=getStyle(1,item) 
                    :id=getId(1,index) 
                    @click=tasksSwitch(index,item)>
                        <!-- 清单名颜色显示 -->
                        <div class="side-name-style" :style=getStyle(2,item)></div>
                        {{item.tasksName}}
                        <!-- 清单编辑按钮 -->
                        <div class="side-tasks-edit" @click="tasksEdit(item,index)"></div>
                    </div>
                    <!-- 清单下任务 -->
                    <ul :style=getStyle(3,item) 
                    class="side-tasks" 
                    :id=getId(2,index)>
                        <!-- 新建清单任务按钮 -->
                        <div class="side-item" 
                        :style=getStyle(1,item) 
                        @click=newTask(item,index)>新建清单任务~</div>
                        <!-- 清单任务 使用task子组件 -->
                        <task 
                        v-for="(item,index) of tasklist" 
                        :item="item" :index="index" 
                        :showtask="showtask"></task>
                    </ul>
                </div>`,
    components:{ //定义组件的子组件
        "task": taskShow,
    },
    methods:{
        // 获取背景颜色
        getStyle: function(num,item){
            if(num === 1){
                return "border-color:"+item.tasksColor+";";
            }
            else if(num === 2){
                return "background-color:"+item.tasksColor+";";
            }
            else if(num === 3){
               return "height:0px;";
            }
        },
        //为清单名和清单任务列表动态绑定id
        getId: function(num,index){
            if(num === 1){
                return "tasksName_"+index;
            }
            else if(num === 2){
                return "tasks_"+index
            }
        },
        //点击清单名
        tasksSwitch: function(index,item) {
            //收起所有清单列表,同一时刻只能有一个清单列表出现
            for(var i = 0 ; i < index; i++){
                var otherId = "tasks_"+i;
                var otherTasks = document.getElementById(otherId);
                otherTasks.style.height = "0px";
            }
            i = index+1;
            for(; i < pageSide.tasksList.length; i++){
                var otherId = "tasks_"+i;
                var otherTasks = document.getElementById(otherId);
                otherTasks.style.height = "0px";
            }
            // 修改任务列表，完成任务放后面
            var finish = new Array();
            for(var j = 0; j < item.task.length; j++){
                if(item.task[j].status){
                    finish.push(item.task[j]);
                    item.task.splice(j,1);
                    j = j-1;
                }
            }
            for(var k = 0; k < finish.length; k++){
                item.task.push(finish[k]);
            }
            //然后展开点击清单,再次点击收起
            var id = "tasks_"+index;
            var tasks = document.getElementById(id);
            if(item.task.length === 0){
                var tasksHeight = "2.15rem";
            }
            else{
                var tasksHeight = 2.15*(item.task.length+1)+"rem";
            }
            if(tasks.style.height === "0px"){
                tasks.style.height = tasksHeight;
            }
            else {
                tasks.style.height = "0px";
            }
        },
        // 编辑清单 
        tasksEdit: function(item,index) {
            if(item.tasksName === "收集箱"){
                alert("此清单不可编辑!");
            }
            else {
                moreWindow.show = true;
                moreWindow.tasksEditSwitch = true;
                moreWindow.tasksEditColor = item.tasksColor;
                moreWindow.tasksEditValue = item.tasksName;
                moreWindow.tasksEditIndex = index;
                moreWindow.tasksEditItem = item;
                //覆盖页 出现弹窗后禁止其他
                var cover = document.getElementById("windowCover");
                cover.style.display = "block";
            }
        },
        newTask: function(item,index){
            pageTask.tasksIndex = index;
            pageTask.tasks = item.tasksName;
            var main = document.getElementById("main");
            main.click();
            var btn = document.getElementById("iconHfHome");
            btn.click();
            var input = document.getElementById("taskInput");
            input.click();
        }
    }
}

// 侧边栏
var pageSide = new Vue({
    el:"#sideList",
    data: {
        tasksList:[
            {tasksName:'收集箱',tasksColor:'#ddd',task:[]},
        ],//tasks为一个存放对象(任务)的数组 {清单: '',任务:[{},{}]}  不可做临时数组,否则v-for vue会报错(可能无限次渲染) [收集箱自动在里面]
    },
    //组件
    components: {
    	'tasks-show': tasksShow
    },
    methods:{
        newTasks: function(){
            selectWindow.newTasks();
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "block";
        }
    }
})

// 居中窗口组件
var totalItem = {
    props:['item','index'],
    template:`<div class="total-num-item">
                    <!-- 清单名 -->
                    <div>{{item.tasks}}</div>
                    <!-- 清单完成任务比例条状显示 -->
                    <div class="total-num-item-1" :style=getStyle(item)></div>
                    <!-- 清单完成任务数 -->
                    <span>完成{{item.num}}个任务</span>
               </div>`,
    methods:{
        getStyle: function(item){
            return "width:"+item.width+";background:"+item.color+";";
        }
    }
}
// 居中窗口
var totalWindow = new Vue({
    el:"#totalWindow",
    data: {
        show: false,
        // 展示
        title:'今日',
        // 数据
        nowPage:'day', //当前处于 日周月年
        nowPeriod:'', //当前日期(周月年第一天)
        noTask:true,
        percentage:"0%",
        turnStyle:"transform:rotate(180deg);background:#eee;",
        totalNum:0,
        numList:[
            // {item:清单名,color:#000,width:"",num:完成任务数}  用于组件
        ],
        // 用于左右按钮辨认是否今日.是日期对象，第一天
        todayDate:'',
        todayDay:'',
        todayMonth:'',
        todayYear:''
    },
    components:{
        "total-num-item":totalItem
    },
    methods:{
        btnClose: function(){
            this.show = false;
            //覆盖页 出现弹窗后禁止其他
            var cover = document.getElementById("windowCover");
            cover.style.display = "none";
        },
        // 选择日周月年
        selectPeriod: function(str){
            this.nowPage = str;
            switch(str){
                case "day":
                    var date = this.todayDate;
                    this.title = "今日";
                    break;
                case "week":
                    var date = this.todayDay;
                    this.title = "本周";
                    break;
                case "month":
                    var date = this.todayMonth;
                    this.title = "本月";
                    break;
                case "year":
                    var date = this.todayYear;
                    this.title = "今年";
                    break;
            }
            this.nowPeriod = date;
            this.noTask = true;
            this.percentage = "0%";
            this.turnStyle = "transform:rotate(180deg);background:#eee;";
            this.totalNum = 0;
            this.numList = [];
            this.getDate(str,date);
        },
        // 左右按钮
        lastBtn: function(){
            switch(this.nowPage){
                case "day":
                    var date = new Date(this.nowPeriod.getFullYear(),this.nowPeriod.getMonth(),this.nowPeriod.getDate()-1);
                    if(date.getTime() === this.todayDate.getTime()){
                        this.title = "今日";
                    }
                    else{
                        this.title = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
                    }
                    break;
                case "week":
                    var date = new Date(this.nowPeriod.getFullYear(),this.nowPeriod.getMonth(),this.nowPeriod.getDate()-7);
                    if(date.getTime() === this.todayDay.getTime()){
                        this.title = "本周";
                    }
                    else{
                        var dateEnd = new Date(date.getFullYear(),date.getMonth(),date.getDate()+6);
                        this.title = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+'-'+dateEnd.getFullYear()+'.'+(dateEnd.getMonth()+1)+'.'+dateEnd.getDate();
                    }
                    break;
                case "month":
                    var date = new Date(this.nowPeriod.getFullYear(),this.nowPeriod.getMonth()-1,this.nowPeriod.getDate());
                    if(date.getTime() === this.todayMonth.getTime()){
                        this.title = "本月";
                    }
                    else{
                        this.title = date.getFullYear()+"."+(date.getMonth()+1);
                    }
                    break;
                case "year":
                    var date = new Date(this.nowPeriod.getFullYear()-1,this.nowPeriod.getMonth(),this.nowPeriod.getDate());
                    if(date.getTime() === this.todayYear.getTime()){
                        this.title = "今年";
                    }
                    else{
                        this.title = date.getFullYear()+' 年';
                    }
                    break;
            }
            this.nowPeriod = date;
            this.noTask = true;
            this.percentage = "0%";
            this.turnStyle = "transform:rotate(180deg);background:#eee;";
            this.totalNum = 0;
            this.numList = [];
            this.getDate(this.nowPage,date);
        },
        nextBtn: function(){
            if(this.nowPeriod.getTime() === this.todayDate.getTime() ||
               this.nowPeriod.getTime() === this.todayDay.getTime() ||
               this.nowPeriod.getTime() === this.todayMonth.getTime() ||
               this.nowPeriod.getTime() === this.todayYear.getTime()){
                return; //无反应，不可查看未来
            }
            switch(this.nowPage){
                case "day":
                    var date = new Date(this.nowPeriod.getFullYear(),this.nowPeriod.getMonth(),this.nowPeriod.getDate()+1);
                    if(date.getTime() === this.todayDate.getTime()){
                        this.title = "今日";
                    }
                    else{
                        this.title = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
                    }
                    break;
                case "week":
                    var date = new Date(this.nowPeriod.getFullYear(),this.nowPeriod.getMonth(),this.nowPeriod.getDate()+7);
                    if(date.getTime() === this.todayDay.getTime()){
                        this.title = "本周";
                    }
                    else{
                        var dateEnd = new Date(date.getFullYear(),date.getMonth(),date.getDate()+6);
                        this.title = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+'-'+dateEnd.getFullYear()+'.'+(dateEnd.getMonth()+1)+'.'+dateEnd.getDate();
                    }
                    break;
                case "month":
                    var date = new Date(this.nowPeriod.getFullYear(),this.nowPeriod.getMonth()+1,this.nowPeriod.getDate());
                    if(date.getTime() === this.todayMonth.getTime()){
                        this.title = "本月";
                    }
                    else{
                        this.title = date.getFullYear()+"."+(date.getMonth()+1);
                    }
                    break;
                case "year":
                    var date = new Date(this.nowPeriod.getFullYear()+1,this.nowPeriod.getMonth(),this.nowPeriod.getDate());
                    if(date.getTime() === this.todayYear.getTime()){
                        this.title = "今年";
                    }
                    else{
                        this.title = date.getFullYear()+' 年';
                    }
                    break;
            }
            this.nowPeriod = date;
            this.noTask = true;
            this.percentage = "0%";
            this.turnStyle = "transform:rotate(180deg);background:#eee;";
            this.totalNum = 0;
            this.numList = [];
            this.getDate(this.nowPage,date);
        },
        getDate: function(str,date){
            // date:根据传入的数值来进行数据操作
            this.numList = [];
            this.nowPeriod = date; 
            var num = 0;
            switch(str){
                case "day":
                    // 计算完成率相关数据
                    for(var i = 0; i < pageTask.list.length; i++){
                        if(pageTask.list[i].time.getTime() === date.getTime()){
                            num++;
                            if(pageTask.list[i].status){
                                this.totalNum++;
                            }
                        }
                    }
                    if(this.totalNum !== 0){
                        this.noTask = false;
                    }
                    // 计算列表值
                    if(!this.noTask){
                        for(var m = 0; m < pageSide.tasksList.length; m++){
                            if(pageSide.tasksList[m].task.length !== 0){
                                var obj = new Object();
                                obj.num = 0;
                                for(var n = 0; n < pageSide.tasksList[m].task.length; n++){
                                    if(pageSide.tasksList[m].task[n].time.getTime() === date.getTime() &&
                                       pageSide.tasksList[m].task[n].status){
                                        obj.num ++;
                                    }
                                }
                                if(obj.num !== 0){
                                    obj.tasks = pageSide.tasksList[m].tasksName;
                                    obj.color = pageSide.tasksList[m].tasksColor;
                                    var w = parseInt((obj.num/this.totalNum)*60);
                                    obj.width = w+"%";
                                    this.numList.push(obj);
                                }
                            }
                        }
                    }
                    break;
                case "week":
                    // 计算完成率相关数据
                    // 首先找到该日期是周几，然后获得周并将它放入一个数组中
                    var dayDateList = new Array();
                    var day = date.getDay(); //0-6 [0周日,6周六]
                    var dayDate = date.getDate();
                    for(var m = 0; m < day; m++){
                        var objDay = new Date(date.getFullYear(),date.getMonth(),dayDate-1)
                        dayDateList.push(objDay);
                        dayDate = dayDate-1;
                    }
                    m = day+1;
                    dayDate = date.getDate();
                    dayDateList.push(date);
                    for(; m < 7; m++){
                        var objDay = new Date(date.getFullYear(),date.getMonth(),dayDate+1)
                        dayDateList.push(objDay);
                        dayDate = dayDate+1;
                    }
                    for(var k = 0; k < dayDateList.length; k++){
                        for(var i = 0; i < pageTask.list.length; i++){
                            if(pageTask.list[i].time.getTime() === dayDateList[k].getTime()){
                                num++;
                                if(pageTask.list[i].status){
                                    this.totalNum++;
                                }
                            }
                        }
                    }
                    if(this.totalNum !== 0){
                        this.noTask = false;
                    }
                    // 计算列表值
                    if(!this.noTask){
                        for(var k = 0; k < dayDateList.length; k++){
                            for(var m = 0; m < pageSide.tasksList.length; m++){
                                if(pageSide.tasksList[m].task.length !== 0){
                                    var obj = new Object();
                                    obj.num = 0;
                                    for(var n = 0; n < pageSide.tasksList[m].task.length; n++){
                                        if(pageSide.tasksList[m].task[n].time.getTime() === dayDateList[k].getTime() &&
                                           pageSide.tasksList[m].task[n].status){
                                            obj.num ++;
                                        }
                                    }
                                    if(obj.num !== 0){
                                        obj.tasks = pageSide.tasksList[m].tasksName;
                                        obj.color = pageSide.tasksList[m].tasksColor;
                                        var w = parseInt((obj.num/this.totalNum)*60);
                                        obj.width = w+"%";
                                        this.numList.push(obj);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "month":
                    // 计算完成率相关数据
                    for(var i = 0; i < pageTask.list.length; i++){
                        if(pageTask.list[i].time.getFullYear() === date.getFullYear() &&
                           pageTask.list[i].time.getMonth() === date.getMonth()){
                            num++;
                            if(pageTask.list[i].status){
                                this.totalNum++;
                            }
                        }
                    }
                    if(this.totalNum !== 0){
                        this.noTask = false;
                    }
                    // 计算列表值
                    if(!this.noTask){
                        for(var m = 0; m < pageSide.tasksList.length; m++){
                            if(pageSide.tasksList[m].task.length !== 0){
                                var obj = new Object();
                                obj.num = 0;
                                for(var n = 0; n < pageSide.tasksList[m].task.length; n++){
                                    if(pageSide.tasksList[m].task[n].time.getFullYear() === date.getFullYear() &&
                                       pageSide.tasksList[m].task[n].time.getMonth() === date.getMonth() &&
                                       pageSide.tasksList[m].task[n].status){
                                        obj.num ++;
                                    }
                                }
                                if(obj.num !== 0){
                                    obj.tasks = pageSide.tasksList[m].tasksName;
                                    obj.color = pageSide.tasksList[m].tasksColor;
                                    var w = parseInt((obj.num/this.totalNum)*60);
                                    obj.width = w+"%";
                                    this.numList.push(obj);
                                }
                            }
                        }
                    }
                    break;
                case "year":
                    // 计算完成率相关数据
                    for(var i = 0; i < pageTask.list.length; i++){
                        if(pageTask.list[i].time.getFullYear() === date.getFullYear()){
                            num++;
                            if(pageTask.list[i].status){
                                this.totalNum++;
                            }
                        }
                    }
                    if(this.totalNum !== 0){
                        this.noTask = false;
                    }
                    // 计算列表值
                    if(!this.noTask){
                        for(var m = 0; m < pageSide.tasksList.length; m++){
                            if(pageSide.tasksList[m].task.length !== 0){
                                var obj = new Object();
                                obj.num = 0;
                                for(var n = 0; n < pageSide.tasksList[m].task.length; n++){
                                    if(pageSide.tasksList[m].task[n].time.getFullYear() === date.getFullYear() &&
                                       pageSide.tasksList[m].task[n].status){
                                        obj.num ++;
                                    }
                                }
                                if(obj.num !== 0){
                                    obj.tasks = pageSide.tasksList[m].tasksName;
                                    obj.color = pageSide.tasksList[m].tasksColor;
                                    var w = parseInt((obj.num/this.totalNum)*60);
                                    obj.width = w+"%";
                                    this.numList.push(obj);
                                }
                            }
                        }
                    }
                    break;
            }
            // 完成率操作
            var per = 0;
            if(this.totalNum !== 0){
                this.noTask = false;
                per = parseInt((this.totalNum/num)*100);
                this.percentage = per+"%";
            }
            // 计算旋转率（1%=3.6deg）(90% 就是1-90%=10%，那么就旋转36deg（有颜色）如果40%（小于50%）那么就旋转36deg（白色）)
            var percentTurn = document.getElementById("totalPercentTurn");
            if(per >= 50){
                var perLack = (100-per)*3.6;
                this.turnStyle = "transform:rotate("+perLack+"deg);background:#367e31;";
            }
            else{
                var perLack = (50-per)*3.6;
                this.turnStyle = "transform:rotate("+perLack+"deg);background:#eee;";
            }
        }
    }
})



//首栏点击按钮事件
var hiconClick = function(btn){
    var id = btn.id;
    var icon = document.getElementById(id); //这个方法是document对象的，不是全局方法
    var iconParent = icon.parentElement;
    //分成两部分处理
    if(icon === iconParent.firstElementChild){
        //列表按钮
        //效果：侧边栏动画进出（判断当前情况来做出进or出的效果）
        var side = document.getElementById("sideList");
        var main = document.getElementById("main"); 
        side.style.left = "0px";
        main.style.left = "70%"
    }
    else if(icon === iconParent.lastElementChild){
        //添加按钮
        //效果: 出现居中小窗口
        totalWindow.show = true;
        // 添加数据
        var today = new Date();
        var date = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        totalWindow.nowPeriod = date;
        // 获取 今日/本周第一天/本月第一天/本年第一天
        totalWindow.todayDate = date;
        var day = date.getDay(); //0-6 [0周日,6周六]
        var dayDate = date.getDate();
        for(var m = 0; m < day; m++){
            dayDate = dayDate-1; 
        }
        totalWindow.todayDay  = new Date(today.getFullYear(),today.getMonth(),dayDate);
        totalWindow.todayMonth = new Date(today.getFullYear(),today.getMonth());
        totalWindow.todayYear = new Date(today.getFullYear(),0,1);
        var num = 0;
        for(var i = 0; i < pageTask.list.length; i++){
            if(pageTask.list[i].time.getTime() === date.getTime()){
                num++;
                if(pageTask.list[i].status){
                    totalWindow.totalNum++;
                }
            }
        }
        var per = 0;
        if(totalWindow.totalNum !== 0){
            totalWindow.noTask = false;
            per = parseInt((totalWindow.totalNum/num)*100);
            totalWindow.percentage = per+"%";
        }
        // 计算旋转率（1%=3.6deg）(90% 就是1-90%=10%，那么就旋转36deg（有颜色）如果40%（小于50%）那么就旋转36deg（白色）)
        var percentTurn = document.getElementById("totalPercentTurn");
        if(per >= 50){
            var perLack = (100-per)*3.6;
            totalWindow.turnStyle = "transform:rotate("+perLack+"deg);background:#367e31;";
        }
        else{
            var perLack = (50-per)*3.6;
            totalWindow.turnStyle = "transform:rotate("+perLack+"deg);background:#eee;";
        }
        // 计算列表值 
        totalWindow.numList = [];
        if(!totalWindow.noTask){
            for(var m = 0; m < pageSide.tasksList.length; m++){
                if(pageSide.tasksList[m].task.length !== 0){
                    var obj = new Object();
                    obj.num = 0;
                    for(var n = 0; n < pageSide.tasksList[m].task.length; n++){
                        if(pageSide.tasksList[m].task[n].time.getTime() === date.getTime() &&
                           pageSide.tasksList[m].task[n].status){
                            obj.num ++;
                        }
                    }
                    if(obj.num !== 0){
                        obj.tasks = pageSide.tasksList[m].tasksName;
                        obj.color = pageSide.tasksList[m].tasksColor;
                        var w = parseInt((obj.num/this.totalNum)*60);
                        obj.width = w+"%";
                        totalWindow.numList.push(obj);
                    }
                }
            }
        }
        //覆盖页 出现弹窗后禁止其他
        var cover = document.getElementById("windowCover");
        cover.style.display = "block";
    }
}
//底栏点击按钮事件(切换页面)
var ficonClick = function(btn){
    var id = btn.id;
    var icon = document.getElementById(id); //这个方法是document对象的，不是全局方法
    var iconParent = icon.parentElement;
    var child = iconParent.firstElementChild;
    for(var i = 0 ; i < 3; i++ ){
        child.classList.remove("hf-after");
        child.classList.add("hf-img");
        child = child.nextElementSibling; 
        //这个循环中，将所有footer按钮的类
        //转为hf-img，移除hf-after，三个图标变为灰白色
    }
    icon.classList.remove("hf-img"); 
    icon.classList.add("hf-after");
    //将点击按钮转为hf-after，粉红色
    
    //转换页面（通过v-if的值设置）
    if(icon === iconParent.firstElementChild){
        pageStar.pageSwitch = true;
        pageTask.pageSwitch = false;
        pageTime.pageSwitch = false;
        // 目标页
        if(pageStar.starList.length === 0){
            pageStar.noStar = true;
        }
    }
    else if(icon === iconParent.lastElementChild){
        pageTime.pageSwitch = true;
        pageTask.pageSwitch = false;
        pageStar.pageSwitch = false;
        //时间页 当点击时间页的时候,调用函数获得当月对象
        pageTime.getDate("now");
    }
    else{
        pageTask.pageSwitch = true;
        pageTime.pageSwitch = false;
        pageStar.pageSwitch = false;
        //任务页
    }
}


// 当侧边栏出现主页面被点击时，侧边栏回缩  使用DOM2级事件，目的是在捕获阶段就进行而不是等待冒泡，如果使用冒泡，那就是
// 点击侧边栏出现按钮更改数据之后，冒泡上来，这个点击事件得到的数据已经被更改，于是它又改回来，就无法达到效果（）
var main = document.getElementById("main"); 
main.addEventListener("click",function(){
    var side = document.getElementById("sideList");
    if(main.style.left !== "0px"){
        side.style.left = "-70%";
        main.style.left = "0px";
    }
},true);

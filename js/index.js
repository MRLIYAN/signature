var sigImg = [];//存放签名的图片
var activeIndex = 0;//姓名点击的dom索引
var $sig = $("#signature");
$(function(){
    //初始化签名
    $sig.jSignature({
        width: '100%',
        height: '100%',
        cssclass: 'zx11',
        signatureLine: false,//去除默认画布上那条横线
        lineWidth: '3'
    })

    init();
    

})

//初始化数据
function init(){
    // $.ajax({
    //    url:'',
    //    type: 'post',
    //    dataType: 'json',
    //    data: {},
    //    success: function (res) {
          
    //    }
    // });

    var html = '';
    for (var i = 0; i < 3; i++) {
        html += '<span class="img-block">'
                    +'<span class="img-ctain">'
                        +'<img src="" alt="">'
                    +'</span>'
                    +'<span class="close" onclick="deleteImg('+i+')">×</span>'
                +'</span>';
        let obj = {
            url:'',
            valid:false,
        }
        sigImg.push(obj);
    }
    $("#name").html(html);
    $(".name-ctain .img-block").eq(0).addClass('active');
    $(".name-ctain .img-block").click(function(){
        let index = $(this).index();
        activeIndex = index;
        $(this).addClass('active').siblings().removeClass('active');
    })
}

//清空签名
function sigClear(){
    $sig.jSignature("reset");
}

//确定签名
function sigOk(){
    var isEmpty = $("#signature").jSignature('getData', 'native');//判断画板是否签名
    if(isEmpty.length == 0){//没签名，直接点了确定，啥也不操作。
        return false;
    }
    if(sigImg[activeIndex].valid){
       alert('请先删除签名再签字');
       return false; 
    }

    var datapair = $sig.jSignature("getData", "svgbase64");
    let url = "data:" + datapair[0] + "," + datapair[1];
    $(".name-ctain .img-block").eq(activeIndex).find("img").attr("src",url)
    $(".name-ctain .img-block").eq(activeIndex).find('.close').show();
    sigImg[activeIndex].url = datapair[1];
    sigImg[activeIndex].valid = true;
    $sig.jSignature('reset');

    //签字完自动对焦下一个
    if(activeIndex<sigImg.length-1 && !sigImg[activeIndex+1].valid){
        activeIndex = activeIndex+1;
        $(".name-ctain .img-block").eq(activeIndex).addClass('active').siblings().removeClass('active');
    } 
}

//删除图片
function deleteImg(index){
    activeIndex = parseInt(index);
    sigImg[activeIndex].url = '';
    sigImg[activeIndex].valid = false;
    $(".name-ctain .img-block").eq(activeIndex).find("img").attr("src","");
    $(".name-ctain .img-block").eq(activeIndex).find('.close').hide();
}

function goSubmit(){
    for (var i = 0; i < sigImg.length; i++) {
        if(!sigImg[i].valid){
            alert("请完成签名");
            return false;
        }
        
    }
    localStorage.setItem('sigInfo',JSON.stringify(sigImg))
    window.location.href = './infoCheck.html';
}
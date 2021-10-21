var sigImg = [];//存放签名的图片
var activeIndex = 0;//姓名点击的dom索引
var sigDisabled = false;//签写验证是否禁用
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

    let username = '啊啊啊';
    let userArr = username.trim().split('');
    var html = '';
    for (var i = 0; i < userArr.length; i++) {
        html += '<span class="img-block">'
                    +'<span class="img-ctain">'
                        +'<span class="img-font">'+userArr[i]+'</span>'
                        +'<img src="" alt="">'
                    +'</span>'
                    // +'<span class="close" onclick="deleteImg('+i+')">×</span>'
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
        if(sigImg[index].valid){//只有签写了才去提示删除
            deleteImg(index);
        }
    })
}

//清空签名
function sigClear(){
    $sig.jSignature("reset");
}

//确定签名
function sigOk(){
    if(sigDisabled){
        return false;
    }
    var isEmpty = $("#signature").jSignature('getData', 'native');//判断画板是否签名
    if(isEmpty.length == 0){//没签名，直接点了确定，啥也不操作。
        $(document).dialog({
            content: '请进行签写',
        });
        return false;
    }

    var datapair = $sig.jSignature("getData", "svgbase64");
    let url = "data:" + datapair[0] + "," + datapair[1];
    $(".name-ctain .img-block").eq(activeIndex).find("img").show().attr("src",url)
    $(".name-ctain .img-block").eq(activeIndex).find(".img-font").hide();
    // $(".name-ctain .img-block").eq(activeIndex).find('.close').show();
    sigImg[activeIndex].url = datapair[1];
    sigImg[activeIndex].valid = true;
    $sig.jSignature('reset');

    //签字完自动对焦下一个
    nameFocus();
}

//删除图片
function deleteImg(index){
    $(document).dialog({
        type: 'confirm',
        content: '确认重新签写该文字吗',
        onClickConfirmBtn: function(){
            sigDisabled = false;//按钮禁用解除
            $(".sigbtn-ok").removeClass('btnDisabled');//按钮颜色置灰解除

            activeIndex = parseInt(index);
            sigImg[activeIndex].url = '';
            sigImg[activeIndex].valid = false;
            $(".name-ctain .img-block").eq(activeIndex).find("img").hide().attr("src","");
            $(".name-ctain .img-block").eq(activeIndex).find(".img-font").show();
            // $(".name-ctain .img-block").eq(activeIndex).find('.close').hide();
        },
        onClickCancelBtn : function(){
            //判断是否都签写，没有签写，聚焦到没钱写的字，否则全部失去焦点。
            nameFocus();
        },
    });
}

function goSubmit(){
    for (var i = 0; i < sigImg.length; i++) {
        if(!sigImg[i].valid){
            $(document).dialog({
                content: '请签写完整签名',
            });
            return false;
        }        
    }
    localStorage.setItem('sigInfo',JSON.stringify(sigImg))
    window.location.href = './infoCheck.html';
}

//焦点自动对焦
function nameFocus(){
    var isValid = true;
    for (var i = 0; i < sigImg.length; i++) {
        if(!sigImg[i].valid){
            activeIndex = i;
            isValid = false;
            break;
        }        
    }
    if(!isValid){
        sigDisabled = false;//按钮禁用解除
        $(".sigbtn-ok").removeClass('btnDisabled');//按钮颜色置灰解除
        $(".name-ctain .img-block").eq(activeIndex).addClass('active').siblings().removeClass('active');
    }else{
        activeIndex = '';
        sigDisabled = true;//签写验证禁用
        $(".sigbtn-ok").addClass('btnDisabled');//按钮置灰，禁用状态
        $(".name-ctain .img-block").removeClass('active');
    }
}

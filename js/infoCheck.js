var sigImg = [];

$(function(){
    sigImg = JSON.parse(localStorage.getItem('sigInfo'));
    console.log(sigImg);
    var html = '';
    for (var i = 0; i < sigImg.length; i++) {
        html += '<span class="img-block">'
                    +'<span class="img-ctain">'
                        +'<img src="data:image/svg+xml;base64,'+sigImg[i].url+'" alt="">'
                    +'</span>'
                +'</span>';
    }
    $("#name").html(html);
})


function goSubmit(){
    var dom = document.getElementById('name');
    html2canvas(dom).then(function(canvas) {
        //将canvas转换为base64图片
        var imgUrl = canvas.toDataURL('image/png');
        $("#imgres").hide();//先隐藏，再显示
        $("#imgres").attr("src",imgUrl);
        setTimeout(() => {
            var url = removeImgBg(document.getElementById('imgres'));
            $("#imgres").hide();//先隐藏，再显示，否则多次点击提交截图会出问题，可以去除查看
            $("#imgres").show();
            console.log(url);
            //localStorage.removeItem('sigInfo')
        }, 200);
    });

    
}


/**
 * 清除图片的背景色，为背景透明的图片
 * @param {*} img 一个dom对象，如果是jquery，jquery对象要转换为dom对象 
 *                  document.getElementById('img') / $("#img")[0]
 *                  img的src可以为base64格式，其他格式没试
 * 注意：调用次方法时，推荐添加一个延时器，canvas没加载完，
 *       调用会导致getImageData报错，出现背景透明转换失败。
 */
function removeImgBg(img) {
    
    //背景颜色  白色
    var rgba = [255, 255, 255, 255];
    // 容差大小，值越大，锯齿感越小，但是过大也会导致截图过于细致导致丢失，自己看效果调整
    var tolerance = 120;

    var imgData = null;
    var [r0, g0, b0, a0] = rgba;
    var r, g, b, a;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var w = img.width;
    var h = img.height;


    canvas.width = w;
    canvas.height = h;
    context.drawImage(img, 0, 0);
    imgData = context.getImageData(0, 0, w, h);

    for (let i = 0; i < imgData.data.length; i += 4) {
        r = imgData.data[i];
        g = imgData.data[i + 1];
        b = imgData.data[i + 2];
        a = imgData.data[i + 3];
        var t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
        if (t <= tolerance) {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 0;
        }
    }
    context.putImageData(imgData, 0, 0);
    var newBase64 = canvas.toDataURL('image/png',1);
    img.src = newBase64;
    return newBase64;
}

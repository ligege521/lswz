/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import '../less/index.less';

/** The animate() method */
import './util/fx';
/** Animated show, hide, toggle, and fade*() methods. */
import './util/fx_methods';
import '../js/lib/mmd-plugin.min.1.0.2';
import '../js/lib/mmd.videoplayer.min.1.0.1';

// 引入的包根据实际情况而定
import IndexViewController from './app/ViewController/IndexViewController';

// 页面级对象池
var pagePool = {
    indexView: null
};

var init = function () {
    // load页面
    var indexPageBack = function () {
        pagePool.indexView = pagePool.indexView || new IndexViewController();
    };
    indexPageBack();
};
init();
// 当前助力值替换图片
function foramtTelNum (num) {
    var content = '';
    var str = num.toString();
    for (var i = 0; i < str.length; i++) {
        str.substring(i, i + 1);
        let index = str[i] * 1;
        let imgSrc = `https://game.gtimg.cn/images/slg/act/4876/a20210119msu/${index}.png`;
        content += `<img src='${imgSrc}' class="value-img" alt="${index}"/>`;
    }
    return content;
};
window.replaceImg = function (number, el) {
    const MyValue = $(el);
    let imgTarget = foramtTelNum(number);
    MyValue.empty();
    MyValue.append(imgTarget);
};
// 设置任务进度百分比
window.setProgress = function (maxNum = 10000, myValue) {
    let val = myValue; // 现用积分值
    let per = 0;
    let progressWidth = 0;
    let diff = 0;
    // let coundWidth = 284; // 总长度
    window.replaceImg(val, '.my-value');
    if (val >= 0 && val < 2000) {
        per = percentage(val, 2000);
        console.log(per);
        progressWidth = per / 100 * 35;
        diff = 2000 - val;
    }
    if (val >= 2000 && val < 8888) {
        per = percentage(val - 2000, 8888 - 2000);
        progressWidth = per / 100 * 115 + 35;
        diff = 8888 - val;
        $('.prize').eq(0).addClass('prize-qualified');
        $('.point-img').eq(0).addClass('point-2000-act');
    }
    if (val >= 8888 && val <= 10000) {
        per = percentage(val - 8888, 10000 - 8888);
        progressWidth = per / 100 * 115 + 110 + 35;
        diff = 10000 - val;
        $('.prize').eq(1).addClass('prize-qualified');
        $('.point-img').eq(0).addClass('point-2000-act');
        $('.point-img').eq(1).addClass('point-8888-act');
    }
    if (val >= 10000) {
        progressWidth = 284;
        $('.prize').eq(2).addClass('prize-qualified');
        $('.point-img').eq(0).addClass('point-2000-act');
        $('.point-img').eq(1).addClass('point-8888-act');
        $('.point-img').eq(2).addClass('point-10000-act');
    }
    $('.progress-value').css({
        width: `${progressWidth}px`
    });
    $('.diff-value').text(diff);
};
// 数字百分比
function percentage (num, total) {
    if (num === 0 || total === 0) {
        return 0;
    }
    return (Math.round(num / total * 10000) / 100.00);
};
window.panel = new PanelLotery({
    length: 5, // 奖品数量
    duration: 5000, // 动画时间
    el: '#ltpanel' // 旋转元素
});

/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import '../less/style.less';

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
        var indexView = pagePool.indexView;
        indexView.load();
    };
    indexPageBack();

    // 测试时
};

init();

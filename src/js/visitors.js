import '../js/lib/mmd-plugin.min.1.0.2';
import '../js/lib/mmd.videoplayer.min.1.0.1';

// 引入的包根据实际情况而定
import VisitorsViewController from './app/ViewController/VisitorsViewController';

// 页面级对象池
var pagePool = {
    visitorsView: null
};

var init = function () {
    // index页面
    var visitorsPageBack = function () {
        pagePool.visitorsView = pagePool.visitorsView || new VisitorsViewController();
        var visitorsView = pagePool.visitorsView;
        // visitorsView.show();
        visitorsView.load();
    };

    visitorsPageBack();
};

init();

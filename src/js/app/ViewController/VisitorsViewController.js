import TD from '../module/TD.js';
import Config from '../Config.js';

// 项目初始化的一些函数
var initProject = function () {
    // 自动添加cnzz统计代码
    var cnzzID = Config.defShare.cnzz;
    cnzzID && document.write(unescape('%3Cspan style="display: none" id="cnzz_stat_icon_' + cnzzID + '"%3E%3C/span%3E%3Cscript src="' + 'https://s4.cnzz.com/z_stat.php%3Fid%3D' + cnzzID + '" type="text/javascript"%3E%3C/script%3E'));

    // 初始化微信接口
    Config.defShare.appid && TD.initWxApi(Config.defShare);

    // 阻止微信下拉；原生js绑定覆盖zepto的默认绑定
    // document.body.addEventListener('touchmove', function (e) {
    //     e.preventDefault();
    // }, {passive: false});

    document.body.addEventListener('touchmove', function (e) {
        const event = e || window.event;
        const className = event.target.getAttribute('class');
        if (/permit-scroll/.test(className) === false) {
            event.preventDefault();
        }
    }, { passive: false });
    /** 解决ios12微信input软键盘收回时页面不回弹，兼容动态添加dom(腾讯登录组件)的情况 */
    var resetScroll = (function () {
        var timeWindow = 500;
        var timeout; // time in ms
        var functionName = function (args) {
            let inputEl = $('input, select, textarea');
            // TODO: 连续添加元素时，可能存在重复绑定事件的情况
            inputEl && inputEl.on('blur', () => {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight, 0));
            });
        };

        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                functionName.apply();
            }, timeWindow);
        };
    }());
    TD.browser.versions.ios && $('body').on('DOMSubtreeModified', resetScroll);

    // debug工具
    if (TD.util.getQuery('vconsole')) {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
        script.onload = () => {
            new VConsole(); // eslint-disable-line
            console.log('Hello world');
        };
        script.src = require('../../lib/vconsole.min.js');
    }
};

// 当前助力值替换图片
function foramtTelNum (num) {
    var content = '';
    var str = num.toString();
    for (var i = 0; i < str.length; i++) {
        str.substring(i, i + 1);
        let index = str[i] * 1;
        let imgSrc = require(`../../../img/num/${index}.png`);
        content += `<img src='${imgSrc}' class="value-img" alt="${index}"/>`;
    }
    return content;
};
function replace (number, el) {
    const MyValue = $(el);
    let imgTarget = foramtTelNum(number);
    MyValue.empty();
    MyValue.append(imgTarget);
};
// 加载页对象
var VisitorsViewController = function () {
    PTTSendClick('page-visitors', 'load-start', '开始加载');
    // 公共变量
    var _that = this;

    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-visitors');
    _private.isInit = false;

    // index
    const frameWrap = $('.m-frame'); // 弹框蒙层
    // frame
    const succeedFrame = $('.succeed-wrap');
    const relusButton = $('.btn-relus'); // 规则按钮
    const hidFrame = $('.btn-hide-frame');
    // visitors
    const helpFriendBtn = $('.help_friend-btn');
    const invitationBtn = $('.invitation-btn');
    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        initProject();
        // 页面加载完成
        _private.gload = new Config.Preload(Config.pageImgs);
        _private.gload.onload = function () {
            PTTSendClick('page-visitors', 'load-end', '加载结束');
            _that.show();
            $('.friend-list').show();
            _private.isTapStart = false;
        };

        _private.variablePageController = function () {
            replace(8888, '.friend-value');
            relusButton.click((event) => {
                console.log(frameWrap);
                PTTSendClick('btn', 'show-relus', '显示规则弹框');
                frameWrap.show();
                $('.relus-wrap').show();
            });
            helpFriendBtn.click(() => {
                PTTSendClick('btn', 'help-friend-btn', '为好友助力');
                frameWrap.show();
                succeedFrame.show();
            });
            invitationBtn.click(() => {
                PTTSendClick('btn', 'invitation-btn', '邀请助力');
                window.location.href = 'index.html';
            });
            // 统一使用隐藏函数
            hidFrame.on('click', (event) => {
                PTTSendClick('btn', `hide-frame`, '隐藏弹框');
                frameWrap.hide();
                $(event.srcElement).parent().hide();
            });
        };
        _private.variablePageController();
        _private.isInit = true;
    };

    // 显示
    _that.show = function () {
        _private.pageEl.show();
    };

    // 隐藏
    _that.hide = function () {
        _that.onhide && _that.onhide();
        _private.pageEl.hide();
    };

    // 执行加载
    _that.load = function () {
        _private.gload.load();
    };

    _private.init();
};

module.exports = VisitorsViewController;

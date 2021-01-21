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
function initVideo () {
    var videoPlayer = new MMD.VideoPlayer(
        {
            videoElement: document.getElementById('video'),
            src: mediaURLData['7701'],
            loop: false,
            muted: false,
            poster: '',
            tryMultipleVideoPlayAtTheSameTime: false,
            timesParam: [
            ],
            onTimes: function (name) {
                switch (name) {
                    case 'firstPoint':
                        break;
                }
            },
            onStart: function () {
            },
            onEnd: function () {
            }
        }
    );
    return videoPlayer;
};

// 获取路径参数
function getQueryVariable (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) { return pair[1]; };
    }
    return (false);
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
 // 转盘抽奖
function roulette () {
    var panel = new PanelLotery({
        length: 5,
        duration: 3000,
        el: '#ltpanel'
    });
    $('.panel-btn').on('click', function (event) {
        event.preventDefault();
        if (panel.playing) return;
        var n = Math.floor(Math.random() * 5);
        console.log(n);
        panel.playto(n, function () {
            rouletteFrame.hide();
            switch (n) {
                case 0:
                    const gameRole = $('.game-role-wrap');
                    gameRole.show();
                    frameWrap.show();
                    break;
                case 1:
                    const money88 = $('.money-88');
                    money88.show();
                    frameWrap.show();
                    break;
                case 2:
                    const money28 = $('.money-28');
                    money28.show();
                    frameWrap.show();
                    break;
                case 3:
                    const none = $('.none-wrap');
                    none.show();
                    frameWrap.show();
                    break;
                case 4:
                    const money888 = $('.money-888');
                    money888.show();
                    frameWrap.show();
                    break;
                default:
                    $('.none-wrap').show();
                    frameWrap.show();
            }
        });
    });
};
roulette();
replace(8888, '.my-value');

const loadPage = $('.m-loading');
const videoPage = $('.m-video');
const indexPage = $('.m-index');
const visitorsPage = $('.m-visitors');
// 视频页按钮
const startButton = $('.start-btn');
const skipButton = $('.btn-skip');
const openButton = $('.btn-open');
const helpButton = $('.btn-help');
// index
const backButton = $('.btn-back'); // 返回按钮
const frameWrap = $('.m-frame'); // 弹框蒙层
const shareButton = $('.share-friend');
const relusButton = $('.btn-relus'); // 规则按钮
const prizedOne = $('.prize-one'); // 奖励按钮
const prizeTwo = $('.prize-two');
const prizeThree = $('.prize-three');
const hidFrame = $('.btn-hide-frame'); // 隐藏按钮
const progress = $('.progress-value');
// frame
const fristFrame = $('.frist-wrap');
const sectionFrame = $('.section-frame');
const notFoundFrame = $('.no-found-role');
const olduserFrame = $('.old-user-wrap');
const succeedFrame = $('.succeed-wrap');
// visitors
const helpFriendBtn = $('.help_friend-btn');
const invitationBtn = $('.invitation-btn');

const rouletteFrame = $('.roulette-wrap');
// 加载页对象
var LoadViewController = function () {
    // 公共变量
    var _that = this;
    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-loading');
    // 是否第一次进入，第一次进入显示新手弹框
    _private.isFrist = true;

    _private.isInit = false;
    // 音频, 视频
    _that.video = initVideo();
    _private.audio = $('#audio');
    _private.audioIsplay = false;
    const videoElement = _that.video.videoElement;
    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        initProject();
        // 加载体现在页面上
        _private.processLineEl = $('.move');
        _private.gload = new Config.Preload(Config.pageImgs);
        _private.gload.onloading = function (p) {
            let per = 100 - p;
            _private.processLineEl.css('marginLeft', -per + '%');
            PTTSendClick('page', 'loads-tart', '开始加载');
        };

        _private.repea = function () {
            if (videoElement.currentTime > 0.3) {
                $('.m-video').show();
                _that.hide();
                startButton.hide();
                _private.videoPageController();
            }
            if (videoElement.currentTime >= 17.5) {
                openButton.show();
            }
            if (videoElement.currentTime >= 18.9) {
                if (!videoElement.muted) {
                    videoElement.muted = true;
                }
                videoElement.currentTime = 18.0;
            }
        };
        // 页面加载完成
        _private.gload.onload = function () {
            PTTSendClick('page', 'load-end', '加载结束');
            _private.hieprogress();
            $('.m-loading').show();
            startButton.show();
            _private.isTapStart = false;
            // 获取页面参数
            _private.pageId = getQueryVariable('page') * 1;
            startButton.click((event) => {
                PTTSendClick('btn', 'start', '引入动画视频');
                _private.isTapStart = true;
                _private.hadlerPage();
                PTTSendClick('btn', 'play-video', '播放视频');
            });
        };
          // 获取url地址参数判断用户是否第一次点击，分享链接需要带参数
        _private.hadlerPage = function () {
            let pageId = _private.pageId;
            _private.variablePageController();
            _private.indexPageController();
            _private.framePageController();
            if (pageId === 1) {
                loadPage.hide();
                videoPage.hide();
                visitorsPage.show();
                _private.audio[0].play();
                _private.pageId = 0;
                PTTSendClick('btn', 'visitors-page', '跳转客态页');
            } else if (pageId === 0) {
                PTTSendClick('btn', 'index-page', '进入主态页');
                visitorsPage.hide();
                _that.video.play();
                videoElement.addEventListener('timeupdate', _private.repea, false);
            }
        };

        _private.variablePageController = function () {
            replace(8888, '.friend-value');
            helpFriendBtn.click(() => {
                PTTSendClick('btn', 'help-friend-btn', '为好友助力');
                frameWrap.show();
                succeedFrame.show();
            });
            invitationBtn.click(() => {
                PTTSendClick('btn', 'invitation-btn', '邀请助力');
                indexPage.show();
                visitorsPage.hide();
            });
        };
        // 视频页按钮
        _private.videoPageController = function () {
            skipButton.show();
             // 点击跳过button
            skipButton.click(() => {
                PTTSendClick('btn', 'skip-btn', '跳过视频');
                videoElement.removeEventListener('timeupdate', _private.repea, false);
                videoElement.currentTime = 49;
                skipButton.hide();
                openButton.hide();
                // helpButton.show();
            });
            // 用户没有点击，三秒后自动跳转
            if (videoElement.currentTime > 18) {
                setTimeout(() => {
                    videoElement.removeEventListener('timeupdate', _private.repea, false);
                    if (videoElement.muted) {
                        videoElement.muted = false;
                    }
                    openButton.hide();
                }, 4000);
            }
            openButton.click(() => {
                PTTSendClick('btn', 'open-btn', '召唤门神');
                videoElement.removeEventListener('timeupdate', _private.repea, false);
                if (videoElement.muted) {
                    videoElement.muted = false;
                }
                openButton.hide();
            });
            _private.showHelp = function () {
                if (videoElement.currentTime >= 48.02) {
                    helpButton.show();
                }
                if (videoElement.currentTime >= 52 && !_private.audioIsplay) {
                    _private.audio[0].play();
                    // 是否点击助力
                    _private.isTapHelp = false;
                    if (!_private.isTapHelp) {
                        setTimeout(() => {
                            helpButton.hide();
                            videoPage.hide();
                            indexPage.show();
                            if (_private.isFrist) {
                                frameWrap.show();
                                $('.frist-wrap').show();
                                _private.isFrist = false;
                            }
                        }, 4000);
                    }
                }
            };
            helpButton.click((event) => {
                PTTSendClick('btn', 'help-btn', '助力好友');
                helpButton.hide();
                videoPage.hide();
                indexPage.show();
                // 播放音频
                _private.audio[0].play();
                if (_private.isFrist) {
                    frameWrap.show();
                    $('.frist-wrap').show();
                    _private.isFrist = false;
                }
            });
            videoElement.addEventListener('timeupdate', _private.showHelp, false);
        };
        // 主页按钮
        _private.indexPageController = function () {
            // 回播
            backButton.click((event) => {
                PTTSendClick('btn', 'back-btn', '回看视频');
                helpButton.hide();
                startButton.show();
                indexPage.hide();
                visitorsPage.hide();
                loadPage.show();
                // videoPage.show();
                _private.audio[0].pause();
                videoElement.currentTime = 1;
                videoElement.pause();
            });
            // 任务进度
            prizedOne.click(function () {
                frameWrap.show();
                prizedOne.find('.prize-15').addClass('prize-15-grey');
                prizedOne.find('.state').hide();
                $('.reward-2000').show();
                PTTSendClick('btn', 'prized-one-btn', '第一个任务');
            });
            prizeTwo.click(function () {
                frameWrap.show();
                prizeTwo.find('.prize-game').addClass('prize-game-grey');
                prizeTwo.find('.state').hide();
                $('.reward-8888').show();
                PTTSendClick('btn', 'prize-two-btn', '第二个任务');
            });
            prizeThree.click(function () {
                frameWrap.show();
                prizeThree.find('.prize-888').addClass('prize-888-grey');
                prizeThree.find('.state').hide();
                $('.roulette-wrap').show();
                PTTSendClick('btn', 'prize-three-btn', '第三个任务');
            });
            shareButton.click(function () {
                frameWrap.show();
                $('.share').show();
                PTTSendClick('btn', 'share-btn', '邀请好友');
            });
            $('.share').click(function () {
                frameWrap.hide();
                $('.share').hide();
                PTTSendClick('btn', 'share-mod', '取消邀请好友');
            });
            // 领取，下载等按钮，
            $('.btn-hide').click((event) => {
                frameWrap.hide();
                $(event.srcElement).parent().hide();
                PTTSendClick('btn', 'hide-frame-btn', '隐藏弹框');
            });
            $('.btn-checkDet').click(() => {
                frameWrap.show();
                $('.friend-wrap').show();
                PTTSendClick('btn', 'friend-list', '查看好友助力列表');
            });
            // 设置任务进度百分比
            setProgress();
            function setProgress () {
                const stateArr = $('.state');
                let max = 10000;
                let myValue = 2000;
                let per = percentage(myValue, max);
                if (myValue >= 2000) {
                    stateArr.eq(0).addClass('state-1');
                    $('.point-img').eq(0).addClass('point-2000-act');
                }
                if (myValue >= 8888) {
                    stateArr.eq(0).addClass('state-1');
                    $('.point-img').eq(1).addClass('point-8888-act');
                }
                if (myValue >= 10000) {
                    stateArr.eq(0).addClass('state-1');
                    $('.point-img').eq(2).addClass('point-10000-act');
                }
                progress.css({
                    width: `${per}%`
                });
            };
            function percentage (num, total) {
                if (num === 0 || total === 0) {
                    return 0;
                }
                return (Math.round(num / total * 10000) / 100.00);
            };
            // 统一使用隐藏函数
            hidFrame.on('click', (event) => {
                PTTSendClick('btn', `hide-frame`, '隐藏弹框');
                frameWrap.hide();
                $(event.srcElement).parent().hide();
            });
            // 显示规则
            relusButton.click((event) => {
                PTTSendClick('btn', 'show-relus', '显示规则弹框');
                frameWrap.show();
                $('.relus-wrap').show();
            });
        };
        // 弹框层
        _private.framePageController = function () {
            fristFrame.find('.receive').click(() => {
                PTTSendClick('btn', 'frist-frame-receive-btn', '首次进入领取按钮');
                fristFrame.hide();
                sectionFrame.show();
            });
            sectionFrame.find('.confirm').click(() => {
                PTTSendClick('btn', 'section-confirm-btn', '选区确认');
                sectionFrame.hide();
                notFoundFrame.show();
            });
            notFoundFrame.find('.reset').click(() => {
                PTTSendClick('btn', 'reset-btn', '重新选择选区');
                frameWrap.show();
                sectionFrame.show();
                notFoundFrame.hide();
            });
            olduserFrame.find('.receive').click(() => {
                PTTSendClick('btn', 'receive-btn', '老用户领取奖励');
                olduserFrame.hide();
                frameWrap.hide();
            });
        };

        // _private.visivorsPage = function () {
        // };

        _private.gload.onfail = function (msg) {
            console.log(msg);
        };

        _private.isInit = true;
    };
    _private.hieprogress = function () {
        const progressText = $('.progress_text');
        progressText.hide();
    };

    // 显示
    _that.show = function () {
        _private.pageEl.show();
    };

    // 隐藏
    _that.hide = function () {
        _private.pageEl.hide();
    };

    // 执行加载
    _that.load = function () {
        _private.gload.load();
    };
    // 离开页面关闭音乐
    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function () {
        if (!document[hiddenProperty]) {
            document.title = '激活状态';
        } else {
            document.title = '离开页面啦';
        }
    };
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
/* 此代码解决横竖屏切换时iso上触发多次的bug
    var rotateELSize = function (e) {
        var winWidth = document.documentElement.clientWidth;
        var winHeight = document.documentElement.clientHeight;

        if (e && winWidth / winHeight < 1.2 && winWidth / winHeight > 0.8) {
            return false;
        }

        // do something

        window.addEventListener('resize', rotateELSize);
    };
*/
    _private.init();
};

module.exports = LoadViewController;

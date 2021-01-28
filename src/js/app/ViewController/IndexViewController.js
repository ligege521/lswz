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

const videoPage = $('.m-video');
const indexPage = $('.m-index');
// 视频页按钮
const startButton = $('.start-btn');
const skipButton = $('.btn-skip');
const openButton = $('.btn-open');
const helpButton = $('.btn-help');
// index
const backButton = $('.btn-back'); // 返回按钮
const frameWrap = $('.m-frame'); // 弹框蒙层

const relusButton = $('.btn-relus'); // 规则按钮
// 加载页对象
var IndexViewController = function () {
    // 公共变量
    var _that = this;
    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-loading');
    // 是否第一次进入
    _private.isNewUser = false;
    // 是否点击开门
    _private.isTapOpen = false;
    // 是否点击回看视频, 判断后面视频播放完成是否还需要弹框
    _private.isBackVideo = false;
    // 是否在播放背景音乐
    _private.isAudioPlay = false;
    // 是否点击的计时器
    _private.coutDown = false;

    _private.isInit = false;
    // 视频
    _that.video = initVideo();
    const videoElement = _that.video.videoElement;
    // 背景音频
    const audio = document.getElementById('audio');
    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        initProject();
        $('.m-index').click(() => {
            if (!_private.isAudioPlay) {
                console.log('音频播');
                audio.play();
                _private.isAudioPlay = true;
            };
        });
        // 加载体出现在页面上
        _private.processLineEl = $('.move');
        _private.gload = new Config.Preload(Config.pageImgs);
        _private.gload.onloading = function (p) {
            let per = 100 - p;
            _private.processLineEl.css('marginLeft', -per + '%');
        };
        // 是否新用户
        window.canNewUser = function canNewUser (user) {
            _private.isNewUser = user;
            if (_private.isNewUser) {
                _private.gload.load();
            } else {
                $('.m-loading').hide();
                $('.m-index').show();
            }
        };
        // 页面加载完成
        _private.gload.onload = function () {
            // PTTSendClick('page', 'load-end', '加载结束');
            _private.hieprogress();
            $('.m-loading').show(); // 这里是显示loading 页
            startButton.show();
            _private.isTapStart = false;
            // 点击拿红包按钮
            startButton.click((event) => {
                _private.isTapStart = true;
                _that.video.play();
                videoElement.addEventListener('timeupdate', _private.repea, false);
            });
        };
        // 视频播放事件函数
        _private.repea = function () {
            if (videoElement.currentTime > 0.3) { // 视频大于0.3秒时 视频模块出现，开始按钮消失
                videoPage.show();
                _that.hide();
                startButton.hide();
                helpButton.hide();
                skipButton.show();
                indexPage.hide();
            }
            if (videoElement.currentTime >= 17.5) { // 当视频大于 17.5秒时开门按钮显示出来
                openButton.show();
            }
            if (videoElement.currentTime >= 18.9) { // 当视频大于 18.9秒时重复播放
                if (!videoElement.muted) {
                    videoElement.muted = true;
                }
                videoElement.currentTime = 18.0;
            }
            // 用户没有点击，三秒后自动跳转
            if (videoElement.currentTime > 18 && !_private.isTapOpen) {
                _private.isTapOpen = true;
                setTimeout(() => {
                    videoElement.removeEventListener('timeupdate', _private.repea, false);
                    if (videoElement.muted) {
                        videoElement.muted = false;
                    }
                    openButton.hide();
                    videoElement.addEventListener('timeupdate', _private.showHelp, false);
                }, 4000);
            }
        };

        // 视频页按钮
        _private.videoPageController = function () {
            skipButton.show();
             // 点击跳过button
            skipButton.click(() => {
                videoElement.removeEventListener('timeupdate', _private.repea, false);
                videoElement.addEventListener('timeupdate', _private.showHelp, false);
                videoElement.currentTime = 50;
                skipButton.hide();
                openButton.hide();
                setTimeout(() => {
                    helpButton.show();
                }, 500);
            });
            openButton.click(() => {
                // PTTSendClick('btn', 'open-btn', '召唤门神');
                videoElement.removeEventListener('timeupdate', _private.repea, false);
                if (videoElement.muted) {
                    videoElement.muted = false;
                }
                openButton.hide();
            });
            _private.showHelp = function () {
                if (videoElement.currentTime >= 50.02) {
                    skipButton.hide();
                    helpButton.show();
                }
                if (videoElement.currentTime >= 52 && !_private.coutDown) {
                    if (!_private.isAudioPlay) {
                        audio.play();
                        _private.isAudioPlay = true;
                    }
                    // 用户4秒没有点击助力，自动进入
                    _private.coutDown = setTimeout(() => {
                        helpButton.hide();
                        videoPage.hide();
                        indexPage.show();
                        if (!_private.isBackVideo && _private.isNewUser) {
                            _private.isBackVideo = true;
                            window.videoEndFrame && window.videoEndFrame();
                        }
                    }, 4000);
                }
            };
            helpButton.click((event) => {
                // 清除定时器
                clearTimeout(_private.coutDown);
                _private.coutDown = false;
                helpButton.hide();
                videoPage.hide();
                indexPage.show();
                videoElement.removeEventListener('timeupdate', _private.showHelp, false);
                // 播放音频
                if (!_private.isAudioPlay) {
                    audio.play();
                    _private.isAudioPlay = true;
                }
                if (!_private.isBackVideo && _private.isNewUser) {
                    _private.isBackVideo = true;
                    window.videoEndFrame && window.videoEndFrame();
                }
            });
        };

        // 主页按钮
        _private.indexPageController = function () {
            // 回播视频
            backButton.click((event) => {
                console.log('回拨');
                videoElement.currentTime = 0;
                audio.pause();
                _private.isAudioPlay = false;
                _that.video.play();
                videoElement.addEventListener('timeupdate', _private.repea, false);
                // 阻止事件冒泡
                event.stopPropagation();
            });
            $('.btn-checkDet').click(() => {
                frameWrap.show();
                $('.friend-wrap').show();
            });
            // 显示规则
            relusButton.click((event) => {
                // PTTSendClick('btn', 'show-relus', '显示规则弹框');
                frameWrap.show();
                $('.relus-wrap').show();
            });
        };
        // 绑定主态页事件
        _private.indexPageController();
        // 视频页事件
        _private.videoPageController();

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

module.exports = IndexViewController;

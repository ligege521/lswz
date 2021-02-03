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
// 初始化视频
function initVideo () {
    var videoPlayer = new MMD.VideoPlayer(
        {
            videoElement: document.getElementById('video'),
            src: mediaURLData['7701'],  // 从视频地址池获取到的地址   mediaURLData['7701']
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

const loadMod = $('.m-loading'); // 加载模块
const videoMod = $('.m-video'); // 视频模块
const indexMod = $('.m-index'); // 主页模块
const loadProgress = $('.move'); // 加载进度条
// 视频页按钮
const startButton = $('.start-btn');
const skipButton = $('.btn-skip');
const openButton = $('.btn-open');
const helpButton = $('.btn-help');
// index
const backButton = $('.btn-back'); // 返回按钮

// 视频
const videoController = initVideo();
const video = videoController.videoElement;
// 背景音频
const audio = document.getElementById('audio');

// 加载页对象
var IndexViewController = function () {
    // 公共变量
    var _that = this;
    // 私有变量
    var _private = {};

    _private.pageEl = loadMod;

    // 是否第一次进入
    _private.isNewUser = false;
    // 是否点击回看视频, 判断后面视频播放完成是否还需要弹框
    _private.isBackVideo = false;
    // 是否在播放背景音乐
    _private.isAudioPlay = false;
    // 是否开门，的计时器
    _private.isOpen = false;
    // 是否助力，的计时器
    _private.isHelp = false;

    _private.isInit = false;
    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        initProject();
        // 全局绑定点击事件，触发播放背景音乐
        $('.m-index').click(() => {
            if (!_private.isAudioPlay) {
                audio.play();
                _private.isAudioPlay = true;
            };
        });
        // 加载体出现在页面上
        _private.gload = new Config.Preload(Config.pageImgs);
        _private.gload.onloading = function (p) {
            let per = 100 - p;
            loadProgress.css('marginLeft', -per + '%');
        };
        // 是否新用户
        window.canNewUser = function canNewUser (user) {
            _private.isNewUser = user;
            if (_private.isNewUser) {
                loadMod.show();
                _private.gload.load();
            } else {
                loadMod.hide();
                videoMod.hide();
                indexMod.show();
            }
        };
        // 页面加载完成
        _private.gload.onload = function () {
            console.log(_private.isNewUser);
            _private.hieprogressText();
            startButton.show();
            // 点击拿红包按钮
            startButton.click((event) => {
                videoController.play();
                _private.isStartPlay = false; // 是否开始播放
                video.addEventListener('timeupdate', _private.videoPlay, false);
            });
        };
        // 视频播放
        _private.videoPlay = function () {
            if (video.currentTime >= 0.4 && !_private.isStartPlay) { // 视频大于0.3秒时 视频模块出现，开始按钮消失
                videoMod.show();
                _private.indexHide();
                loadMod.hide();
                // button 显示出来
                skipButton.show();
                _private.isStartPlay = true;
            }
            if (video.currentTime >= 17.5) { // 当视频大于 17.5秒时开门按钮显示出来
                openButton.show();
            }
            if (video.currentTime >= 22.0 && !video.muted) { // 循环播放
                video.muted = true; // 静音
                video.currentTime = 18.0;
                // 四秒后不点击自动进入
                if (!_private.isOpen) {
                    _private.isOpen = setTimeout(() => {
                        _private.openDoor();
                        _private.isOpen = null;
                        console.log('自动开门');
                        video.removeEventListener('timeupdate', _private.videoPlay, false);
                    }, 4000);
                }
            }
        };
        // 跳过
        skipButton.click(() => {
            video.removeEventListener('timeupdate', _private.videoPlay, false);
            video.currentTime = 54;
            skipButton.hide();
            openButton.hide();
            // setTimeout(() => {
            //     helpButton.show();
            // }, 500);
            video.addEventListener('timeupdate', _private.videoEnd, false);
        });
        // 开门
        _private.openDoor = function () {
            video.removeEventListener('timeupdate', _private.videoPlay, false);
            video.currentTime = 23.0;
            video.muted = false;
            openButton.hide();
            video.addEventListener('timeupdate', _private.videoEnd, false);
        };
        // 按钮-开门
        openButton.click(() => {
            // 清除定时器 1
            clearTimeout(_private.isOpen);
            _private.openDoor();
        });

        // 按钮-助力
        helpButton.click((event) => {
            // 清除定时器
            clearTimeout(_private.isHelp);
            _private.indexShow();
        });

        // 按钮-回播视频
        backButton.click((event) => {
            video.currentTime = 0;
            videoController.play();
            audio.pause();
            // 视频播放初始化
            _private.isStartPlay = false;
            video.addEventListener('timeupdate', _private.videoPlay, false);
            // 阻止事件冒泡
            event.stopPropagation();
        });
        // 视频播放结尾的监听
        _private.videoEnd = function () {
            if (video.currentTime >= 54.02) {
                skipButton.hide();
                helpButton.show();
                if (!_private.isAudioPlay) {
                    // 播放音频
                    console.log(audio.play, '音频');
                    audio.play();
                    _private.isAudioPlay = true;
                }
            }
            if (video.currentTime >= 55.5 && !_private.isHelp) {
                // 用户4秒没有点击助力，自动进入
                console.log(video.currentTime, _private.isHelp);
                _private.isHelp = setTimeout(() => {
                    _private.indexShow();
                    _private.isHelp = null;
                    console.log('自动助力');
                    video.removeEventListener('timeupdate', _private.videoEnd, false);
                }, 4000);
            }
        };

         // 主页显示出来
        _private.indexShow = function () {
            indexMod.show();
            helpButton.hide();
            videoMod.hide();
            console.log(_private.isAudioPlay);
            if (!_private.isAudioPlay) {
                // 播放音频
                console.log(audio.play, '音频');
                audio.play();
                _private.isAudioPlay = true;
            }
            // 是否是回看视频状态 与 老用户状态
            if (!_private.isBackVideo && _private.isNewUser) {
                _private.isBackVideo = true;
                window.videoEndFrame && window.videoEndFrame();
            }
            video.removeEventListener('timeupdate', _private.videoEnd, false);
        };

        // 主页隐藏
        _private.indexHide = function () {
            indexMod.hide();
            // 音频播放状态重置
            _private.isAudioPlay = false;
        };

        _private.gload.onfail = function (msg) {
            console.log(msg);
        };

        _private.isInit = true;
    };
    // 隐藏加载条文字
    _private.hieprogressText = function () {
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

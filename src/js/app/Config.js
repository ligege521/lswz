import Preload from './module/Preload.js';

var Config = {};

// ajax请求链接
Config.requireUrl = '';

// 图片路径前缀
// 如kf文件里图片不使用require时 img地址：Config.imgPath
Config.imgPath = process.env.NODE_ENV === 'handover' ? process.env.PATH : process.env.PATH + 'img/';

// 默认分享语
Config.defShare = {
    // title: '分享标题',
    // desc: '分享描述',
    // link: location.href,
    // // 分享配图
    // img: require('../../img/share.jpg'),
    // // 项目名，数据查询时候用
    // proj: 'streetgame',
    // // 填写公众号绑定的appid
    // appid: '', // 例如: wx12380ea254191f1b
    // cnzz: '' // 例如: 1259179479
};

Config.Preload = Preload;

// 预加载的图片
Config.pageImgs = {
    imgs: [
        {
            name: 'bg',
            url: require('../../img/loading/bg.png')
        },
        {
            name: 'loading',
            url: require('../../img/loading/loading.png')
        },
        {
            name: 'loading_progress_bg',
            url: require('../../img/loading/loading_progress_bg.png')
        },
        {
            name: 'loading_text',
            url: require('../../img/loading/loading_text.png')
        },
        {
            name: 'progres',
            url: require('../../img/loading/progres.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/index/bg.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/index/act_friend.png')
        },
        {
            name: 'friend',
            url: require('../../img/index/friend.png')
        },
        {
            name: 'gift_bag',
            url: require('../../img/index/gift_bag.png')
        },
        {
            name: 'list_bg',
            url: require('../../img/index/list_bg.png')
        },
        {
            name: 'my_value_bg',
            url: require('../../img/index/my_value_bg.png')
        },
        {
            name: 'not_receive',
            url: require('../../img/index/not_receive.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/index/act_friend.png')
        },
        {
            name: 'prize_15',
            url: require('../../img/index/prize_15.png')
        },
        {
            name: 'prize_888_grey',
            url: require('../../img/index/prize_888_grey.png')
        },
        {
            name: 'prize_888',
            url: require('../../img/index/prize_888.png')
        },
        {
            name: 'prize_game_grey',
            url: require('../../img/index/prize_game_grey.png')
        },
        {
            name: 'prize_game',
            url: require('../../img/index/prize_game.png')
        },
        {
            name: 'prize_one',
            url: require('../../img/index/prize_one.png')
        },
        {
            name: 'prize_three',
            url: require('../../img/index/prize_three.png')
        },
        {
            name: 'prize_two',
            url: require('../../img/index/prize_two.png')
        },
        {
            name: 'prize_game_grey',
            url: require('../../img/index/prize_game_grey.png')
        },
        {
            name: 'btn_confirm',
            url: require('../../img/frame/btn_confirm.png')
        },
        {
            name: 'frame_bg',
            url: require('../../img/frame/frame_bg.png')
        },
        {
            name: 'game_role',
            url: require('../../img/frame/game_role.png')
        },
        {
            name: 'help_com',
            url: require('../../img/frame/help_com.png')
        },
        {
            name: 'hide',
            url: require('../../img/frame/hide.png')
        },
        {
            name: 'money_888',
            url: require('../../img/frame/money_888.png')
        },
        {
            name: 'money_2',
            url: require('../../img/frame/money_2.png')
        },
        {
            name: 'btn_confirm',
            url: require('../../img/frame/btn_confirm.png')
        },
        {
            name: 'money_28',
            url: require('../../img/frame/money_28.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/frame/help_com.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/frame/hide.png')
        },
        {
            name: 'hide',
            url: require('../../img/frame/mesk_bg.png')
        },
        {
            name: 'money_100',
            url: require('../../img/frame/money_100.png')
        },
        {
            name: 'money_888',
            url: require('../../img/frame/money_888.png')
        },
        {
            name: 'new_user_reward',
            url: require('../../img/frame/new_user_reward.png')
        },
        {
            name: 'new_user_tip',
            url: require('../../img/frame/new_user_tip.png')
        },
        {
            name: 'no_found_role',
            url: require('../../img/frame/no_found_role.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/frame/none.png')
        },
        {
            name: 'old_user',
            url: require('../../img/frame/old_user.png')
        },
        {
            name: 'point_2000',
            url: require('../../img/frame/point_2000.png')
        },
        {
            name: 'roulette_bg',
            url: require('../../img/frame/roulette_bg.png')
        },
        {
            name: 'relus_bg',
            url: require('../../img/frame/relus_bg.png')
        },
        {
            name: 'header_bg',
            url: require('../../img/frame/qualified.png')
        },
        {
            name: 'point_8888',
            url: require('../../img/frame/point_8888.png')
        },
        {
            name: 'roulette',
            url: require('../../img/frame/roulette.png')
        },
        {
            name: 'roulette_bg',
            url: require('../../img/frame/roulette_bg.png')
        },
        {
            name: 'unbound',
            url: require('../../img/frame/unbound.png')
        },
        {
            name: 'succeed',
            url: require('../../img/frame/succeed.png')
        },
        {
            name: '0',
            url: require('../../img/num/0.png')
        },
        {
            name: '1',
            url: require('../../img/num/1.png')
        },
        {
            name: '2',
            url: require('../../img/num/2.png')
        },
        {
            name: '3',
            url: require('../../img/num/3.png')
        },
        {
            name: '4',
            url: require('../../img/num/4.png')
        },
        {
            name: '5',
            url: require('../../img/num/5.png')
        },
        {
            name: '6',
            url: require('../../img/num/6.png')
        },
        {
            name: '7',
            url: require('../../img/num/7.png')
        },
        {
            name: '8',
            url: require('../../img/num/8.png')
        },
        {
            name: '9',
            url: require('../../img/num/9.png')
        }
    ],
    sprites: [
        /*
        {
            el: $('.m-game .kf-game-video'),
            pathPrefix: Config.imgPath,
            postfix: 'jpg'
        }
        */
    ],
    keyimgs: [
        /*
        {
            el: $('.m-game .kf-game-video'),
            pathPrefix: Config.imgPath,
            postfix: 'jpg'
        }
        */
    ]
};

module.exports = Config;

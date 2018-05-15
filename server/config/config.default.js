'use strict';

module.exports = appInfo => {

    const config = {};

    config.view = {
        defaultViewEngine: 'nunjucks',
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1517886399328_119';

    // add your config here
    config.middleware = [

    ];

    config.cluster = {
    listen: {
      port: 7777,
      //hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    }
}




    config.mysql = {
        client: {
            // host
            host: '127.0.0.1',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: '1234',
            // 数据库名
            database: 'isp',
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
    };

    // config.mysql={
    //     client: {
    //         host: '127.0.0.1',
    //         port: '3306',
    //         user: 'root',
    //         password: '1234',
    //         database: 'isp',
    //     },
    //     app: true,
    //     agent: false,
    // };

    // config.redis = {
    //     client: {
    //         port: 6379,          // Redis port
    //         host: '127.0.0.1',   // Redis host
    //         password: '',
    //         db: 0,
    //     },
    // };

    config.security = {
        csrf: {
            ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
            enable: false
        },
        // csrf:false,
        // debug:'csrf-disable',
        domainWhiteList: ['http://localhost:3000','http://1270.0.0.1:3000','http://192.168.2.166:3000']
    };

    config.cors = {
        allowMethods: 'GET,PUT,POST,DELETE,OPTIONS',
        origin:'*',
    };


    return config;

};

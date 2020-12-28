'use strict';

module.exports = appInfo => {

    const config = {};

    config.view = {
        defaultViewEngine: 'nunjucks',
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1517886399328_119';

    // add your config here
    config.middleware = [];

    config.cluster = {
        listen: {
            port: 7001,
            //hostname: '127.0.0.1',
            // path: '/var/run/egg.sock',
        }
    };

    config.middleware = [
        'url'
    ];

    config.url = {
        match: /\/invoke\//,
    };

    config.mysql = {
        client: {
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '1q2w3e4r',
            database: 'restful'
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: true,
    };

    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 0,
        },
    };

    config.security = {
        csrf: {
            ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
            enable: false
        },
        // csrf:false,
        // debug:'csrf-disable',
        domainWhiteList: ['http://localhost:3000', 'http://1270.0.0.1:3000']
    };

    config.cors = {
        allowMethods: 'GET,PUT,POST,DELETE,OPTIONS',
        origin: '*',
    };

    config.systemInfo = [
        {
            systemId: 1,
            url: 'http://127.0.0.1.21:8090',
            name: '昭通中联his'
        },
        {
            systemId: 2,
            url: 'http://127.0.0.1:8090',
            name: '云大东软his'
        }
    ]


    return config;

};

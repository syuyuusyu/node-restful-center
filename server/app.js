module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        console.log('init app');

        console.log('app start');

    });

    app.once('server', server => {
        //app.logger.info(server.restful);
    });

    app.messenger.on('invokeEntitys', data => {
        console.log('invokeEntitys');
        app.invokeEntitys=data;
    });
};

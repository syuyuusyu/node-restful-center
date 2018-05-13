module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        console.log('init app');

        //初始化接口调用实体
        app.invokeEntitys=await app.mysql.query(`select * from invoke_info`);


        console.log('app start');

    });

    app.once('server', server => {
        //app.logger.info(server.restful);
    });
};










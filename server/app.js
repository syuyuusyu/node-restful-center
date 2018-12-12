module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        console.log('init app');

        const databaseName=app.config.mysql.client.database;
        let [{total}]=await app.mysql.query(`select count(1) total
          from information_schema.COLUMNS where TABLE_SCHEMA='isp' and table_name='invoke_info'`)
        if(total===0){
          let sql=`
          CREATE TABLE invoke_info (
            id int(4) NOT NULL AUTO_INCREMENT,
            name varchar(100) DEFAULT NULL,
            descrption varchar(200) DEFAULT NULL,
            method varchar(10) DEFAULT NULL,
            url varchar(200) DEFAULT NULL,
            head text,
            body text,
            parseFun text,
            orginalResult longtext,
            next varchar(50) DEFAULT NULL,
            invokeType char(1) DEFAULT NULL COMMENT '1:接口调用配置,2:可调用接口',
            groupName varchar(50) DEFAULT NULL,
            PRIMARY KEY (id)
          ) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
          `
          await app.mysql.query(sql);
        }
        //初始化接口调用实体
        let invokeEntitys=await app.mysql.query(`select * from invoke_info`);


        console.log('app start');

    });

    app.once('server', server => {
        //app.logger.info(server.restful);
    });

    app.messenger.on('invokeEntitys', data => {
        console.log('entityCache');
        app.invokeEntitys=invokeEntitys;
    });
};

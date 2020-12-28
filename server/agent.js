module.exports = agent => {


  agent.messenger.on('egg-ready', async () => {
    agent.logger.info('egg-ready');

    const databaseName = agent.config.mysql.client.database;
    let [{ total }] = await agent.mysql.query(`select count(1) total
          from information_schema.COLUMNS where TABLE_SCHEMA='${databaseName}' and table_name='invoke_info'`);
    if (total === 0) {
      let sql = `
          CREATE TABLE invoke_info (
            id int(4) NOT NULL AUTO_INCREMENT,
            systemId int(4) DEFAULT NULL,
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
          `;
      await agent.mysql.query(sql);
    }

    console.log();
    if (!agent.config.redis.client) {
      //初始化接口调用实体
      const invokeEntitys = await agent.mysql.query(`select * from invoke_info`);
      agent.messenger.sendToApp('invokeEntitys', invokeEntitys);
      agent.messenger.on('invokeEntitys', data => agent.messenger.sendToApp('invokeEntitys', data));
    }



  });

};


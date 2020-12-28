const Controller = require('egg').Controller;



class RestfulController extends Controller {

    async toPage() {
        await this.ctx.render('restful/invokeEntityInfo.tpl');
    }

    async infos() {
        const { start, limit, invokeName, groupName, systemId } = this.ctx.request.body;
        let where = (invokeName && !/\s/.test(invokeName)) ? { name: invokeName } : {};
        where = (groupName && !/\s/.test(groupName)) ? { ...where, groupName: groupName } : where;
        where = (systemId && !/\s/.test(systemId)) ? { ...where, systemId: systemId } : where;
        let wherecount = (invokeName && !/\s/.test(invokeName)) ? `where name='${invokeName}'` : 'where 1=1';
        wherecount = wherecount + ((groupName && !/\s/.test(groupName)) ? ` and groupname='${groupName}'` : '');
        wherecount = wherecount + ((systemId && !/\s/.test(systemId)) ? ` and systemId='${systemId}'` : '');
        let result = {};
        let [{ total }] = await this.app.mysql.query(`select count(1) total from invoke_info ${wherecount}`, []);
        let [...content] = await this.app.mysql.select('invoke_info', {
            limit: limit,
            offset: start,
            where
        });
        result.totalElements = total;
        result.content = content;
        this.ctx.body = result;
    }

    systemInfo() {
        this.ctx.body = this.app.config.systemInfo;
    }

    async save() {
        const entity = this.ctx.request.body;
        if (!entity.next) entity.next = null;
        let result = {};
        if (entity.id) {
            result = await this.app.mysql.update('invoke_info', entity);
        } else {
            result = await this.app.mysql.insert('invoke_info', entity); // 更新 posts 表中的记录
        }
        // 判断更新成功
        const updateSuccess = result.affectedRows === 1;
        this.reflashEntity();
        this.ctx.body = { success: updateSuccess };
    }

    async invokes() {
        this.ctx.body = await this.app.mysql.select('invoke_info', {});
    }

    async test() {
        const entity = this.ctx.request.body;
        this.ctx.body = await this.service.restful.invoke(entity, entity.queryMap);
    }

    async invoke() {
        let result = [];
        const queryMap = this.ctx.request.body;
        const invokeEntitys = await this.ctx.service.redis.get('invokeEntitys');
        const [entity] = invokeEntitys.filter(d => d.name === this.ctx.params.invokeName);
        //await this.app.mysql.select('invoke_info',{where: {  name: this.ctx.params.invokeName}});
        let entitybody = {};
        if (entity.body) {
            try {
                entitybody = JSON.parse(entity.body);
            } catch (e) {
                entitybody = {};
            }
        }
        let nextEntitys = invokeEntitys.filter(d => {
            let flag = false;
            entity.next.split(',').forEach(i => {
                if (i === d.id + '') {
                    flag = true;
                }
            });
            return flag;
        });
        let promises = nextEntitys.map(entity => this.service.restful.invoke(entity, { ...entitybody, ...queryMap }));
        let p = await Promise.all(promises);

        for (let r of p) {
            const cur = {};
            for (let invokeName in r) {
                if (invokeName === 'msg' || invokeName === 'success') {
                    continue;
                }
                cur[invokeName] = r[invokeName].result;
            }
            result.push(cur);
        }
        //this.ctx.logger.info('集成就调用结果:', result);
        if (entity.parseFun) {
            try {
                let fn = evil(entity.parseFun);
                result = fn(result);

            } catch (e) {
                this.ctx.logger.error(e);
            }
        } else {

        }
        //this.ctx.logger.info('运行解析函数后结果',result);
        this.ctx.body = result;
    }

    parse(obj) {
        let result = {};
        for (let o of obj) {
            for (let key in o) {
                let name = '';
                key.replace(/cloud_(\w+)-1/, (w, p1) => {
                    name = p1;
                });
                result[name] = o[key];
            }
        }
        return result;
    }

    async delete() {
        const result = await this.app.mysql.delete('invoke_info', {
            id: this.ctx.params.id
        });
        const updateSuccess = result.affectedRows === 1;
        this.reflashEntity();
        this.ctx.body = { success: updateSuccess };
    }

    async checkUnique() {
        let [{ total }] = await this.app.mysql.query('select count(1) total from invoke_info where name=?', [this.ctx.params.invokeName]);
        this.ctx.body = { total }
    }

    async reflashEntity() {
        console.log('reflashEntity');
        //this.app.invokeEntitys=await this.app.mysql.query('select * from invoke_info');
        let invokeEntitys = await this.app.mysql.query('select * from invoke_info');
        invokeEntitys = invokeEntitys.map(en => {
            let baseUrl = this.app.config.systemInfo.find(s => s.systemId == en.systemId).url;
            return { baseUrl, ...en }
        });
        this.ctx.service.redis.set('invokeEntitys', invokeEntitys);
    }

    async groupName() {
        this.ctx.body = await this.app.mysql.query(`select distinct groupName from invoke_info`);
    }

}

function evil(fn) {
    fn.replace(/(\s?function\s?)(\w?)(\s?\(w+\)[\s|\S]*)/g, function (w, p1, p2, p3) {
        return p1 + p3;
    });
    let Fn = Function;
    return new Fn('return ' + fn)();
}


module.exports = RestfulController;

'use strict';

module.exports = function (app) {
    var router = app.router,
        controller = app.controller;

    router.get('/index', controller.home.index);

    //接口调用
    router.get('/invokeEntityInfo', controller.restful.toPage);
    router.post('/invokeInfo/infos', controller.restful.infos);
    router.post('/invokeInfo/invokes', controller.restful.invokes);
    router.post('/invokeInfo/test', controller.restful.test);
    router.post('/invokeInfo/save', controller.restful.save);
    router.delete('/invokeInfo/delete/:id', controller.restful.delete);

    router.post('/invoke/:invokeName', controller.restful.invoke);

    router.get('/invokeInfo/checkUnique/:invokeName', controller.restful.checkUnique);
    router.get('/invokeInfo/groupName', controller.restful.groupName);

    //mock
    router.post('/v3/auth/tokens', controller.mock.openstack_token);
    router.get('/v2.1/servers', controller.mock.servicesList);
    router.get('/v1/resource/instance/:instanceId', controller.mock.instance);
    router.get('/v1/metric/:propertyId/measures', controller.mock.measures);
};
//# sourceMappingURL=router.js.map
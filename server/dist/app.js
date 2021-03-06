'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (app) {
    app.beforeStart(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var invokeEntitys;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // 应用会等待这个函数执行完成才启动
                        console.log('init app');
                        //console.log(app.config.redis.client)

                        if (!app.config.redis.client) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 4;
                        return app.mysql.query('select * from invoke_info');

                    case 4:
                        invokeEntitys = _context.sent;
                        _context.next = 7;
                        return app.redis.set('invokeEntitys', JSON.stringify(invokeEntitys));

                    case 7:
                        console.log('app start');

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    })));

    app.once('server', function (server) {
        //app.logger.info(server.restful);
    });

    app.messenger.on('invokeEntitys', function (data) {
        console.log('invokeEntitys');
        app.invokeEntitys = data;
    });
};
//# sourceMappingURL=app.js.map
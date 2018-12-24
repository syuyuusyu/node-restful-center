'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service = require('egg').Service;
var EventEmitter = require('events').EventEmitter;

var RestfulService = function (_Service) {
    _inherits(RestfulService, _Service);

    function RestfulService(ctx) {
        _classCallCheck(this, RestfulService);

        var _this = _possibleConstructorReturn(this, (RestfulService.__proto__ || Object.getPrototypeOf(RestfulService)).call(this, ctx));

        Object.assign(_this, EventEmitter.prototype);
        return _this;
    }

    _createClass(RestfulService, [{
        key: 'invoke',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(entity, queryObj) {
                var count, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                count = 1, result = {};
                                _context.next = 3;
                                return this._invoke(entity, queryObj, count, result);

                            case 3:
                                return _context.abrupt('return', result);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function invoke(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return invoke;
        }()
    }, {
        key: 'invoke',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(entity, queryObj) {
                var count, recursionLevel, lastinvokeName, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                count = 1, recursionLevel = 1, lastinvokeName = entity.name, result = {};
                                _context2.next = 3;
                                return this._invoke(entity, queryObj, count, result, recursionLevel, lastinvokeName);

                            case 3:
                                return _context2.abrupt('return', result);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function invoke(_x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return invoke;
        }()
    }, {
        key: '_invoke',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(entity, queryObj, count, result, recursionLevel, lastinvokeName) {
                var _this2 = this;

                var invokeName, url, method, data, head, invokeResult, fn, s, invokeEntitys, nextEntitys, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, netxEn;

                return regeneratorRuntime.wrap(function _callee3$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                invokeName = '';

                                (lastinvokeName + '-' + count).replace(/(?=\S+)((?:-\d+)+)/, function (w, p1) {
                                    invokeName = entity.name + p1;
                                    return entity.name + p1;
                                });
                                result[invokeName] = {};
                                url = this.parseByqueryMap(entity.url, queryObj);
                                method = entity.method.toUpperCase();
                                data = this.parseByqueryMap(entity.body, queryObj);

                                data = JSON.parse(data);
                                head = this.parseByqueryMap(entity.head, queryObj);

                                head = JSON.parse(head);
                                this.ctx.logger.info('url:', url);
                                //this.ctx.logger.info('method:',method);
                                //this.ctx.logger.info('head:',head);
                                //this.ctx.logger.info('body:',data);


                                invokeResult = void 0;
                                _context4.prev = 11;
                                _context4.next = 14;
                                return this.app.curl(url, {
                                    method: method,
                                    data: data,
                                    headers: head,
                                    dataType: 'json',
                                    timeout: 20000
                                });

                            case 14:
                                invokeResult = _context4.sent;
                                _context4.next = 22;
                                break;

                            case 17:
                                _context4.prev = 17;
                                _context4.t0 = _context4['catch'](11);

                                this.ctx.logger.error('调用接口错误!!', url);
                                //this.ctx.logger.info(invokeResult);
                                this.ctx.logger.info(_context4.t0);
                                throw _context4.t0;

                            case 22:
                                //this.ctx.logger.info('status',invokeResult.status);
                                //this.ctx.logger.info('result',invokeResult.data);
                                if (entity.parseFun) {
                                    try {
                                        fn = evil(entity.parseFun);
                                        s = fn(invokeResult.data, invokeResult.headers, invokeResult.status, head, data, url);
                                        //response,responsehead,responsestatus,requesthead,requestdata,url

                                        result[invokeName].result = s;
                                    } catch (e) {
                                        this.ctx.logger.error('运行解析函数错误');
                                        this.ctx.logger.info('response,responsehead,responsestatus,requesthead,requestdata,url');
                                        this.ctx.logger.info('解析参数\n', '----->\n', invokeResult.data, '\n', invokeResult.headers, '\n', invokeResult.status, '\n', head, '\n', data, '\n', url, '<------\n');
                                        this.ctx.logger.info('解析析函', entity.parseFun);
                                        result[invokeName].result = invokeResult.data;
                                    }
                                } else {
                                    result[invokeName].result = invokeResult.data;
                                }

                                result[invokeName].body = data;
                                result[invokeName].head = head;
                                result[invokeName].url = url;

                                if (!(entity.next && result[invokeName].result.map)) {
                                    _context4.next = 56;
                                    break;
                                }

                                recursionLevel++;
                                invokeEntitys = this.app.invokeEntitys;
                                nextEntitys = //await this.app.mysql.select('t_invoke_info',{where: {  id: entity.next.split(',') }});
                                invokeEntitys.filter(function (d) {
                                    var flag = false;
                                    entity.next.split(',').forEach(function (i) {
                                        if (i === d.id + '') {
                                            flag = true;
                                        }
                                    });
                                    return flag;
                                });
                                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(netxEn) {
                                    var currentCount, promises;
                                    return regeneratorRuntime.wrap(function _loop$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    currentCount = count;
                                                    promises = result[invokeName].result.map(function (r) {
                                                        currentCount++;
                                                        var currentQurtyObj = {};
                                                        Object.assign(currentQurtyObj, queryObj);
                                                        var queryParams = _this2.queryParams(netxEn);
                                                        queryParams.forEach(function (p) {
                                                            if (r[p]) {
                                                                currentQurtyObj[p] = r[p];
                                                            }
                                                        });
                                                        return _this2._invoke(netxEn, currentQurtyObj, currentCount, result, recursionLevel, invokeName);
                                                    });
                                                    _context3.next = 4;
                                                    return Promise.all(promises);

                                                case 4:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _loop, _this2);
                                });
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context4.prev = 34;
                                _iterator = nextEntitys[Symbol.iterator]();

                            case 36:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context4.next = 42;
                                    break;
                                }

                                netxEn = _step.value;
                                return _context4.delegateYield(_loop(netxEn), 't1', 39);

                            case 39:
                                _iteratorNormalCompletion = true;
                                _context4.next = 36;
                                break;

                            case 42:
                                _context4.next = 48;
                                break;

                            case 44:
                                _context4.prev = 44;
                                _context4.t2 = _context4['catch'](34);
                                _didIteratorError = true;
                                _iteratorError = _context4.t2;

                            case 48:
                                _context4.prev = 48;
                                _context4.prev = 49;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 51:
                                _context4.prev = 51;

                                if (!_didIteratorError) {
                                    _context4.next = 54;
                                    break;
                                }

                                throw _iteratorError;

                            case 54:
                                return _context4.finish(51);

                            case 55:
                                return _context4.finish(48);

                            case 56:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee3, this, [[11, 17], [34, 44, 48, 56], [49,, 51, 55]]);
            }));

            function _invoke(_x5, _x6, _x7, _x8, _x9, _x10) {
                return _ref3.apply(this, arguments);
            }

            return _invoke;
        }()
    }, {
        key: 'parseByqueryMap',
        value: function parseByqueryMap(str, queryMap) {
            return str.replace(/(@(\w+))/g, function (w, p1, p2) {
                return queryMap[p2] ? queryMap[p2] : p1;
            });
        }
    }, {
        key: 'queryParams',
        value: function queryParams(entity) {
            var queryStr = '' + entity.url + entity.head + entity.body;
            var params = [];
            queryStr.replace(/@(\w+)/g, function (w, p1) {
                params.push(p1);
            });
            return params;
        }
    }]);

    return RestfulService;
}(Service);

function evil(fn) {
    fn.replace(/(\s?function\s?)(\w?)(\s?\(w+\)[\s|\S]*)/g, function (w, p1, p2, p3) {
        return p1 + p3;
    });
    var Fun = Function;
    return new Fun('return ' + fn)();
}

module.exports = RestfulService;
//# sourceMappingURL=restful.js.map
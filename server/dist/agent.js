'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (agent) {

  agent.messenger.on('egg-ready', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var databaseName, _ref2, _ref3, total, sql, invokeEntitys;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            agent.logger.info('egg-ready');

            databaseName = agent.config.mysql.client.database;
            _context.next = 4;
            return agent.mysql.query('select count(1) total\n          from information_schema.COLUMNS where TABLE_SCHEMA=\'' + databaseName + '\' and table_name=\'invoke_info\'');

          case 4:
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 1);
            total = _ref3[0].total;

            if (!(total === 0)) {
              _context.next = 11;
              break;
            }

            sql = '\n          CREATE TABLE invoke_info (\n            id int(4) NOT NULL AUTO_INCREMENT,\n            name varchar(100) DEFAULT NULL,\n            descrption varchar(200) DEFAULT NULL,\n            method varchar(10) DEFAULT NULL,\n            url varchar(200) DEFAULT NULL,\n            head text,\n            body text,\n            parseFun text,\n            orginalResult longtext,\n            next varchar(50) DEFAULT NULL,\n            invokeType char(1) DEFAULT NULL COMMENT \'1:\u63A5\u53E3\u8C03\u7528\u914D\u7F6E,2:\u53EF\u8C03\u7528\u63A5\u53E3\',\n            groupName varchar(50) DEFAULT NULL,\n            PRIMARY KEY (id)\n          ) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;\n          ';
            _context.next = 11;
            return agent.mysql.query(sql);

          case 11:
            _context.next = 13;
            return agent.mysql.query('select * from invoke_info');

          case 13:
            invokeEntitys = _context.sent;

            agent.messenger.sendToApp('invokeEntitys', invokeEntitys);

            agent.messenger.on('invokeEntitys', function (data) {
              return agent.messenger.sendToApp('invokeEntitys', data);
            });

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
};
//# sourceMappingURL=agent.js.map
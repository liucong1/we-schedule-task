/**
 * grape-cms的定时任务服务
 * Created by liucong，2017-03-03 11:19
 **/

'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

//获取并发布任务
var getAndPublishTask = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var out, timeStampNow, needExecute;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return Schedule.getAllUnpublishedTask();

                    case 3:
                        out = _context2.sent;

                        //当前的时间戳
                        timeStampNow = new Date().getTime();

                        if (out.length > 0) {
                            console.log('\u3010search DB\u3011current time is\uFF1A' + new Date() + ',there are ' + out.length + ' tasks to be executed!');
                            //用于判断是否发送请求执行定时任务
                            needExecute = false;

                            out.forEach(function (value, index) {
                                if (timeStampNow >= Number(value.exceptTimestamp)) {
                                    needExecute = true;
                                    console.log('\u3010execute\u3011It\'s time to execute the task which\'s taskId is ' + value._id + '. Its parameters are ', value.toString());
                                }
                            });
                            if (needExecute) {
                                restler.get('http://127.0.0.1:9203/cms/dash/timedPublish/needPublish').on('complete', function (result) {
                                    console.log('\u3010execute result\u3011Tasks has been completed and result is', result);
                                });
                            } else {
                                console.log('\u3010abandon\u3011No tasks are expected to be executed now!');
                            }
                        }
                        _context2.next = 11;
                        break;

                    case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2['catch'](0);

                        console.log(_context2.t0);

                    case 11:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 8]]);
    }));

    return function getAndPublishTask() {
        return _ref2.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
var Schedule = require('we-schedule-mongodb');
var crypto = require('crypto');
var restler = require('restler');

mongoose.connect("mongodb://127.0.0.1:27017/cms");

getAndPublishTask();

startInterval();

//开始定时检查
function startInterval() {
    //每隔一分钟，检查一次未执行的任务
    setInterval((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        getAndPublishTask();

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    })), 1000 * 60);
}
/**
 * grape-cms的定时任务中使用的Schema
 * Created by liucong，2017-03-03 11:19
 **/

'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
    //需要操作的内容id
    contentId: {
        type: String,
        required: true
    },
    //任务类型：data|article|page
    contentType: {
        type: String,
        required: true,
        enum: ['data', 'article', 'page']
    },
    createUserId: {
        type: String,
        required: true
    },
    //最近一次修改任务的用户Id
    lastEditUserId: {
        type: String,
        required: true
    },
    //取消任务的用户Id
    calcelUserId: {
        type: String,
        required: false
    },
    //设定的发布时间
    exceptTimestamp: {
        type: String,
        required: true
    },
    //用途说明
    purpose: {
        type: String,
        required: true
    },
    //发布状态，init|process|success|fail|cancel|timeout
    state: {
        type: String,
        required: true,
        enum: ['init', 'process', 'success', 'fail', 'cancel', 'timeout']
    },
    //任务开始执行时间
    beginTimestamp: {
        type: String,
        required: false
    },
    //任务执行结束时间
    endTimestamp: {
        type: String,
        required: false
    },
    //当前重试次数
    currentRetry: {
        type: Number,
        required: true,
        default: 0
    },
    //最大重试次数
    maxRetry: {
        type: Number,
        required: false,
        default: 3
    }
}, {
    versionKey: false,
    minimize: false,
    collection: 'schedule',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

/**
 * 根据内容id，确认是否存在尚未发布的任务
 * contentId String 内容id
 * return Boolean
 */
scheduleSchema.statics.isUnpublishedExist = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(contentId) {
        var task, response;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        task = mongoose.model('Schedule');
                        _context.next = 3;
                        return task.find({ contentId: contentId, state: { "$in": ["init", "process"] } }).exec();

                    case 3:
                        response = _context.sent;
                        return _context.abrupt('return', response.length > 0);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * 获取所有尚未发布的任务
 * return Array
 */
scheduleSchema.statics.getAllUnpublishedTask = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var task, response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    task = mongoose.model('Schedule');
                    _context2.next = 3;
                    return task.find({ state: { "$in": ["init", "process"] } }).exec();

                case 3:
                    response = _context2.sent;
                    return _context2.abrupt('return', response);

                case 5:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, this);
}));

/**
 * 任务是否能被修改，只有init状态的任务才能修改
 * return Boolean
 */
scheduleSchema.statics.taskCanBeModified = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(taskId) {
        var task, response;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        task = mongoose.model('Schedule');
                        _context3.next = 3;
                        return task.find({ _id: taskId, state: 'init' }).exec();

                    case 3:
                        response = _context3.sent;
                        return _context3.abrupt('return', response.length > 0);

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function (_x2) {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * 更新任务信息
 * taskId String 任务id
 * state String 更新后的状态
 * return Object
 */
scheduleSchema.statics.updateTask = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(taskId, data) {
        var task, response;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        task = mongoose.model('Schedule');
                        _context4.next = 3;
                        return task.update({ _id: taskId }, { $set: data }).exec();

                    case 3:
                        response = _context4.sent;
                        return _context4.abrupt('return', response);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function (_x3, _x4) {
        return _ref4.apply(this, arguments);
    };
}();

/**
 * 通过任务id查找任务详情
 * taskId string 任务id
 * return Object
 */
scheduleSchema.statics.findTaskById = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(taskId) {
        var task, response;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        task = mongoose.model('Schedule');
                        _context5.next = 3;
                        return task.findOne({ _id: taskId }).exec();

                    case 3:
                        response = _context5.sent;
                        return _context5.abrupt('return', response);

                    case 5:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function (_x5) {
        return _ref5.apply(this, arguments);
    };
}();

/**
 * 通过文档id查找任务详情
 * taskId string 任务id
 * return Object
 */
scheduleSchema.statics.findTaskByContentId = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(contentId, condition) {
        var task, findParams, response;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        task = mongoose.model('Schedule');
                        findParams = { contentId: contentId };

                        if (condition) {
                            (0, _assign2.default)(findParams, findParams, condition);
                        }

                        _context6.next = 5;
                        return task.find(findParams).exec();

                    case 5:
                        response = _context6.sent;
                        return _context6.abrupt('return', response);

                    case 7:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function (_x6, _x7) {
        return _ref6.apply(this, arguments);
    };
}();

scheduleSchema.statics.findTaskByCondition = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(condition) {
        var task, response;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        task = mongoose.model('Schedule');
                        _context7.next = 3;
                        return task.find(condition).exec();

                    case 3:
                        response = _context7.sent;
                        return _context7.abrupt('return', response);

                    case 5:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function (_x8) {
        return _ref7.apply(this, arguments);
    };
}();

var Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
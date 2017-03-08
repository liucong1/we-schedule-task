/**
 * grape-cms的定时任务中使用的Schema
 * Created by liucong，2017-03-03 11:19
 **/

'use strict';

const mongoose = require('mongoose');

let scheduleSchema = new mongoose.Schema(
    {
        //需要操作的内容id
        contentId:{
            type : String,
            required : true
        },
        //任务类型：data|article|page
        contentType:{
            type : String,
            required : true,
            enum : ['data', 'article', 'page']
        },
        createUserId:{
            type : String,
            required : true
        },
        //最近一次修改任务的用户Id
        lastEditUserId:{
            type : String,
            required : true
        },
        //取消任务的用户Id
        calcelUserId:{
            type : String,
            required : false
        },
        //设定的发布时间
        exceptTimestamp:{
            type : String,
            required : true
        },
        //用途说明
        purpose:{
            type : String,
            required : true
        },
        //发布状态，init|process|success|fail|cancel|timeout
        state:{
            type : String,
            required : true,
            enum: ['init', 'process', 'success', 'fail', 'cancel', 'timeout']
        },
        //任务开始执行时间
        beginTimestamp:{
            type : String,
            required : false
        },
        //任务执行结束时间
        endTimestamp:{
            type : String,
            required : false
        },
        //当前重试次数
        currentRetry:{
            type : Number,
            required : true,
            default : 0
        },
        //最大重试次数
        maxRetry:{
            type : Number,
            required : false,
            default : 3
        }
    },
    {
        versionKey: false,
        minimize : false,
        collection : 'schedule',
        timestamps: { createdAt: 'createdAt', updatedAt : 'updatedAt' }
    }
);

/**
 * 根据内容id，确认是否存在尚未发布的任务
 * contentId String 内容id
 * return Boolean
 */
scheduleSchema.statics.isUnpublishedExist = async function(contentId){
    const task = mongoose.model('Schedule');
    let response = await task.find({ contentId: contentId,state: {"$in":["init","process"]} }).exec();
    return response.length > 0;
};

/**
 * 获取所有尚未发布的任务
 * return Array
 */
scheduleSchema.statics.getAllUnpublishedTask = async function(){
    const task = mongoose.model('Schedule' );
    let response = await task.find({ state: {"$in":["init","process"]} }).exec();
    return response;
};

/**
 * 任务是否能被修改，只有init状态的任务才能修改
 * return Boolean
 */
scheduleSchema.statics.taskCanBeModified = async function(taskId){
    const task = mongoose.model('Schedule' );
    let response = await task.find({ _id: taskId,state: 'init' }).exec();
    return response.length > 0;
};

/**
 * 更新任务信息
 * taskId String 任务id
 * state String 更新后的状态
 * return Object
 */
scheduleSchema.statics.updateTask = async function(taskId,data){
    const task = mongoose.model('Schedule' );
    let response = await task.update({_id:taskId },{$set:data}).exec();
    return response;
};

/**
 * 通过任务id查找任务详情
 * taskId string 任务id
 * return Object
 */
scheduleSchema.statics.findTaskById = async function(taskId){
    const task = mongoose.model('Schedule');
    let response = await task.findOne({ _id : taskId }).exec();
    return response;
};

/**
 * 通过文档id查找任务详情
 * taskId string 任务id
 * return Object
 */
scheduleSchema.statics.findTaskByContentId = async function(contentId,condition){
    const task = mongoose.model('Schedule');
    let findParams = { contentId : contentId };
    if(condition){
        Object.assign(findParams,findParams,condition);
    }

    let response = await task.find(findParams).exec();
    return response;
};

scheduleSchema.statics.findTaskByCondition = async function(condition){
    const task = mongoose.model('Schedule');
    let response = await task.find(condition).exec();
    return response;
}

let Schedule = mongoose.model('Schedule', scheduleSchema );

module.exports = Schedule;
/**
 * grape-cms的定时任务服务
 * Created by liucong，2017-03-03 11:19
 **/

'use strict';

const http = require('http');
const querystring = require('querystring');
const mongoose = require('mongoose');
const Schedule = require('we-schedule-mongodb');
const request = require('request');

mongoose.connect("mongodb://127.0.0.1:27017/cms");

let url = "http://127.0.0.1:9203/cms/dash/timedPublish/doPublish";

getAndPublishTask();

startInterval();

//开始定时检查
function startInterval(){
        //每隔一分钟，检查一次未执行的任务
        setInterval(async function(){
            getAndPublishTask();
        },1000*60);
}

//获取并发布任务
async function getAndPublishTask(){
    try{
        let out = await Schedule.getAllUnpublishedTask();
        //当前的时间戳
        let timeStampNow =  new Date().getTime();
        if(out.length > 0){
            console.log(`$$start$$ 当前时间戳：${timeStampNow} 将执行定时任务：${out.length}个`);
            out.forEach(
                (value,index) => {
                    console.log(`$$execute$$ 开始执行第${index}个任务，任务id为${value._id}`);
                    if( timeStampNow >= Number(value.exceptTimestamp) ){
                        console.log(`任务id为${value._id}的定时任务已到执行时间。post参数为`,value);
                        request.post(url,{json:value},function(error,response,body){
                            console.log(`_id为${value._id}定时任务的第${value.currentRetry}次执行结果为：`,body);
                        });
                    }else{
                        console.log(`$$Not yet time$$ 未到执行时间，任务稍后执行！`);
                    }
                }
            );
        }
    }catch(e){
        console.log(e);
    }
}

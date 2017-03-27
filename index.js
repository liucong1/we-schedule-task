/**
 * grape-cms的定时任务服务
 * Created by liucong，2017-03-03 11:19
 **/

'use strict';

const mongoose = require('mongoose');
const Schedule = require('we-schedule-mongodb');
const restler = require('restler');

mongoose.connect("mongodb://127.0.0.1:27017/cms");

getAndPublishTask();

startInterval();

//开始定时检查
function startInterval(){
    //每隔一分钟，检查一次未执行的任务
    setInterval(function(){
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
            console.log(`【search DB】current time is：${new Date()},there are ${out.length} tasks to be executed!`);
            //用于判断是否发送请求执行定时任务
            let needExecute = false;
            out.forEach(
                (value,index) => {
                    if( timeStampNow >= Number(value.exceptTimestamp) ){
                        needExecute = true;
                        console.log(`【execute】It's time to execute the task which's taskId is ${value._id}. Its parameters are `,value.toString());
                    }
                }
            );
            if(needExecute){
                restler.get('http://127.0.0.1:9203/cms/dash/timedPublish/needPublish').on('complete', function(result) {
                    console.log(`【execute result】Tasks has been completed and result is`, result );
                });
            }else{
                console.log(`【abandon】No tasks are expected to be executed now!`);
            }
        }
    }catch(e){
        console.log(e);
    }
}

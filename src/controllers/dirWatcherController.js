import taskModel from "../models/taskModel.js";
import configModel from "../models/configModel.js";

import {
    startDirWatcherService,
    stopDirWatcherService,
} from "../services/dirWatchService.js";

// function for starting the Watcher
const startTask = async(req, res) => {
    console.log('req is in startTask');
  try{
    await startDirWatcherService()
    res.status(200).json({message:'Task started'})
  }catch(error){
console.error("Starting Task Error", error)
res.status(500).json({error:'Failed to start task'})
  }
};


// function for stop the Watcher
const stopTask = (req, res) => {
    try{

        stopDirWatcherService();
        
        res.status(200).send({ message: 'Task stopped' });
    }catch(error){
        console.error('Stopping Task Error :',error)
        res.status(500).json({ error: 'Failed to stop task' });
    }
};


// function for fetch all task
const getTaskRuns = async (req, res) => {
   try{
    const taskRuns=await taskModel.find()
    if(taskRuns.length<=0){
        return res.json({message:"Task is Empty "})
    }
   return res.json(taskRuns)
   }catch(error){
    console.error('Error While Fetching Task',error)
    return res.status(500).json({ error: 'Failed to fetch the task ' });
   }
};

// function for update the config data

const updateConfig=async (req,res)=>{
    try{

        
    }catch(error){
        res.status(500).json({error:error.message})
    }
}


export { startTask, stopTask, updateConfig, getTaskRuns };
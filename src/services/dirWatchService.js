import fs from 'fs';
import cron from 'node-cron'
import chokidar from 'chokidar'
import path from 'path';
import TaskRun from '../models/taskModel.js';
import configModel from '../models/configModel.js';


let task

let watcher

let directory
let interval
let magicString

const getConfig=async()=>{
    try{
        const config=await configModel.findOne()

        if(config){
            directory=path.resolve(__dirname,'..',config.directory)
            console.log(directory,'dd');
            interval=config.interval
            magicString=config.magicString
        }else{
            console.error('No configuration in database')
            if(watcher){
                watcher.close()
            }
        }
    }catch(error){
        console.error('Error fetching configuration:',error.message)
    }
}
   

let existingFiles=[]
let initialFiles=[]


const countMagicString=(filePath)=>{
    const fileContent=fs.readFileSync(filePath,'utf-8')
    const regex=new RegExp(magicString,'g')
    return (fileContent.match(regex)||[]).length
}

const  runTask=async()=> {
    try {
      const startTime = new Date();
      const filesAdded = [];
      const filesDeleted = [];
  
      console.log(existingFiles, initialFiles, "inif", filesAdded, "add", filesDeleted, "delet")
  
      // Calculate files added 
  
      const addedFiles = existingFiles.filter(file => !initialFiles.includes(file));
      filesAdded.push(...addedFiles);
  
      // Calculate files deleted 
  
      const deletedFiles = initialFiles.filter(file => !existingFiles.includes(file));
      filesDeleted.push(...deletedFiles);
  
      console.log(initialFiles, "inif", filesAdded, "add", filesDeleted, "delet")
  
  
      // Calculate magic string count
  
      let magicStringCount = 0;
      for (const file of existingFiles) {
        magicStringCount += countMagicString(file);
      }
  
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
  
      // Save task details to the database
      const taskData = new TaskRun({
        startTime,
        endTime: new Date(),
        duration,
        filesAdded,
        filesDeleted,
        magicStringCount,
        status: 'success',
        directory,
        interval,
        magicString,
      });
  
  
      console.log(existingFiles, "after run")
  
      await taskData.save();
  
      console.log('Task completed successfully');
    } catch (err) {
      console.error('Error running task:', err);
    }
  }



const startDirWatcherService = async() => {
    
    console.log('startDirWatcherService');
await getConfig()
    
watcher = chokidar.watch(directory, { persistent: true });

// Event listener for file addition

watcher.on('add', (filePath) => {
  existingFiles.push(filePath);
  console.log('File added:', filePath);
});

// Event listener for file deletion

watcher.on('unlink', (filePath) => {
  existingFiles = existingFiles.filter(file => file !== filePath);
  console.log('File deleted:', filePath);
});

console.log(existingFiles)

// Start the background task when watcher is ready

watcher.on('ready', () => {
  initialFiles = [...existingFiles];
  console.log(`Watcher initialized. Monitoring directory: ${directory}`);
  start();
});

// Handle watcher errors
watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});
};

 const start=()=>{
    task = cron.schedule(interval, runTask);
    console.log(`Background task started`);
    console.log(existingFiles, "start")
 }

const stopDirWatcherService = () => {
    if (watcher) {
        watcher.close();
      }
      if (task) {
        task.stop();
        console.log('Background task stopped');
      } 
};

process.on('exit', () => {
    stop();
  });

export {  startDirWatcherService, stopDirWatcherService };

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




const startDirWatcherService = () => {
    let intervalId;
    console.log('startDirWatcherService');
    intervalId = async () => {
    console.log('intervalId');

        const startTime = new Date();
        let filesAdded = [];
        let filesDeleted = [];
        let magicStringCount = 0;
        let status = 'success';

        try {
            const files = fs.readdirSync(config.directoryToWatch);
            for (const file of files) {
                const filePath = path.join(config.directoryToWatch, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const count = (content.match(new RegExp(config.magicString, 'g')) || []).length;
                magicStringCount += count;
            }
        } catch (error) {
            status = 'failed';
            console.error(error);
        }

        const endTime = new Date();
        const totalTime = (endTime - startTime) / 1000;

        const taskRun = new TaskRun({
            startTime, endTime, totalTime, filesAdded, filesDeleted, magicStringCount, status
        });
        await taskRun.save();
    }
    return intervalId;
};

const stopDirWatcherService = (watcher) => {
    clearInterval(watcher);
};

const getTaskRunsService = async () => {
    return await TaskRun.find();
};

export {  startDirWatcherService, stopDirWatcherService };

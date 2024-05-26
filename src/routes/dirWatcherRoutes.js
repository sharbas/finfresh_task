import express from 'express';
import {  startTask, stopTask, updateConfig, getTaskRuns  } from '../controllers/dirWatcherController.js';

const router = express.Router();

router.post('/start', (req, res, next) => {
    console.log('Received POST request for /start endpoint');
    startTask(req, res, next);
});
router.post('/stop', stopTask);
router.put('/config', updateConfig);
router.get('/tasks', getTaskRuns);

export default router;

import express from 'express';
import connectDB from './config/db.js';
import dirWatcherRoutes from './routes/dirWatcherRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/api/dir-watcher', dirWatcherRoutes);

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);
});

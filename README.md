# DirWatcher Application

DirWatcher is a Node.js application that monitors a specified directory at a scheduled interval, counts occurrences of a configured magic string in all files, and logs the results. It provides a REST API to manage the task and fetch task details.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Running the Application](#running-the-application)
- [Additional Improvements](#additional-improvements)

## Prerequisites

- Node.js (>= 14.x.x)
- npm (>= 6.x.x)
- A running instance of MongoDB

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/dirwatcher.git
    cd dirwatcher
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    DB_CONNECTION_STRING=mongodb://localhost:27017/dirwatcher
    DIRECTORY_TO_WATCH=/path/to/directory
    MAGIC_STRING=your_magic_string
    INTERVAL=60000 # interval in milliseconds
    ```

4. Start the application:
    ```bash
    npm start
    ```

## Database Schema

### TaskRun Schema

```javascript
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    startTime:  { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
    filesAdded: { type: [String], default: [] },
    filesDeleted: { type: [String], default: [] },
    magicStringCount: { type: Number, default: 0 },
    status: { type: String, enum: ['in progress', 'success', 'failed'], default: 'in progress' },
    directory: { type: String },
    interval: { type: String },
    magicString: { type: String }
});

export default mongoose.model('TaskRun', taskSchema);
Config Schema
javascript
Copy code
import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
    directory: { type: String },
    interval: { type: String },
    magicString: { type: String }
});

export default mongoose.model('Config', ConfigSchema);

**API Documentation**

**Start Task**

URL: /start
Method: POST
Description: Starts the background task manually.
Response:
json
Copy code
{
    "message": "Task started successfully."
}

**Stop Task**

URL: /stop
Method: POST
Description: Stops the background task manually.
Response:
json
Copy code
{
    "message": "Task stopped successfully."
}

**Update Configuration**

URL: /config
Method: PUT
Description: Updates the configuration for the directory to watch, interval, and magic string.
Body:
json
Copy code
{
    "directory": "/new/path/to/directory",
    "interval": 30000,
    "magicString": "new_magic_string"
}
Response:
json
Copy code
{
    "message": "Configuration updated successfully."
}

**Get Task Runs**

URL: /tasks
Method: GET
Description: Retrieves the details of all task runs.
Response:
json
Copy code
[
    {
        "startTime": "2023-05-27T12:00:00Z",
        "endTime": "2023-05-27T12:05:00Z",
        "duration": 300000,
        "filesAdded": ["file1.txt"],
        "filesDeleted": ["file2.txt"],
        "magicStringCount": 42,
        "status": "success"
    },
    ...
]

Running the Application
Ensure MongoDB is running.
Start the application using npm start.
Use the provided API endpoints to manage and monitor the background task.

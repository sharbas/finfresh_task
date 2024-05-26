import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    startTime:  { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
    filesAdded: { type: [String], default: [] },
    filesDeleted: { type: [String], default: [] },
    magicStringCount: { type: Number, default: 0 },
    status: { type: String, enum: ['in progress', 'success', 'failed'], default: 'in progress' },
    directory:{type:String},
      interval:{type:String},
      magicString:{type:String}
});

export default  mongoose.model('TaskRun', taskSchema)

import mongoose from 'mongoose';

//define the structure our document - POST
const postSchema = mongoose.Schema({
    title: String,
    message:String,
    name:String,
    creator:String,
    tags: [String],
    selectedFile:String,
    likes:{
        type:[String],
        default:[],
    },
    createdAt:{
        type:Date,
        default: new Date()
    }
})

const postMessage = mongoose.model('PostMessage',postSchema);

export default postMessage;
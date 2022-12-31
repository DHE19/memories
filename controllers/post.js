import mongoose from "mongoose";
import postMessage from "../models/postMessage.js";



export const getPostsBySearch = async  (req,res) =>{
    const {searchQuery,tags} = req.query;
    try {
        const title = new RegExp(searchQuery,'i')
        //la solicitud dice lo siquiente: 'o encuentras un post por el titulo o encontras el post por el array de etiquetas (in: dentro del array divide por comas)
        const posts = await postMessage.find({$or:[{title},{tags:{$in: tags?.split(',')}}]})
        res.json(posts);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}
//return the posts from the db
export const getPosts = async(req,res) =>{
    const {page} = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // obtiene el index inicial de cada pagina
        //return the number of all documents saved in posts
        const total = await postMessage.countDocuments({});
        //find all the posts
        const posts = await postMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
        //send the response as a json
        res.status(200).json({data: posts,currentPage:Number(page), numberOfPages:Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}


//create a new posts
export const createPost = async (req, res) =>{
    //get all the data by the request body
    const post = req.body;
    
    const finalPost = {...post, creator: req.userId, createdAt: new Date().toISOString()}
    //crete a new post
    const newPost = new postMessage(finalPost);

    try {
        //save the post on the db
        await newPost.save();
        //return the post
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message:error.message});
    }
}



export const updatedPost = async (req,res) =>{
    const {id:_id} = req.params;
    const post = req.body;
    //check if the Id exists
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await postMessage.findByIdAndUpdate(_id, post, {new: true});
    
    res.json(updatedPost);
   
}

//TODO: evaluar si el que solicito eliminar el post es el dueño del mismo, para ellos se requiere los siguientes datos:
//id del post, id del solicitante e id del que creo el posr (creator)
export const deletePost = async (req,res) =>{
    const {id:_id} = req.params;

    //existe el post??
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No exist this id');
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No exist this id');

     await postMessage.findByIdAndRemove(_id);
     
     res.json('post has been deleted successfully');
    }
    
    
    export const likePost = async ( req,res) => {
        const {id:_id} = req.params;
        if(!req.userId) return res.json({message:'no autenticado'});
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No exist this id');

        const post = await postMessage.findById(_id);
        
        const index = post.likes.findIndex((id) =>id === String(req.userId));

        if(index === -1){
            //like post
            post.likes.push(req.userId);
        }else{
            //dislike post
            post.likes = post.likes.filter ((id) => id !== String(req.userId));
        }

        const updatedPost = await postMessage.findByIdAndUpdate(_id,post, {new: true});

        res.json(updatedPost);
}
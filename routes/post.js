import express from "express";
import { getPostsBySearch,getPosts, createPost, updatedPost, deletePost,likePost } from "../controllers/post.js";
import auth from "../middleware/auth.js";

const router = express.Router();
//need controllores
router.get('/search',getPostsBySearch);
router.get('/',getPosts);
router.post('/',auth,createPost);
router.patch('/:id', auth,updatedPost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost',auth,likePost);


export default router;
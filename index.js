import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import postRoutes from './routes/post.js'
import userRoutes from './routes/users.js'
//creamos nuestra app con express
const app = express();
dotenv.config();

//set a  middleware (body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.)
app.use(bodyParser.json({limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
//is a browser security feature that restricts cross-origin HTTP requests with other servers and specifies which domains access your resources.
app.use(cors());
app.use('/posts',postRoutes);
app.use('/user',userRoutes)

app.get('/',(req,res) =>{
    res.send('APP IS RUNRING')
})
//our connection to mongodb
const CONNECTION_URL = process.env.MONGO_URI;
//the port
const PORT = process.env.PORT || 5000;
//define mongoose options
mongoose.set('strictQuery',false);
//make the connection to mongoose db
mongoose.connect(CONNECTION_URL)
.then(() => app.listen(PORT,() => console.log('server runing on port 5000')))
.catch(err => console.log(err));



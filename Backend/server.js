import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import cookieParser from "cookie-parser";

const app = express();

await connectDB();

//Middleware
app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(express.json());

app.use(cookieParser());

// routes
app.get('/', (req, res)=> res.send("API  is working"))
app.use('/api/admin' , adminRouter)
app.use('/api/blog' , blogRouter)


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('server is running on port ' + PORT)
})

export default app;            
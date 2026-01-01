import jwt from "jsonwebtoken"
import Blog from "../models/Blog.js"
import Comment from "../models/Comment.js"
import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";


export const adminLogin = async (req, res) => {
    // try{
    //     const {email,password} = req.body

    //     if(email!== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
    //         return res.json({success: false, message: "Invalid Credentials" })
    //     }

    //     const token = jwt.sign({email}, process.env.JWT_SECRET)
    //     res.json({success: true, token})
    // }catch (error){
    //     res.json({success: false, message : error.message})
    // }
    // const{email, password} = req.body;
    // try{
    //     if(!email || !password ){
    //         return res.status(400).json ({message: "Please fill required fields"});
    //     }
    //     const user = await User.findOne({email}).select("+password");
    //     if(!user.password){
    //         return res.status(400).json ({message: "User password is missing"});
    //     }

    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if(!user || !isMatch){
    //         return res.status(400).json({message: "Invalid email or password"});
    //     }
        
    //     const token= await createTokenAndSaveCookies(user._id, res);
    //     res.status(200).json({message: "User logged in successfully", user:{
    //         _id: user._id,
    //         name:user.name,
    //         email:user.email,
            
    //     },token:token });
    // }catch(error){
    //     console.log(error)
    //     return res.status(500).json({error: "Internal server error"});
    // }

    
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill required fields" });
        }

        // CHECK IF USER EXISTS FIRST (FIX)
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });  // FIX
        }

        if (!user.password) {
            return res.status(400).json({ success: false, message: "User password is missing" });
        }

        // CHECK PASSWORD MATCH
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // CREATE TOKEN
        const token = await createTokenAndSaveCookies(user._id, res);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};




export const adminRegister=async (req, res)=>{
   try {
     const {email, name, password, phone} = req.body;
    if(!email || !name || !password || !phone ){
        return res.status(400).json({ message: "Please fill required fields"});

    }
    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({message: "User already exists with this email"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User ({
        email, 
        name, 
        password :  hashedPassword ,
        phone, 
        });
    await newUser.save();
    if(newUser){
        const token = await createTokenAndSaveCookies(newUser._id,res)
        console.log(token);
        res.status(201).json({message: "User registered successfully", newUser, token: token});
    }
   } catch (error) {
       console.log(error);
       return res.status(500).json ({error: "Internal Server error"});
   }
};


export const getAllBlogsAdmin = async (req,res) =>{
    try{
         const blogs = await Blog.find({}).sort({createdAt: -1});
         res.json({success: true, blogs})
    }catch (error){
        res.json({success: false, message : error.message})
    }
}

export const getAllComments = async (req, res) =>{
    try{
        //  const comments = await (await Comment.find({}).populate("blog")).sort({createdAt: -1})
        const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });

         res.json({success: true, comments})
    }catch (error){
        res.json({success: false, message : error.message})
    }
}


export const  getDashboard= async (req, res) =>{
    try{
    //      const recentBlogs = await (await Blog.find({})).sort({createdAt: -1}).limit(5);
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);

         const blogs= await Blog.countDocuments();
         const comments = await Comment.countDocuments();
         const  drafts = await Blog.countDocuments({isPublished: false});
         const dashboardData ={
            blogs, comments,drafts, recentBlogs
         }
        //  res.json({success: true, dashboardData})
        res.json({ success: true, dashboardData })

    }catch (error){
        res.json({success: false, message : error.message})
    }
}


export const deleteCommentById = async (req, res) =>{
    try{
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message:"Comment deleted successfully"})
    }catch (error){
        res.json({success: false, message : error.message})
    }
}


export const approveCommentById = async (req, res) =>{
    try{
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({success: true, message:"Comment Approved successfully"})
    }catch (error){
        res.json({success: false, message : error.message})
    }
}     

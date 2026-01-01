// import jwt from "jsonwebtoken";

// const auth= (req, res, next)=>{
//   const token= req.headers.authorization;

//   try{
//           jwt.verify(token,process.env.JWT_SECRET)
//           next();
//   }catch(error){
//          res.json({success:false , message: "Invalid token" })
//   }
// }

// export default auth;     

import jwt from "jsonwebtoken";

 const auth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
export default auth;
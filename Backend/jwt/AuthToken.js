// import jwt from "jsonwebtoken";
// import { User } from "../models/User.model.js";

// const createTokenAndSaveCookies = async(userId, res)=>{
//     const token= jwt.sign({userId},process.env.JWT_SECRET_KEY,{
//         expiresIn: "7d"
//     })
//     res.cookie("jwt", token,{
//         httpOnly: true,
        
//         secure: true,
//         sameSite: "strict"
//     })
//        await User.findByIdAndUpdate(userId,{token})
//        return token
// }
// export default createTokenAndSaveCookies

import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    // SET COOKIE
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,           // true for HTTPS (use false only on localhost)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // OPTIONAL: store token in DB
    await User.findByIdAndUpdate(userId, { token });

    return token;
};

export default createTokenAndSaveCookies;

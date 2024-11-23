import JsonWebToken  from "jsonwebtoken";
import "dotenv/config"
const isAuth= async(req,res,next)=>{
    try{
        const token= req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:'User not Authenticated',
                success:false
            })
        }
        const decode= await JsonWebToken.verify(token, process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:'Invalid Token',
                success:false
            })
        }
        req.id= decode.userId;
        next()
    }
    catch(error){
        console.log(error);
    }
}

export default isAuth;
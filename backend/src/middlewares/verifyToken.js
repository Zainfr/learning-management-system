import jwt from 'jsonwebtoken';

export const verifyToken = (roles = []) => {
    return (req,res,next) => {
        const token = req.headers.authorization?.split(' ')[1];
    
        if(!token){
            return res.status(403).json({ success: false, message : "Access Denied, no token provided"});
        }
        
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
    
            if(roles.length && !roles.includes(req.userType)){
                return res.status(401).json({ success : false, message : "Unauthorized: Insufficient role permission"})
            }

            next();
        } catch (error) {
            return res.status(401).json({success : false, message: "Invalid Token"});
        }
    };
} 

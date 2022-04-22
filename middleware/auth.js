const config= require('config');
const jwt=require('jsonwebtoken');

module.exports=function restroauth(req,res,next){
    const token=req.header('x-auth-token');
    if(!token)return res.status(401).send('Acess Denied');
    try{
        const decoded= jwt.verify(token,config.get('JwtPrivatekey'));  
        req.user=decoded;
        //console.log('no error');
        next();
    }catch(err){
        return res.status(404).send('Token expired please login');
        
    }

}
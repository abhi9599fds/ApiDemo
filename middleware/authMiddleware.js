import { config } from "dotenv";
import jwt from "jsonwebtoken";
const { verify } = jwt;

config();

function jwtTokenAuth(req ,res ,next)
{
    try 
    {
        if(req.headers.authorization != null )
        {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = verify(token , process.env.TokenKey ,
                (err ,user ) =>{
                    console.log(user)
                    if(err){
                        return res.status(401).send({
                            "msg" : "Unauthorize"
                        });
                    }

                    // if(user.id !== req.body.uid){
                    //     return res.status(401).send({
                    //         "msg" : "Unauthorize"
                    //     });
                    // } 
                    
                    next();
                }
            );
        }
        else{
            res.status(403).send({
                "msg" : "Unauthorize"
            });
        }
    } 
    catch (error) {
        res.status(400).send({
            "msg" : error.message
        });
        
    }
}

export { jwtTokenAuth };
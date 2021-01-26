import { UserModel } from "../models/userModel.js";
import { randomBytes ,createHash } from "crypto";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
const { sign } = jwt;

config();

async function createUser(req ,res) 
{
    try {
        let salt = randomBytes(15).toString('hex').slice(0,15);
        if(req.body.password != null){
            let passhash = createHash('sha512' ,salt).
                       update(req.body.password).
                       digest('hex'); 
            
            const user = {
                passHash : passhash,
                passSalt : salt,
                academy : req.body.academy,
                typeUser : req.body.typeUser,
                name : req.body.name,
                email : req.body.email,
                phn : req.body.phn,
                profilePic : req.body.profilePic,
            }

            await UserModel.create(user).then(() => {
                res.json({"msg" : "Created"})
            });
        }
        else{
            return res.status(400).send({msg : "PassWord Required"});
        }  
    } 
    
    catch (error) {
        res.status(400).json({
            "msg" : error.message
        });
    }
}

async function login(req ,res )
{
    try 
    {
        await UserModel.findOne({
            attributes : [
                'id','email' ,'passSalt','passHash','phn','name','academy'
                ,'typeUser',
            ],
            where:{
                email : req.body.email
            }
        }).then (user => {
            if (user != null){
                const token = sign({ id : user.id, 
                    email : user.email 
                },process.env.TokenKey);
                
                res.send({
                    token : token,
                    data : {
                        id : user.id,
                        email : user.email,
                        phn : user.phn,
                        name : user.name,
                        academy : user.academy,
                        typeUser : user.typeUser
                    }
                });
            }
            else 
               return res.status(400).send( {"msg" :"User Not Found"} );

        });
    } 
    catch (error) 
    {
        res.status(400).json({
            "msg" : error.message
        });
    }
}

async function deleteAll(req ,res)
{
    try 
    {
        await UserModel.destroy({
            where : {}
        }).then(() => {
            res.send({
                msg : "Deleted All Rows"
            })
        });    
    } 
    catch (error) 
    {
        res.status(400).send({
            msg : error.message
        })     
    }
}


async function deleteOne(req ,res)
{
    try 
    {
        let rows = await UserModel.destroy({
            where : {
                id : req.body.id
            }
        });
        if(rows == 1){
            res.send({
                msg : "Deleted"
            })
        }
        else{
            res.send({
                msg : "Data Not Found"
            })
        }    
    } 
    catch (error) 
    {
        res.status(400).send({
            msg : error.message
        })     
    }
}


export { createUser ,login ,deleteAll ,deleteOne };
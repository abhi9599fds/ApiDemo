import { UserModel } from "../models/userModel.js";
import { PostModel } from "../models/postModel.js";
import { ContestModel } from "../models/contestModel.js";
import { LikeModel } from "../models/likesModel.js";
import { randomBytes ,createHash , } from "crypto";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { FollowModel } from "../models/followModel.js";

import seq from "sequelize";

const { Op,literal } = seq;
const { sign  } = jwt;

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
                typeUser : 'user',
                name : req.body.name,
                email : req.body.email,
                phn : req.body.mobile,
                profilePic : req.body.profile_pic,
            }

            await UserModel.create(user).then(() => {
                return res.json({"msg" : "Created"})
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

async function createAdminUser(req ,res) 
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
                typeUser : 'owner',
                name : req.body.name,
                email : req.body.email,
                phn : req.body.mobile,
                bio : req.body.bio === undefined || req.body.bio=== null ? '' : req.body.bio,
                profilePic : req.body.profile_pic === undefined || req.body.profile_pic === null ? '' : req.body.profile_pic,
                socialHandle : req.body.social_handle === undefined || req.body.social_handle === null ? '' : req.body.social_handle
            }

            await UserModel.create(user).then(() => {
                return res.json({"msg" : "Created"})
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
        let user = await UserModel.findOne({
            attributes : [
                'id','email' ,'passSalt','passHash','phn','name','academy'
                ,'typeUser',
            ],
            where:{
                email : req.body.email
            }
        });

        if (user != null){
            var newhash = createHash('sha512',user.passSalt).
                           update(req.body.password).
                           digest('hex');
            if(newhash != user.passHash){
                return res.status(401).send({
                    msg : "Password Incorrect"
                });
            }

            const token = sign({ 
                id : user.id, 
                email : user.email 
            },process.env.TokenKey,{
                expiresIn : "4d"
            });
                
                
            res.send({
                
                data : {
                    message : "VALID",
                    id : user.id,
                    email : user.email,
                    mobile : user.phn,
                    name : user.name,
                    academy : user.academy,
                    type : user.typeUser,
                    token : token,
                    bio : user.bio,
                    profile_pic : user.profilePic
                }
            });
        }
        else 
            return res.status(400).send( {"msg" :"User Not Found"} );
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
                id : req.body.uid
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

async function getUserAll(req,res){
    try{

        await UserModel.findAll({
            where :{}
        }).then(data => {
            return res.send({
                data :data
            });
        });
    }
    catch(err){
        res.status(400).send({
            msg :err.message
        });
    }
}

async function editProfilePic(req , res){
    try {
        let rows = await UserModel.update({
            profilePic : req.body.profile_pic
        },{
            where : {
                id : req.body.uid
            }
        })
        if(rows.length[0] == 0){
            return res.status(400).send({
                msg:"Error"
            })
        }
        else {
            return res.json({
                msg : "Updated"
            });  
        }
        
    } catch (error) {
        return res.status(400).send({
            msg:error.message
        })
        
    }
}


async function usernameExists(req ,res) {

    try {
        let rows = await UserModel.findAll({
            where : req.body.academy
        });

        if (rows.length > 0){
            return res.status(400).json({
                msg : "USERNAME EXIST"
            });
        }
        else
        {
            return res.status(200  ).json({
                msg : "ALRIGHT"
            });
        }
        
    } catch (error) {
        return res.status(400).send({
            msg:error.message
        });
    }
    
}

async function getById(req,res) {
    try {
        let user = await UserModel.findOne({
            where :{
                id : req.body.uid
            },
            attributes : ['id', 'name', 'profilePic', 'followers' ,'following'],
            raw : true
        });

        if(user!= null){
          
          user['isFollowing'] = await FollowModel.count({
                where : {
                    [Op.and] : {
                        followerUid: req.body.my_uid, 
                        followingUid: req.body.uid
                    }
                }
            }) > 0 ? true : false;
            

            let posts = await PostModel.findAll({
                include : [{
                    model : ContestModel ,
                    attributes : [['contestName','cname'],'talent'],
                    required :true
                },{
                    model : UserModel,
                    attributes : ['academy'],
                    required :true
                },{
                    model : LikeModel, 
                    attributes : [['like','liked']],
                    where : {
                        userId : req.body.my_uid
                    },
                    required : false
                }],
                where : {
                    userId : req.body.uid
                },
                attributes : [['id' ,'postId'],'contestId','postType','private','likes','caption','path'],
                order : [
                    ['id' ,'DESC']
                ],
                raw :true,
                limit :6,
                subQuery :false
            });
    
            posts.map(item =>{
                if (item['Likes.liked'] == null){
                    item['Likes.liked']= false;
                }
            });
    
            res.json({
                user , 'posts' : posts
            });
        }

        else {
            return res.status(400).json({
                msg : "ERROR"
            });
        }
        
    } catch (error) {
        return res.status(400).send({
            msg:error.message
        });
    }
}

//getByPid
async function getByPostId(req ,res){
    try {
        let size = 6; 
        let posts = await PostModel.findAll({
            include : [{
                model : ContestModel ,
                attributes : [['contestName','cname'],'talent'],
                required :true
            },{
                model : UserModel,
                attributes : ['academy'],
                required :true
            },{
                model : LikeModel, 
                attributes : [['like','liked']],
                where : {
                    userId : req.body.my_uid
                },
                required : false
            }],
            where : {
                userId : req.body.uid
            },
            attributes : [['id' ,'postId'],'contestId','postType','private','likes','caption','path'],
            order : [
                ['id' ,'DESC']
            ],
            raw :true,
            offset : size *(req.body.mid - 1 ),
            limit : size,
            subQuery :false
        });

        posts.map(item =>{
            if (item['Likes.liked'] == null){
                item['Likes.liked']= false;
            }
        });

        res.json({
            'posts' : posts
        });
        
    } catch (error) {

        return res.status(400).send({
            msg:error.message
        });
        
    }
}

async function getBrandProfile(req,res) 
{
    try 
    {
        let row  = await UserModel.findAll({
            where : {
                academy : req.body.academy
            },
            include : [{
                model : FollowModel,
                attributes :[['id','isfollowing']],
                where :{
                    followerUid: req.body.uid, 
                },
                required :false,

            },{
                model : ContestModel,
                attributes :['id','orgId','talent','prizes','contestName','desc','certi','curr','fees','coverPic','endDt','end'],
                required : false,
                
            }],
            attributes :['id', 'name', 'profilePic', 'followers' ,'following'],
            raw :true,
        });

        row.map(item =>{
            if (item['Follows.isfollowing'] == null){
                item['Follows.isfollowing']= false;
            }

            else{
                item['Follows.isfollowing']= true;
            }
        });
        

        let contestIds = row.map(item => {return item['ContestDbs.id']});
        
        let posted = await PostModel.findAll({
            where :{
                contestId : {
                    [Op.in] : contestIds
                },
                userId : req.body.uid
            },
            raw : true,
            attributes : ['contestId']
        });

        for(let index in row){
            for(let item in posted){
                if(posted[item].contestId == row[index]['ContestDbs.id']){
                    row[index]['posted'] = true;
                }

                else{
                    row[index]['posted'] = false;
                }
            }
        }

        return res.json({
            msg :row
        });



    } catch (error) {
        return res.status(400).send({
            msg:error.message
        });
    }
    
}

export { createUser ,login ,deleteAll ,deleteOne, getUserAll,createAdminUser,editProfilePic ,usernameExists, getById ,getByPostId ,getBrandProfile };
import { FollowModel } from "../models/followModel.js";
import { UserModel } from "../models/userModel.js";
import  pkg from 'sequelize';

const { Op , literal } = pkg
async function createFollow(req,res)
{
    try 
    {
        if(req.body.follow === true){
            await FollowModel.create({
                followerUid : req.body.uid, 
                followingUid : req.body.oid
            });
            let following = await UserModel.update({
                following : literal(`following + 1`)
            },{
                where : {
                    id : req.body.uid,
                }
            });

            let follower = await UserModel.update({
                followers: literal(`followers + 1`)
            },{
                where : {
                    id : req.body.oid
                }
            });

            return res.json({
                msg : "Updated"
            });
        }

        else if(req.body.follow === false)
        {
            let  rows = await FollowModel.destroy({
                where : {
                    followerUid : req.body.uid, 
                    followingUid : req.body.oid
                }
            });

            console.log(rows)

            if(rows == 1 )
            {
                let following = await UserModel.update({
                    following : literal(`following - 1`)
                },{
                    where : {
                        id : req.body.uid,
                    }
                });
    
                let follower = await UserModel.update({
                    followers: literal(`followers - 1`)
                },{
                    where : {
                        id : req.body.oid,
                    }
                });

            }
            return res.json({
                msg : "Updated"
            });
        }

        else{
            res.status(400).json({
                msg : "Error "
            })    
        }

        
    } catch (error) {
        res.status(400).json({
            msg : error.message
        });  
    }
}

async function getFollower(req,res) 
{
    try 
    {
        let rows = await FollowModel.findAll({
            where : {
                followingUid : req.body.uid,
            },
            include : [{
                model : UserModel,
                required : true,
                attributes : ['name' ,'profilePic','academy']
            }],
            raw :true,
            offset : 10 *(req.body.mid - 1 ),
            limit : 10,
            subQuery :false

        });

        return res.json({
            msg :rows
        });
        
    } catch (error) 
    {
        res.status(400).json({
            msg : error.message
        });    
    }
}

async function getFollowing(req,res) 
{
    try 
    {
        let rows = await FollowModel.findAll({
            where : {
                followerUid : req.body.uid,
            },
            include : [{
                model : UserModel,
                required : true,
                attributes : ['name' ,'profilePic','academy']
            }],
            raw :true,
            offset : 10 *(req.body.mid - 1 ),
            limit : 10,
            subQuery :false

        });

        return res.json({
            msg :rows
        });
        
    } catch (error) 
    {
        res.status(400).json({
            msg : error.message
        });    
    }
}


export { createFollow ,getFollower ,getFollowing }
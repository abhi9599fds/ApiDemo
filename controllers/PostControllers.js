import { LikeModel } from "../models/likesModel.js";
import { PostModel } from "../models/postModel.js";
import { UserModel } from "../models/userModel.js";

async function createPost(req,res)
{
    try 
    {
        const postModel = {
            userId : req.body.uid,
            contestId : req.body.cid,
            path : req.body.path,
            coverPic : req.body.cover_pic,
            caption : req.body.caption,
            postType : req.body.post_type
        }
        await PostModel.create(postModel).then(() =>{
            res.send({
                msg : "Post Created"
            });
        }).catch((err) => {
            res.status(400).send({
                msg : err.message
            });
        }); 
    } 
    catch (error) {

        res.status(400).send({
            msg : error.message
        });
    }
}


async function getPostAll(req,res)
{
    try {

        await PostModel.findAll({
            where : {}
        }).then((post) => {
            res.send({
                data : post
            });
        })
        
    } 
    catch (error) {
        res.status(401).send({
            msg : error.message
        });
    }
}

async function getContestPost(req,res)
{
    try {

        await PostModel.findAll({
            where : {
                contestId : req.body.contestId
            }
        }).then((post) => {
            res.send({
                data : post
            });
        })
        
    } 
    catch (error) {
        res.status(401).send({
            msg : error.message
        });
    }
}

async function deletePost(req,res)
{
    try {

        const rows = await PostModel.destroy({
            where :{
                id : req.body.id
            }
        }).catch((err) => {
            res.status(400).send({
                msg : err.message 
            });
        });
        if(rows >= 1){
            res.send({
                msg : "Post Deleted"
            });
        }
        else {
            res.status(401).send({
                msg : "Not found"
            })
        }       
    } 
    catch (error) {
        
    }
}

async function loadPost(req,res)
{
    try
    {
        const size = 10;
        await PostModel.findAll({
           include : [{
               model : UserModel,
               attributes :['name','profilePic']
           }],
           order : [
               ['id' ,'DESC']
           ],
           offset : size *(req.body.mid - 1 ),
           limit : size,
           attributes : [
               'id','userId','contestId','path','coverPic',
               'postType'
           ],
           raw :true
        }).then(posts => {
            res.send({
                data :posts
            });
        });
    }
    catch(error){
        res.status(400).send({
            msg : error.message
        });
    }
}

async function getContestPostLikes(req,res)
{
    try {
        let rows =await PostModel.findAll({
            include : [{
                model : UserModel,
                attributes : ['name','profilePic'],
                required :true
            },{
                model : LikeModel,
                attributes :[['like','liked']],
                required :false,
                where : {
                    userId : req.body.uid
                }
            }],
            raw : true,
            where :{
              contestId : req.body.cid 
            },
            offset : 6 *(req.body.mid - 1 ),
            limit : 6,
        });

        return res.json(rows);
        
    } catch (error) {
        res.status(400).send({
            msg : error.message
        });
    }
}

async function editCaption(req,res){
    try {

        let rows = await PostModel.update({
            caption : req.body.caption
        },{
            where : {
                id : req.body.id
            }
        });

        if(rows[0] != 0){
            return res.json({
                msg : "Updated"
            });
        }

        return res.status(404).json({
            msg : "Not Updated"
        });

        
    } catch (error) {
        res.status(400).send({
            msg : error.message
        });
    }
}

async function editPrivate(req,res){
    try {

        let rows = await PostModel.update({
            private : req.body.private
        },{
            where : {
                id : req.body.id
            }
        });

        if(rows[0] != 0){
            return res.json({
                msg : "Updated"
            });
        }

        return res.status(404).json({
            msg : "Not Updated"
        });

        
    } catch (error) {
        res.status(400).send({
            msg : error.message
        });
    }
}

export { createPost ,getPostAll ,getContestPost ,deletePost, loadPost ,getContestPostLikes ,editCaption ,editPrivate };
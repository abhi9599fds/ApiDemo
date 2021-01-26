import { PostModel } from "../models/postModel.js";
import { UserModel } from "../models/userModel.js";

async function createPost(req,res)
{
    try 
    {
        const postModel = {
            userId : req.body.userId,
            contestId : req.body.contestId,
            path : req.body.path,
            coverPic : req.body.coverPic,
            caption : req.body.caption,
            postType : req.body.postType 
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

export { createPost ,getPostAll ,getContestPost ,deletePost, loadPost };
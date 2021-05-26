import { CommentModel } from "../models/commentModel.js";
import { UserModel } from "../models/userModel.js";



async function createComment(req,res) 
{
    try {

        await CommentModel.create({
            postId : req.body.pid,
            userId : req.body.uid,
            comment : req.body.comment
        });

        return res.json({
            msg : "Created"
        });
        
    } catch (error) {
        return res.status(400).json({
            msg : error.message
        });
    }    
}

async function getCommentPost(req,res){
    try {

        let rows = await CommentModel.findAll({
            where : {
                postId : req.body.pid
            },
            include : [{
                model : UserModel,
                attributes : ['name' ,['profilePic','profile_pic']]
            }],
            subQuery :false,
            offset : 10*(req.body.mid - 1 ),
            limit : 10,
            raw : true
        });

        res.json({
            msg : rows
        })
        
    } catch (error) {
        return res.status(400).json({
            msg : error.message
        });
        
    }
}

export { createComment ,getCommentPost }
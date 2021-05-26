import { LikeModel } from "../models/likesModel.js";
import { PostModel } from "../models/postModel.js";
import pkg from "sequelize";
const {Op ,literal} = pkg;
async function like(req,res){

    try {

        let row = await LikeModel.findOne({
            where :{
                [Op.and] : {
                    postId : req.body.pid,
                    userId : req.body.uid
                }
            },
            raw : true
        });

        if(row != null)
        {
            if(row.like === req.body.like)
            {
                return res.json({
                    msg : 'SAME'
                })
            }
            else
            {
                await LikeModel.update({
                    like : req.body.like
                },{
                    where :{
                        [Op.and] : {
                            postId : req.body.pid,
                            userId : req.body.uid
                        }
                    }
                });

                if(req.body.like === true)
                {
                    let rows = await PostModel.update({
                        likes : literal(`likes + 1`)
                    },{
                        where :{
                            id : req.body.pid
                        }
                    });
                                 
                
                }
                else
                {
                    console.log(req.body.like === true)
                    let rows = await PostModel.update({
                        likes : literal(`likes - 1`)
                    },{
                        where :{
                            id : req.body.pid,
                        }
                    });
                                   
                }

                res.json({
                    "msg" : "updated"
                });
            }
        }

        else{
            const Like = {
                postId : req.body.pid,
                userId : req.body.uid,
                like : req.body.like == null || req.body.like == false ? false :req.body.like 
            }
            await LikeModel.create(Like);

            if(req.body.like === true){
                let rows = await PostModel.update({
                    likes : literal(`likes + 1`)
                },{
                    where :{
                        id : req.body.pid
                    }
                });
            }

            return res.json({
                "msg" : "updated"
            });
        }
        
    } catch (error) {
        return res.status(400).json({
            msg : error.message
        });
    }
}

export { like };
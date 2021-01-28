import { ContestModel } from "../models/contestModel.js";
import { UserModel } from "../models/userModel.js";
import { PostModel } from '../models/postModel.js';
import seq from "sequelize";

const { Op } = seq;

async function createContest(req ,res) 
{
    try 
    {
        await UserModel.findOne({
            where : {
                id : req.body.orgId,
                academy : req.body.academy
            },
            attributes : [ 'typeUser' ]
        }).then(async (user) => {
            console.log(user)
            if(user != null  && user.typeUser.toLowerCase() == "owner")
            {
                const contestModel = {
                    orgId : req.body.orgId,
                    winner : req.body.winner,
                    prizes : req.body.prizes,
                    contestName : req.body.contestName,
                    talent : req.body.talent,
                    // YYYY-MM-DD
                    endDt : Date.parse(req.body.endDt),
                    coverPic : req.body.coverPic,
                    end : false,
                    desc : req.body.desc,
                    fees : req.body.fees,
                    curr : req.body.curr,
                    certi : req.body.certi,
                };

                await ContestModel.create(contestModel).then((ct) =>{
                    res.send({
                        data : ct
                    });
                }).catch(err => {
                    return res.status(401).send({
                        msg : err.message
                    });
                }); 
                
            }
            else{
                return res.status(400).send({
                    msg : "No Permission"
                })
            }
        })   
    } 
    catch (error) {
        res.status(400).send({
            msg : error.message
        }); 
    }
}

async function deleteContest(req ,res)
{
    try {
        
        let rows = await ContestModel.destroy({
            where:{
                id : req.body.id
            }
        })
        if(rows >= 1){
            res.send({
                msg : "Deleted Data"
            });
        }

        else{
            return res.status(401).send({
                msg : "No Record found"
            });
        }
    } 
    catch (error) {
        res.status(400).send({
            msg : error.message
        });
    }
}

async function getContestAll(req,res)
{
    try {

        await ContestModel.findAll({
            where : {}
        }).then((ct) => {
            res.send({
                data : ct
            });
        })
        
    } 
    catch (error) {
        res.status(401).send({
            msg : error.message
        });
    }
}

async function getContestByAcademy(req,res)
{
    try {

        await ContestModel.findAll({
            include : [{
                model : UserModel,
                where :{
                    academy : req.body.academy
                },
                attributes : [ ]
            }],
            where : {},
            raw : true
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

async function winner(req,res)
{
    try 
    {
        let postIds = [];
        if(req.body.winner["1"] != null ){
            postIds.push(req.body.winner["1"]);
            if(req.body.winner["2"] != null ){
                postIds.push(req.body.winner["2"]);
            }
            if(req.body.winner["3"] != null ){
                postIds.push(req.body.winner["3"]);
            }
        }
        else{
            res.status(400).send({
                msg: "Winner Post Not Found"}
            );
            return;
        }

        await PostModel.findAll({
            include: [{
                model : UserModel,
                attributes : [ 'name' ,'profilePic' ]
            }],
            where :{
                id :{
                    [Op.in] : postIds
                },
               contestId : req.body.contestId 
            },
            raw: true,
            limit : 3,
            attributes : [ ["id","postId"], "userId" ,"path" ,"coverPic" ,"caption", "postType" ]         
        }).then(async (posts) => {
            if(posts.length <= 0) {
                return res.status(400).send({
                    msg : "Post Not Found"
                });
                
            }
            var winner = {};
            posts.forEach(post => {
                var pos = postIds.findIndex(ele =>  ele == post["postId"]);
                if(pos != null)
                    winner[`${pos+1}`] = post
            });
            let rows = await ContestModel.update({
                winner : winner
            },{
                where : {
                    id : req.body.contestId
                }
            }).catch(err =>{
                res.status(400).send({
                    msg : err.message
                });
            })
            if(rows[0] >= 1){
                res.send({
                msg : "Inserted" });
            }
            else{
                res.status(400).send({
                    msg : "Not Updated"
                })
                return;
            }
        }).catch((err) =>{
            res.status(400).send({
                msg : err.message
            });
            return;
        });;
 
    } 
    catch (error) {
        res.status(400).send({
            msg : error.message
        });
    }
}

async function getWinnerAcademy(req,res)
{
    try
    {
        await ContestModel.findAll({
            include :[{
                model : UserModel,
                where : {
                    "academy": req.body.academy
                },
                attributes :[ 'academy' ],          
            }],
            raw :true,
            attributes : ['winner' ,['id','contestId'],'orgId','talent','contestName','coverPic' ]
        }).then(data => {
            res.send({
                data : data
            });
        }).catch(err => {
            res.send({
                msg : err.message
            });
            return;
        });

    }
    catch(error){
        res.status(400).send({
            msg : error.message
        });
    }
}

async function getWinnerUser(req,res)
{
    try{
        ContestModel.findAll({
            include : [{
                model : UserModel,
                attributes : ['academy']
            }],
            raw :true,
            where: {
                winner : {
                    [Op.or] : [{
                        '"1"' :{
                            '"userId"': req.body.userId
                        }
                    },{
                        '"2"' :{
                            '"userId"': req.body.userId
                        }
                    },{
                        '"3"' :{
                            '"userId"': req.body.userId
                        }
                    }],
                }
            },
            attributes : [ ['id','contestId'],'winner','contestName' ,'coverPic','talent']
        }).then((data) => {       
            var dt = {};
            data.forEach(post => {
                if(post.winner["1"]['userId'] == req.body.userId){
                    dt["1"] = post.winner["1"];
                    dt["1"]["contestId"] = post["contestId"],
                    dt["1"]['contestName'] = post['contestName']
                    dt["1"]['talent'] = post['talent']
                    dt["1"]['academy'] = post['User.academy']
                    dt["1"]['talent'] = post['talent']
                    dt["1"]['coverPic'] = post['coverPic']
                    
                }
                else if(post.winner["2"]['userId'] == req.body.userId){
                    dt["2"] = post.winner["2"];
                    dt["2"]["contestId"] = post["contestId"],
                    dt["2"]['contestName'] = post['contestName']
                    dt["2"]['talent'] = post['talent']
                    dt["2"]['academy'] = post['User.academy'],
                    dt["2"]['talent'] = post['talent']
                    dt["2"]['coverPic'] = post['coverPic']
                }
                else if(post.winner["3"]['userId'] == req.body.userId){
                    dt["3"] = post.winner["3"];
                    dt["3"]["contestId"] = post["contestId"],
                    dt["3"]['contestName'] = post['contestName']
                    dt["3"]['talent'] = post['talent']
                    dt["3"]['academy'] = post['User.academy']
                    dt["3"]['talent'] = post['talent']
                    dt["3"]['coverPic'] = post['coverPic']
                }
            });

            return res.send({
                data :dt
            });
        }).catch((err) => {
            return res.status(400).send({
                msg :err.message
            })
        })
    }
    catch(err){
        return res.status(400).send({
            msg : err.message
        });

    }
}
export { createContest ,deleteContest ,getContestAll ,getContestByAcademy , winner, getWinnerAcademy, getWinnerUser };
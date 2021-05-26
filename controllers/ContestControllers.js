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
                id : req.body.oid,
                academy : req.body.academy
            },
            attributes : [ 'typeUser' ]
        }).then(async (user) => {
            console.log(user)
            if(user != null  && user.typeUser.toLowerCase() == "owner")
            {
                const contestModel = {
                    orgId : req.body.oid,
                    winner : req.body.winner,
                    prizes : req.body.prizes,
                    contestName : req.body.cname,
                    talent : req.body.talent,
                    // YYYY-MM-DD
                    endDt : Date.parse(req.body.end_dt),
                    coverPic : req.body.cover_pic,
                    end : false,
                    desc : req.body.desc,
                    fees : req.body.fees,
                    curr : req.body.curr,
                    certi : req.body.certi_bool,
                };

                await ContestModel.create(contestModel).then((ct) =>{
                    res.send({
                        msg : "Contest Created"
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
                });
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
                attributes : []
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
               contestId : req.body.cid
            },
            raw: true,
            limit : 3,
            attributes : [ ["id","postId"], "userId" ,"path" ,"coverPic" ,"caption", "postType","likes" ]         
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
                winner : winner,
                end : true,
            },{
                where : {
                    id : req.body.cid
                }
            }).catch(err =>{
                res.status(400).send({
                    msg : err.message
                });
            })
            if(rows[0] >= 1){
                return res.send({
                msg : "Inserted"});
            }
            else{
                return res.status(400).send({
                    msg : "Not Updated"
                })
                
            }
        }).catch((err) =>{
            return res.status(400).send({
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

async function getWinnerAcademy(req,res)
{
    try
    {
        await ContestModel.findAll({
            include :[{
                model : UserModel,
                where : {
                    "academy": req.body.academy,
 
                },
                attributes :[ 'academy' ],  
                        
            }],
            where : {
                winner : {
                    [Op.ne] : null
                }
            },
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
                            '"userId"': req.body.uid
                        }
                    },{
                        '"2"' :{
                            '"userId"': req.body.uid
                        }
                    },{
                        '"3"' :{
                            '"userId"': req.body.uid
                        }
                    }],
                }
            },
            attributes : [ ['id','contestId'],'winner','contestName' ,'coverPic','talent']
        }).then((data) => {       
            var dt = {};
            data.forEach(post => {
                if(post.winner["1"]['userId'] == req.body.uid){
                    dt["1"] = post.winner["1"];
                    dt["1"]["contestId"] = post["contestId"],
                    dt["1"]['contestName'] = post['contestName']
                    dt["1"]['talent'] = post['talent']
                    dt["1"]['academy'] = post['User.academy']
                    dt["1"]['talent'] = post['talent']
                    dt["1"]['coverPic'] = post['coverPic']
                    
                }
                else if(post.winner["2"]['userId'] == req.body.uid){
                    dt["2"] = post.winner["2"];
                    dt["2"]["contestId"] = post["contestId"],
                    dt["2"]['contestName'] = post['contestName']
                    dt["2"]['talent'] = post['talent']
                    dt["2"]['academy'] = post['User.academy'],
                    dt["2"]['talent'] = post['talent']
                    dt["2"]['coverPic'] = post['coverPic']
                }
                else if(post.winner["3"]['userId'] == req.body.uid){
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

async function getWinner(req,res) 
{
    try 
    {
        let rows= await ContestModel.findAll({
            where : {
                winner :{
                    [Op.ne] : null
                }
            }
        });
        return res.send({
            msg : rows
        });
        
    } 
    catch (error) {
        res.status(401).send({
            msg : error.message
        });
    }    
}

async function getContestMid(req,res) 
{
    try 
    {
        let rows = await ContestModel.findAll({
            where : {},
            include :[{
                model :UserModel,
                attributes :['name','profilePic','academy'],
                required :true
            }],
            include :[{
                model :PostModel,
                required :false,
                attributes :[['id','posted']],
                where :{
                    userId : req.body.uid 
                }
            }],
            raw : true,
            subQuery :false,
            offset : 6 *(req.body.mid - 1 ),
            limit : 6,
            attributes :['id','orgId','talent','prizes','contestName','desc','certi','curr','fees','coverPic','endDt','end']
        })
        
        rows.map(item =>{
            if(item.fees ==  0){
                item.paid = false;
            }
            else{
                item.paid = true;
            }

            if(item['PostDbs.posted'] ==  null){
                item['PostDbs.posted'] = false;
            }
            else{
                item['PostDbs.posted'] = true;
            }
        });

        res.json({
            msg : rows
        });
    } 
    catch (error) 
    {
        res.status(401).send({
            msg : error.message
        });
    }
    
}

export { createContest ,deleteContest ,getContestAll ,getContestByAcademy , winner, getWinnerAcademy, getWinnerUser ,getWinner,getContestMid };
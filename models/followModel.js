import { sequelize } from "../data/modelMake.js";
import pkg from "sequelize";

const{ DataTypes } = pkg


const FollowModel = sequelize.define("Follow",{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true,
    },
    //uid
    followerUid : {
        type : DataTypes.UUID,
        references :{
            model : 'Users',
            key : 'id'
        }
    },
    //oid
    followingUid : {
        type : DataTypes.UUID,
        references :{
            model : 'Users',
            key : 'id'
        }
    }
},{
    indexes : [ 
        { 
            unique :true,
            fields : ['followerUid' , 'followingUid'],
        }
    ],
    createdAt :false,
    updatedAt : false,
});

export { FollowModel };
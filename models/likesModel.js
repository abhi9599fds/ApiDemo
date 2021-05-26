import { sequelize } from "../data/modelMake.js";
import pkg from "sequelize";
const { DataTypes} = pkg;

const LikeModel = sequelize.define("Likes",{

    postId : {
        type : DataTypes.INTEGER,
        references : {
            model :"PostDbs",
            key : "id",
        },
        onDelete : `CASCADE`,
    },
    userId : {
        type : DataTypes.UUID,
        onDelete : `CASCADE`,

        references : {
            model : "Users",
            key : 'id'
        }
    },
    like : {
        type : DataTypes.BOOLEAN ,
        defaultValue:true 
    }
},{
    indexes : [
        {
            unique :true,
            fields : ['postId' ,'userId']
        }
    ],
    createdAt :false,
    updatedAt :false
});

export { LikeModel };

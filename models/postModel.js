import { sequelize } from "../data/modelMake.js";
import pkg from "sequelize";
import { CommentModel } from "./commentModel.js";
import { LikeModel } from "./likesModel.js";

const{ DataTypes } = pkg

const PostModel = sequelize.define("PostDbs",{
    id : {
        primaryKey : true,
        autoIncrement : true,
        type : DataTypes.INTEGER,
    },
    userId : {
        type : DataTypes.UUID,
        allowNull :false,
        references :{
            //Table Name
            model : 'Users',
            key : 'id'
        },
        onDelete : `CASCADE`,
    },
    contestId : {
        type : DataTypes.INTEGER,
        allowNull :false,
        references : {
            //Table Name
            model : 'ContestDbs',
            key : "id"
        },
        onDelete : `CASCADE`
    },
    path : { type : DataTypes.STRING, allowNull : false },
    coverPic : { type : DataTypes.STRING , allowNull :true },
    caption : { type : DataTypes.STRING ,allowNull : true },
    postType : { type : DataTypes.STRING , allowNull : false },
    private : { type : DataTypes.BOOLEAN ,defaultValue:false },
    likes : { type :DataTypes.INTEGER , defaultValue:0 } 
},
{
    indexes : [ 
        { 
            unique :true,
            fields : ['userId' , 'contestId'],
        }
    ],
    createdAt :false,
    updatedAt :false
});

PostModel.hasMany(CommentModel,{foreignKey :'postId',onDelete:`CASCADE`});
CommentModel.belongsTo(PostModel,{foreignKey :'postId',onDelete:`CASCADE`});

PostModel.hasMany(LikeModel,{foreignKey :'postId',onDelete:`CASCADE`});
LikeModel.belongsTo(PostModel,{foreignKey :'postId',onDelete:`CASCADE`});


export { PostModel };
import { sequelize } from "../data/modelMake.js";
import pkg from "sequelize";

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
    postType : { type : DataTypes.STRING , allowNull : false }
},
{
    indexes : [ 
        { 
            unique :true,
            fields : ['userId' , 'contestId'],
        }
    ]
});

export { PostModel };
import { sequelize } from "../data/modelMake.js";
import pkg from "sequelize";

const{ DataTypes } = pkg

const CommentModel = sequelize.define("CommentDb",{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true,
    },
    postId :{
        type : DataTypes.INTEGER,
        references :{
            //Table Name
            model : 'PostDbs',
            key : 'id'
        },
        allowNull:false,
        onDelete : `CASCADE`
    },
    userId : {
        type : DataTypes.UUID,
        references :{
            //Table Name
            model : 'Users',
            key : 'id'
        },
        allowNull:false,
        onDelete : `CASCADE`
    },

    comment : { type :DataTypes.STRING(400) ,allowNull :true },
    dateTime : { type :DataTypes.DATE , defaultValue:Date.now() }
},{
    createdAt:false,
    updatedAt :false
});

export {CommentModel};
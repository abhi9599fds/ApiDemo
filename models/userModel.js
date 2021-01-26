import { sequelize } from "../data/modelMake.js";
import { ContestModel } from "./contestModel.js";
import { PostModel } from "./postModel.js"
import pkg from "sequelize";
const { UUID, DataTypes,UUIDV4 } = pkg;

const UserModel = sequelize.define("Users" , {
    id : { 
        primaryKey : true ,
        type: UUID, 
        defaultValue : UUIDV4
    },
    name : { type : DataTypes.STRING ,allowNull:false},
    phn : { type : DataTypes.INTEGER ,allowNull:false },
    email : { type : DataTypes.STRING , unique : true ,allowNull : false},
    passHash : { type : DataTypes.STRING ,allowNull:false },
    passSalt : { type : DataTypes.STRING ,allowNull:false },
    academy : { type : DataTypes.STRING ,allowNull:true },
    typeUser : { type : DataTypes.STRING , allowNull:false },
    profilePic : { type : DataTypes.STRING ,allowNull:true }
});

UserModel.hasMany(ContestModel, { foreignKey : 'orgId' ,onDelete :`CASCADE`});
ContestModel.belongsTo(UserModel , { foreignKey : 'orgId' ,onDelete :`CASCADE`});

UserModel.hasMany(PostModel,{ foreignKey : 'userId' ,onDelete :`CASCADE`});
PostModel.belongsTo(UserModel, { foreignKey : 'userId' ,onDelete:`CASCADE`});



export { UserModel };
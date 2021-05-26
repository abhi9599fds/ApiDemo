import { sequelize } from "../data/modelMake.js";
import { PostModel } from "./postModel.js";
import pkg from "sequelize";

const{ DataTypes } = pkg

const ContestModel = sequelize.define("ContestDb" ,{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true,
    },
    orgId : {
        type : DataTypes.UUID,
        references :{
            //Table Name
            model : 'Users',
            key : 'id'
        },
        allowNull:false,
        onDelete : `CASCADE`
    },
    talent : { type : DataTypes.STRING ,allowNull :false },
    winner : { type: DataTypes.JSON, allowNull: true },
    prizes : { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true },
    contestName : { type : DataTypes.STRING , allowNull: false},
    desc : { type : DataTypes.STRING, allowNull: false },
    certi : { type : DataTypes.BOOLEAN ,allowNull: false },
    curr : { type : DataTypes.STRING, allowNull: false },
    fees : { type : DataTypes.INTEGER, allowNull: false },
    coverPic : { type :DataTypes.STRING ,allowNull :true },
    endDt : { type :DataTypes.DATE , allowNull: false },
    end : { type: DataTypes.BOOLEAN, allowNull :true }
},{
    createdAt :false,
    updatedAt :false
});

ContestModel.hasMany(PostModel,{ foreignKey : 'contestId' ,onDelete:`CASCADE`});
PostModel.belongsTo(ContestModel, { foreignKey : 'contestId' ,onDelete:`CASCADE`});


export { ContestModel };


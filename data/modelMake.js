import { Sequelize } from "sequelize";
import { dbConn } from '../data/dataConnection.js'

const sequelize = new Sequelize(
   dbConn.DATABASE,
   dbConn.USER,
   dbConn.PASSWORD,
   {
      host:dbConn.HOST,
      port :dbConn.PORT,
      dialect :dbConn.dialect,
      dialectOptions: {
         ssl: true
      },
      pool :{
         max : dbConn.pool.max,
         min : dbConn.pool.min,
         idle : dbConn.pool.idle,
         acquire : dbConn.pool.acquire
      }
   }
);

export { sequelize };

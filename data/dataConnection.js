import config  from "dotenv";

config();

process.env.DATABASE_URL

const dbConn =  {
    HOST : "localhost",
    USER : "abhi9599",
    PASSWORD : "1234",
    PORT : "5432",
    DATABASE : "mvpdatabase",
    dialect: "postgres",
    pool :{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export { dbConn };
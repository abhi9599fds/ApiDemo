import { config }  from "dotenv";

config();

// var st = process.env.DATABASE_URL;
// var connUrl = st.replace("postgres://","");
// var pgUserPass = connUrl.split('@')[0]
// var pgHostPortDb = connUrl.split("@")[1];
// var pgHostPort = pgHostPortDb.split("/")[0];
// var pgDb = pgHostPortDb.split("/")[1];
// var pgUser = pgUserPass.split(":")[0];
// var pgPass = pgUserPass.split(":")[1];
// var pgHost = pgHostPort.split(":")[0];
// var pgPort = pgHostPort.split(":")[1];

const dbConn =  {
    HOST : "localhost",
    USER : "abhi9599",
    PASSWORD :  "1234",
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
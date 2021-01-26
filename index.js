import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./data/modelMake.js";
import { UserRoutes } from "./routes/userRoutes.js";
import { ContestRouter } from "./routes/contestRoutes.js";
import cors from "cors";
import http from "http";
import { PostRouter } from "./routes/postRoutes.js"



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

sequelize.sync({
    alter :false
}).then(() => { 
    console.log("DatabaseCreated"); 
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
        extended: false,
    })
);

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

app.get("/",async (req,res) => {
    res.json({"hi" : 1});
});

app.use("/user",UserRoutes );
app.use("/contest",ContestRouter );
app.use("/post",PostRouter);



//app.listen(PORT ,() => { console.log(`Running on http://localhost:${PORT}`)});

const server = http.createServer(app);
server.listen(PORT , ()=>{ console.log(`Running on http://localhost:${PORT}`) });
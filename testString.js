const st = "postgres://tfgytbfruesaxj:f2677809ba562d6ee197aa2332a415459864668cb2c67976eaa8aa2532bb0465@ec2-3-231-241-17.compute-1.amazonaws.com:5432/d29pfls8jaafg2"

var connUrl = st.replace("postgres://","");
var pgUserPass = connUrl.split('@')[0]
var pgHostPortDb = connUrl.split("@")[1];
var pgHostPort = pgHostPortDb.split("/")[0];
var pgDb = pgHostPortDb.split("/")[1];
var pgUser = pgUserPass.split(":")[0];
var pgPass = pgUserPass.split(":")[1];
var pgHost = pgHostPort.split(":")[0];
var pgPort = pgHostPort.split(":")[1];


console.log(pgPort);
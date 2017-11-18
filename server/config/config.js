let env = process.env.NODE_ENV || "development"

console.log("NODE_ENV ==========> ", env);

if(env === "test" || env === "development") {

    const config = require("./config.json");
    const envConfig = config[env];

    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key]
    });

}


// if(env === "test"){
//     process.env.PORT = 3000;
//     process.env.MOBGODB_URI = "mongodb://localhost:27017/TodoAppTest"
    
// }
// else if(env === "development"){
//     process.env.PORT = 3000;
//     process.env.MOBGODB_URI = "mongodb://localhost:27017/TodoApp"
// }
// else{
//     process.env.MOBGODB_URI = "mongodb://admin:admin@ds113566.mlab.com:13566/todoapp"
// }
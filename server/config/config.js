let env = process.env.NODE_ENV || "development"

console.log("NODE_ENV ==========> ", env);

if(env === "test"){
    process.env.PORT = 3000;
    process.env.MOBGODB_URI = "mongodb://localhost:27017/TodoAppTest"
    
}
else if(env === "development"){
    process.env.PORT = 3000;
    process.env.MOBGODB_URI = "mongodb://localhost:27017/TodoApp"
}
else{
    process.env.MOBGODB_URI = "mongodb://admin:admin@ds245805.mlab.com:45805/todoapp"
}
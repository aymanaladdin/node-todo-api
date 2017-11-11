const jwt = require("jsonwebtoken");

let data = { id: 4, role: "admin"};

let token = jwt.sign(data, "secsec");

console.log("Token: ", token);
let decode = {};
try{
    decode = jwt.verify(token, "secsecs");
    
}
catch(e){
    decode = "cannot decoded this token"
}

console.log("Decoded", decode);
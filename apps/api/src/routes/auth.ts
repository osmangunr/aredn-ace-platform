import {FastifyInstance} from "fastify";
import {prisma} from "../db";
import {hashPassword,comparePassword,createToken,verifyToken} from "../auth";

export default async function authRoutes(app:FastifyInstance){

app.post("/auth/register",async(req:any)=>{

const body=req.body;

const user=await prisma.user.create({
data:{
username:body.username,
password:await hashPassword(body.password),
role:body.role || "VIEWER"
}
});

return {
id:user.id,
username:user.username,
role:user.role
};

});


app.post("/auth/login",async(req:any,reply)=>{

const body=req.body;

const user=await prisma.user.findUnique({
where:{
username:body.username
}
});

if(!user){
return reply.code(401).send({
error:"Invalid login"
});
}

const ok=await comparePassword(
body.password,
user.password
);

if(!ok){
return reply.code(401).send({
error:"Invalid login"
});
}

return {
token:createToken(user),
user:{
username:user.username,
role:user.role
}
};

});


app.get("/auth/me",async(req:any,reply)=>{

const header=req.headers.authorization;

if(!header){
return reply.code(401).send({
error:"Missing token"
});
}

try{

const token=header.replace("Bearer ","");

const user:any=verifyToken(token);

const dbUser=await prisma.user.findUnique({
where:{
id:user.id
},
select:{
id:true,
username:true,
role:true,
enabled:true
}
});

return dbUser;

}catch(e){

return reply.code(401).send({
error:"Invalid token"
});

}

});

}

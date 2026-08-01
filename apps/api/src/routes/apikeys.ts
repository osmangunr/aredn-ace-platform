import { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { authGuard, roleGuard } from "../middleware";
import crypto from "crypto";

export default async function apiKeyRoutes(app:FastifyInstance){

app.get("/api/keys",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async()=>{
 return await prisma.apiKey.findMany({
  orderBy:{
   createdAt:"desc"
  }
 });
});


app.post("/api/keys/create",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async(request:any)=>{

 const body=request.body as any;

 const key="ACE-"+crypto.randomBytes(24).toString("hex");

 const apiKey=await prisma.apiKey.create({
  data:{
   key,
   name:body.name ?? "Gateway",
   role:body.role ?? "GATEWAY",
   userId:body.userId
  }
 });

 return apiKey;
});


app.patch("/api/keys/:id/disable",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async(request:any)=>{

 return await prisma.apiKey.update({
  where:{
   id:request.params.id
  },
  data:{
   enabled:false
  }
 });

});

}

import {FastifyInstance} from "fastify";
import {prisma} from "../db";
import {authGuard, roleGuard} from "../middleware";
import {hashPassword} from "../auth";

export default async function userRoutes(app:FastifyInstance){

app.get("/users",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async()=>{
 return await prisma.user.findMany({
  select:{
   id:true,
   username:true,
   email:true,
   role:true,
   enabled:true,
   createdAt:true
  }
 });
});


app.get("/users/:id",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async(req:any)=>{
 return await prisma.user.findUnique({
  where:{
   id:req.params.id
  }
 });
});


app.patch("/users/:id/role",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN")
 ]
},async(req:any)=>{
 return await prisma.user.update({
  where:{
   id:req.params.id
  },
  data:{
   role:req.body.role
  }
 });
});


app.patch("/users/:id/password",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async(req:any)=>{
 return await prisma.user.update({
  where:{
   id:req.params.id
  },
  data:{
   password:await hashPassword(req.body.password)
  }
 });
});


app.delete("/users/:id",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN")
 ]
},async(req:any)=>{
 return await prisma.user.delete({
  where:{
   id:req.params.id
  }
 });
});

}

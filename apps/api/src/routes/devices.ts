import { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { authGuard, roleGuard } from "../middleware";

export default async function deviceRoutes(app: FastifyInstance) {

app.get("/devices",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN","OPERATOR","VIEWER")
 ]
},async()=>{
 return await prisma.device.findMany({
  include:{
   node:true,
   telemetry:true
  }
 });
});


app.post("/devices",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN","OPERATOR")
 ]
},async(request,reply)=>{

 const body=request.body as any;

 const device=await prisma.device.create({
  data:{
   model:body.model,
   firmware:body.firmware,
   battery:body.battery,
   voltage:body.voltage,
   nodeId:body.nodeId
  }
 });

 return reply.send(device);
});


app.patch("/devices/:id",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN","OPERATOR")
 ]
},async(request:any)=>{

 return await prisma.device.update({
  where:{
   id:request.params.id
  },
  data:request.body
 });

});


app.delete("/devices/:id",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async(request:any)=>{

 return await prisma.device.delete({
  where:{
   id:request.params.id
  }
 });

});

}

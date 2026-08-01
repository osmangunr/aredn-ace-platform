import { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { authGuard, roleGuard } from "../middleware";

export default async function nodeRoutes(app: FastifyInstance) {

app.get("/nodes", async () => {
  return await prisma.node.findMany({
    include:{
      devices:true,
      owner:true
    }
  });
});


app.post("/nodes",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN","OPERATOR")
 ]
},async(request,reply)=>{

 const body=request.body as any;

 const node=await prisma.node.create({
  data:{
   name:body.name,
   callsign:body.callsign,
   type:body.type ?? "UNKNOWN",
   ip:body.ip,
   mac:body.mac
  }
 });

 return reply.send(node);
});


app.patch("/nodes/:id/owner",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN")
 ]
},async(request:any)=>{

 const node=await prisma.node.update({
  where:{
   id:request.params.id
  },
  data:{
   ownerId:request.body.ownerId
  }
 });

 return node;
});


}

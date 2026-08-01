import { prisma } from "./db";

export async function gatewayGuard(req:any, reply:any){

 const key =
   req.headers["x-api-key"];

 if(!key){
   return reply.code(401).send({
    error:"Missing API key"
   });
 }

 const apiKey = await prisma.apiKey.findUnique({
   where:{
    key:String(key)
   }
 });

 if(!apiKey || !apiKey.enabled){
   return reply.code(401).send({
    error:"Invalid API key"
   });
 }

 req.gateway = apiKey;

}

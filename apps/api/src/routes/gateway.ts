import {FastifyInstance} from "fastify";
import {prisma} from "../db";
import {gatewayGuard} from "../gateway";


export default async function gatewayRoutes(app:FastifyInstance){


app.post("/gateway/register",{
 preHandler:[
  gatewayGuard
 ]
},async(request:any)=>{

 const body=request.body as any;


 let node = await prisma.node.findFirst({
  where:{
   callsign:body.callsign
  }
 });


 if(!node){

  node = await prisma.node.create({
   data:{
    name:body.name,
    callsign:body.callsign,
    type:body.type ?? "AREDN",
    ip:body.ip,
    mac:body.mac,
    status:"online",
    lastSeen:new Date()
   }
  });

 }
 else {

  node = await prisma.node.update({
   where:{
    id:node.id
   },
   data:{
    ip:body.ip,
    status:"online",
    lastSeen:new Date()
   }
  });

 }


 return node;

});



app.post("/gateway/telemetry",{
 preHandler:[
  gatewayGuard
 ]
},async(request:any)=>{

 const body=request.body as any;


 const device =
 await prisma.device.findFirst({
  where:{
   model:body.model
  }
 });


 if(!device){
   return {
    error:"Device not registered"
   };
 }


 return await prisma.telemetry.create({
  data:{
   deviceId:device.id,
   rssi:body.rssi,
   snr:body.snr,
   latitude:body.latitude,
   longitude:body.longitude,
   temperature:body.temperature,
   humidity:body.humidity
  }
 });


});


}

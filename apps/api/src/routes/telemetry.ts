import { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { authGuard, roleGuard } from "../middleware";

export default async function telemetryRoutes(app:FastifyInstance){

app.get("/telemetry",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN","OPERATOR","VIEWER")
 ]
},async()=>{
 return await prisma.telemetry.findMany({
  include:{
   device:true
  },
  orderBy:{
   createdAt:"desc"
  },
  take:100
 });
});


app.post("/telemetry",{
 preHandler:[
  authGuard,
  roleGuard("SUPERADMIN","ADMIN","OPERATOR","GATEWAY","API")
 ]
},async(request,reply)=>{

const body=request.body as any;

const data=await prisma.telemetry.create({
 data:{
  deviceId:body.deviceId,
  rssi:body.rssi,
  snr:body.snr,
  latitude:body.latitude,
  longitude:body.longitude,
  temperature:body.temperature,
  humidity:body.humidity
 }
});

await prisma.device.update({
 where:{
  id:body.deviceId
 },
 data:{
  battery:body.battery,
  voltage:body.voltage
 }
}).catch(()=>{});

return reply.send(data);

});

}

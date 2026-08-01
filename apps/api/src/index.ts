import Fastify from "fastify";
import nodeRoutes from "./routes/nodes";
import userRoutes from "./routes/users";
import deviceRoutes from "./routes/devices";
import telemetryRoutes from "./routes/telemetry";
import authRoutes from "./routes/auth";

const app=Fastify({
logger:true
});

app.register(nodeRoutes);
app.register(userRoutes);
app.register(deviceRoutes);
app.register(telemetryRoutes);
app.register(authRoutes);

app.get("/health",async()=>{
return{
status:"ok",
service:"ACE API",
version:"0.1.0-alpha",
timestamp:new Date().toISOString()
};
});

app.listen({
host:"0.0.0.0",
port:3000
});

import Fastify from "fastify";
import nodeRoutes from "./routes/nodes";

const app = Fastify({
  logger: true,
});

app.register(nodeRoutes);

app.get("/health", async () => {
  return {
    status: "ok",
    service: "ACE API",
    version: "0.1.0-alpha",
    timestamp: new Date().toISOString(),
  };
});

const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3000,
    });

    console.log("✅ ACE API started on http://0.0.0.0:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

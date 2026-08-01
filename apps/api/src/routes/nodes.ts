import { FastifyInstance } from "fastify";
import { prisma } from "../db";

export default async function nodeRoutes(app: FastifyInstance) {

  app.get("/nodes", async () => {
    return await prisma.node.findMany({
      include: {
        devices: true,
        owner: true
      }
    });
  });


  app.post("/nodes", async (request, reply) => {

    const body = request.body as {
      name: string;
      callsign?: string;
      type?: string;
    };


    const node = await prisma.node.create({
      data: {
        name: body.name,
        callsign: body.callsign,
        type: body.type ?? "UNKNOWN"
      }
    });


    return reply.send(node);
  });

}

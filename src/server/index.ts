import Fastify from "fastify";

import categoriser from "../features/categoriser";
import keywords from "../features/keywords";

const server = Fastify();
server.register(require('fastify-cors'), { 
    origin: (origin: string, cb: any) => {
        if(true){
            // /localhost/.test(origin)
          //  Request from localhost will pass
          cb(null, true)
          return
        }
        // Generate an error on other origins, disabling access
        cb(new Error("Not allowed"))
      }
})
server.setNotFoundHandler(
    async (req, reply) => {
        reply.code(404);
        return "Please send a POST request with a JSON { text: string } body";
    }
);

server.post<{ Body: { text: string } }>(
    "*",
    {
        schema: {
            body: {
                type: "object",
                additionalProperties: false,
                required: ["text"],
                properties: {
                    text: { type: "string" }
                }
            }
        }
    },
    async (request) => {

        const { text } = request.body;
        
        return {
            keywords: keywords(text),
            categoriser: categoriser(text),
        };

    }
);

export default server;
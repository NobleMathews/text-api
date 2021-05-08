import Fastify from "fastify";

import categoriser from "../features/categoriser";
import keywords from "../features/keywords";

const server = Fastify();

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
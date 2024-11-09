import Fastify from 'fastify'
import cors from '@fastify/cors';
import routes from "./routes.js";
import * as fastifyJwt from '@fastify/jwt';
import * as fastifyStatic from '@fastify/static';
import * as path from 'path';
import {fileURLToPath} from 'url';

const fastify = Fastify({logger: true});
const __dirname = path.dirname(fileURLToPath(import.meta.url));

await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

// static setup for the frontend assets
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'web/dist'),
  prefix: '/',
});

// register the jwt plugin
fastify.register(fastifyJwt, {secret: 's3cr3t'})

// JWT verification middleware
fastify.decorate("authenticate", async function (request, reply) {
  try {
    // Automatically verifies and decodes the JWT and attaches it to request.user
    console.log(request.headers.authorization);
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({error: 'Unauthorized'});
  }
});
// articles route
fastify.register(routes);

// Fallback to index.html for client-side routing
fastify.get('/', (req, reply) => {
  reply.sendFile('index.html');
});


// Run the server!
fastify.listen({port: 3000, host: "0.0.0.0"}, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

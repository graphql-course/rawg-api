// Añadir los imports
import express from "express";
import compression from "compression";
import cors from "cors";
import schema from "./schema/schema";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import environments from "./config/environments";
import expressPlayGround from "graphql-playground-middleware-express";
import { dataSources } from "./data";
import Database from "./config/database";
async function init() {
    // Inicializar variables de entorno
    if (process.env.NODE_ENV !== "production") {
        const envs = environments;
        console.log(envs);
    }

    // Inicializamos la aplicación express

    const app = express();

    // Añadimos configuración de Cors y compression
    app.use("*", cors());

    app.use(compression());

    const database = new Database();
    const db = await database.init();

    // Inicializamos el servidor de Apollo
    const server = new ApolloServer({
        schema: schema,
        context: { db },
        introspection: true, // Necesario,
        dataSources: ()  => ({
            genres: new dataSources.Genres(),
            games: new dataSources.Games(),
            platforms: new dataSources.Platforms()
        })
    });

    server.applyMiddleware({ app });

    app.use("/", expressPlayGround({
        endpoint: "/graphql"
    }));

    const PORT = process.env.PORT || 5000;
    const httpServer = createServer(app);

    httpServer.listen({ port: PORT }, (): void => console.log(`http://localhost:${PORT}/graphql`));
}

init();

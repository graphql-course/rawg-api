"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = __importDefault(require("./schema/schema"));
const apollo_server_express_1 = require("apollo-server-express");
const http_1 = require("http");
const environments_1 = __importDefault(require("./config/environments"));
const graphql_playground_middleware_express_1 = __importDefault(require("graphql-playground-middleware-express"));
const data_1 = require("./data");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== "production") {
            const envs = environments_1.default;
            console.log(envs);
        }
        const app = express_1.default();
        app.use("*", cors_1.default());
        app.use(compression_1.default());
        const server = new apollo_server_express_1.ApolloServer({
            schema: schema_1.default,
            introspection: true,
            dataSources: () => ({
                genres: new data_1.dataSources.Genres(),
                games: new data_1.dataSources.Games(),
                platforms: new data_1.dataSources.Platforms()
            })
        });
        server.applyMiddleware({ app });
        app.use("/", graphql_playground_middleware_express_1.default({
            endpoint: "/graphql"
        }));
        const PORT = process.env.PORT || 5000;
        const httpServer = http_1.createServer(app);
        httpServer.listen({ port: PORT }, () => console.log(`http://localhost:${PORT}/graphql`));
    });
}
init();

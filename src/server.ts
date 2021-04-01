import "reflect-metadata";
import { createConnection } from "typeorm";
import * as bodyParser from "body-parser";
import { createExpressServer } from "routing-controllers";
import { TeacherController } from "./routes/TeacherController";
import { QuestionaryController } from './routes/QuestionaryController';
import { ResponseController } from "./routes/ResponseController";
import { ShareController } from "./routes/ShareController";
import { StudentController } from "./routes/StudentController";
import { LoginController } from "./routes/LoginController";
import { HealtCheckController } from "./routes/HealtCheckController";
import { AdminController } from "./routes/AdminController";
import { ImageController } from "./routes/ImageController";
import { ConfigurationController } from "./routes/ConfigurationController";
import { QuestionController } from "./routes/QuestionController";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import https from 'https';
import fs from 'fs';

const env = process.env.NODE_ENV

const dbConfig: any = {
    "prod": {
        "type": "postgres",
        "host": "ec2-52-71-55-81.compute-1.amazonaws.com",
        "port": 5432,
        "username": "pfdvuibzlypdgr",
        "password": "c3cf167a308c674b8551eefd1cf9c78b1c8cb6c0dbc57507b47fa660241c732b",
        "database": "dcl2t8huchm06i",
        "synchronize": true,
        "logging": true,
        "namingStrategy": new SnakeNamingStrategy(),
        "entities": [
            "dist/entity/**/*.js"
        ],
        "migrations": [
            "src/migration/**/*.ts"
        ],
        "subscribers": [
            "src/subscriber/**/*.ts"
        ],
        "cli": {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    },
    "default": {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "askque",
        "password": "123456",
        "database": "askque",
        "synchronize": true,
        "logging": false,
        "namingStrategy": new SnakeNamingStrategy(),
        "entities": [
            "dist/entity/**/*.js"
        ],
        "migrations": [
            "src/migration/**/*.ts"
        ],
        "subscribers": [
            "src/subscriber/**/*.ts"
        ],
        "cli": {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    }
}
const connectionEnv = env == "PROD" ? "prod" : "default"

console.log('connectionEnv', connectionEnv)

const config = dbConfig[connectionEnv]

createConnection(config).then(async connection => {

    console.log('Connection successfully')

    // creates express app, registers all controller routes and returns you express app instance
    console.log('Register controllers')
    const app = createExpressServer({
        development: false,
        cors: true,
        controllers: [
            TeacherController,
            QuestionaryController,
            ResponseController,
            ShareController,
            StudentController,
            LoginController,
            HealtCheckController,
            AdminController,
            ImageController,
            ConfigurationController,
            QuestionController
        ] // we specify controllers we want to use
    });

    console.log('Create app sucess!')
    const port = process.env.PORT || 3000

    app.use(bodyParser.json());
    console.log(`Listen port ${port}'`)

    const credentials = {
	key: fs.readFileSync('/etc/certs/wildcard.fi.uba.ar/privkey.pem'),
       	cert: fs.readFileSync('/etc/certs/wildcard.fi.uba.ar/cert.pem')
    };
    var httpsServer = https.createServer(credentials, app)
    httpsServer.listen(port);

}).catch(error => console.log(error));

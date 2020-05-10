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


const env = process.env.NODE_ENV

const dbConfig: any = {
    "prod": {
        "type": "postgres",
        "host": "ec2-174-129-254-218.compute-1.amazonaws.com",
        "port": 5432,
        "username": "efegleukavudep",
        "password": "431957412617919b50b5be027181d097f67c9937039dfe838d13151dcf110e56",
        "database": "d3nfkmqagrbs2h",
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

    app.listen(port);
}).catch(error => console.log(error));

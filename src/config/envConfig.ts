import dotenv from 'dotenv'
const env = process.env.NODE_ENV


/***
 * 
 * Esta clase tiene la configuration para conectarse a AWS
 * 
 * 
*/

const connectionEnv = env == "PROD" ? "prod" : "default"
if (connectionEnv == "default") {
    /***
     * En caso de que sea levantado de manera local, se toma la configuración de archivo local
    */
    console.log('Start up config')
    dotenv.config();
}

const enviromentConfigutation = {
    awsRegion: process.env.AWS_S3_REGION,
    awsAccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    awsBucket: process.env.AWS_S3_BUCKET
}


export default enviromentConfigutation;
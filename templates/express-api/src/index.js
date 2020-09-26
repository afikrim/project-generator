/**
 * Import npm modules
 */
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';

/**
 * Import our classes
 */
import App from '~/App';
import Routes from '~/routes';

// Read config from .env
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
// normalize port if it's string
const PORT = process.env.PORT
    ? typeof process.env.PORT === 'string'
        ? parseInt(process.env.PORT, 10)
        : process.env.PORT
    : 3000;

// create new Application
const app = new App();

// set application middlewares
app.setMiddlewares([
    cors(),
    helmet(),
    morgan(NODE_ENV === 'production' ? 'combined' : 'dev'),
])

// set application routes
app.setRoutes(Routes);

// set port for express app
app.setPort(PORT);

// create new server using http
const server = http.createServer(app.getApp());
// listen server to locahost:PORT
server.listen(PORT);
server.on('listening', () => {
    console.log(`Server start in http://locahost:${PORT}`);
});
server.on('error', (err) => {
    console.error(`Error: ${err}`);
});


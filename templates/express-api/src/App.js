import express from 'express';

/**
 * Export application class
 */
export default class Application {
    /**
     * Constructor
     */
    constructor() {
        this.app = express();
    }

    /**
     * Function to set application middlewares
     * 
     * @param Middleware[] middlewares
     */
    setMiddlewares(middlewares) {
        middlewares.map((middleware) => {
            this.app.use(middleware)
        })
    }

    /**
     * Function to set application routes
     * 
     * @param Middleware[] routes 
     */
    setRoutes(routes) {
        routes.map((route) => {
            this.app.use(route.name, route.handler);
        })
    }

    /**
     * Function to set application port
     *
     * @param int PORT
     * @return void
     */
    setPort(PORT) {
        this.app.set('port', PORT);
    }

    /**
     * Function to get application
     * 
     * @return Application
     */
    getApp() {
        return this.app;
    }
}

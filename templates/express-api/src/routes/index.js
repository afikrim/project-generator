import HomeController from '~/controllers/HomeController';

/**
 * declare class
 */
const homeRoutes = new HomeController();

/**
 * Exporting routes
 *
 * @return {name: string, handler: [...Router]}[]
 */
export default [
    {name: '/', handler: [/*middleware goes here*/ homeRoutes.index]}
]

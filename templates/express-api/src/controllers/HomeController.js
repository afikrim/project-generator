export default class HomeRoutes {
    /**
     * Index function
     *
     * @param Request req
     * @param Response res
     * @return Response res
     */
    async index(req, res) {
        return res.json({
            app: {
                name: 'Example',
                version: '0.0.0'
            }
        })
    }
}

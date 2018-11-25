import * as express from "express";

const PORT = 3000;

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void{
        this.app.use(express.static('frontend'))
    }
}

const app = new App().app;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})

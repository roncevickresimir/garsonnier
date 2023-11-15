import express from 'express';
import App from './app';
import { ConfigService } from './services/config.service';

const config = new ConfigService();

const app = express();

app.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);

    try {
        new App();
    } catch (error) {
        console.log(error);
    }
});

app.get(config.meta_webhooks_callback, (req, res) => {
    console.log(req);
    const hub = {
        mode: req.query['hub.mode'] as string,
        challenge: req.query['hub.challenge'] as string,
        verify_token: req.query['hub.verify_token'] as string,
    };

    res.status(200).send(hub.challenge);
});

app.get('/health', (_req, res) => {
    res.status(200).send();
});

import IndexService from './services/index.service';
import NjuskaloService from './services/njuskalo.service';
import OglasnikService from './services/oglasnik.service';
import WhatsappService from './services/whatsapp.service';

const schedule = require('node-schedule');

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((_req: any, res: any) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

const main = async () => {
    const items = [
        ...(await NjuskaloService.getItems()),
        ...(await IndexService.getItems()),
        ...(await OglasnikService.getItems()),
    ];

    items.forEach((i: string) => {
        WhatsappService.sendMessage(i);
    });
};

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);

    schedule.scheduleJob('35 * * * *', () => {
        main();
    });
});

import * as schedule from 'node-schedule';

import IndexhrService from './services/indexhr.service';
import NjuskaloService from './services/njuskalo.service';
import OglasnikService from './services/oglasnik.service';
import WhatsappService from './services/whatsapp.service';
import ItemStorageService from './services/storage.service';
import { Item } from './models/item.model';

export default class App {
    private static readonly whatsapp: WhatsappService = new WhatsappService();
    private static readonly njuskalo: NjuskaloService = new NjuskaloService();
    private static readonly indexhr: IndexhrService = new IndexhrService();
    private static readonly oglasnik: OglasnikService = new OglasnikService();
    private static readonly storage: ItemStorageService =
        new ItemStorageService();

    constructor() {
        App.main();

        schedule.scheduleJob('35 * * * *', () => {
            App.main();
        });
    }

    private static main = async () => {
        const items: Item[] = [
            ...(await this.njuskalo.getItems()),
            ...(await this.indexhr.getItems()),
            ...(await this.oglasnik.getItems()),
        ];

        for (const i of items) {
            const exists = !!(await this.storage.getItemByTitle(i.title));

            if (exists) {
                continue;
            }

            const messageSent = await this.whatsapp.sendMessage(i);

            if (messageSent) {
                await this.storage.putItem(i);
            }

            await new Promise((res) => setTimeout(res, 500));
        }
    };
}

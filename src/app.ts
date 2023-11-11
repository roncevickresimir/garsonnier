import * as schedule from 'node-schedule';

import IndexService from './services/index.service';
import NjuskaloService from './services/njuskalo.service';
import OglasnikService from './services/oglasnik.service';
import WhatsappService from './services/whatsapp.service';
import ItemStorageService from './services/storage.service';
import { Item } from './models/item.model';

export default class App {
    private readonly whatsapp: WhatsappService = new WhatsappService();
    private readonly njuskalo: NjuskaloService = new NjuskaloService();
    private readonly index: IndexService = new IndexService();
    private readonly oglasnik: OglasnikService = new OglasnikService();
    private readonly storage: ItemStorageService = new ItemStorageService();

    public run() {
        this.main();

        schedule.scheduleJob('35 * * * *', () => {
            this.main();
        });
    }

    private main = async () => {
        console.log('app.main()');

        const items: Item[] = [
            ...(await this.njuskalo.getItems()),
            ...(await this.index.getItems()),
            ...(await this.oglasnik.getItems()),
        ];

        for (const i of items) {
            const exists = !!(await this.storage.getItemByName(i.name));

            if (exists) {
                continue;
            }

            await this.storage.putItem(i);
            await this.whatsapp.sendMessage(i.url);

            await new Promise((res) => setTimeout(res, 500));
        }
    };
}

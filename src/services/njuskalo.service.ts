import { default as axios } from 'axios';
import { parse } from 'node-html-parser';

import { ConfigService } from './config.service';
import { Item } from '../models/item.model';

export default class NjuskaloService {
    private readonly config: ConfigService = new ConfigService();

    private url: string;
    public data: Item[] = [];

    constructor() {
        this.url = `https://www.njuskalo.hr/iznajmljivanje-stanova/zagreb?price%5Bmin%5D=${this.config.min_price}&price%5Bmax%5D=${this.config.max_price}`;
    }

    public getItems = async (): Promise<Item[]> => {
        const items = await this.fetchData();

        const result = items.filter((i) => !this.data.includes(i));

        if (result.length) {
            this.data = items;
        }

        return result;
    };

    private fetchData = async (): Promise<Item[]> => {
        const response = await axios.get(this.url);
        const root = parse(response.data);

        const entries = root
            .querySelectorAll('.EntityList--ListItemRegularAd .EntityList-item')
            .map((e: any) => {
                return e.querySelector('a')?.getAttribute('href');
            })
            .filter((e: any) => !!e);

        return entries.map((href: string) => {
            return {
                name: href.split('/nekretnine/')[1].split('-oglas')[0],
                url: `https://www.njuskalo.hr${href}`,
            } as Item;
        });
    };
}

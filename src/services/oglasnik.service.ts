const axios = require('axios').default;
import { parse } from 'node-html-parser';

import { ConfigService } from './config.service';
import { Item } from '../models/item.model';

export default class OglasnikService {
    private readonly config: ConfigService = new ConfigService();

    private url: string;
    public data: Item[] = [];

    constructor() {
        this.url = `https://www.oglasnik.hr/stanovi-najam?ad_price_from=${this.config.min_price}&ad_price_to=${this.config.max_price}&ad_location_2%5B%5D=7442`;
    }

    public getItems = async (): Promise<Item[]> => {
        const items = await this.update();

        const result = items.filter((i) => !this.data.includes(i));

        if (result.length) {
            this.data = items;
        }

        return result;
    };

    private update = async (): Promise<Item[]> => {
        const response = await axios.get(this.url);
        const root = parse(response.data);

        const entries = root
            .querySelectorAll('.izdvojeno-osnovni')
            .map((e: any) => {
                return e.getAttribute('href');
            })
            .filter((e: any) => !!e);

        return entries.map((href: string) => {
            return {
                name: href.split('/stanovi-najam/')[1].split('-oglas')[0],
                url: href,
            } as Item;
        });
    };
}

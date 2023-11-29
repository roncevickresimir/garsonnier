import { default as axios } from 'axios';
import { parse } from 'node-html-parser';

import { ConfigService } from './config.service';
import { Item, ItemType } from '../models/item.model';
import { getUrlMetaData } from './utils';

export default class OglasnikService {
    private readonly config: ConfigService = new ConfigService();

    private baseUrl: string;
    private queryUrl: string;

    constructor() {
        this.baseUrl = 'https://www.oglasnik.hr/';
        this.queryUrl = `https://www.oglasnik.hr/stanovi-najam?ad_price_from=${this.config.min_price}&ad_price_to=${this.config.max_price}&ad_location_2%5B%5D=7442`;
    }

    public getItems = async (): Promise<Item[]> => {
        const response = await axios.get(this.queryUrl);
        const root = parse(response.data);

        const entries = root
            .querySelectorAll('.izdvojeno-osnovni')
            .map((e) => e.getAttribute('href')?.split(this.baseUrl)[1])
            .filter((e) => !!e);

        return Promise.all(
            entries.map(async (url: string): Promise<Item> => {
                const { title, image } = await getUrlMetaData(
                    `${this.baseUrl}${url}`
                );

                return {
                    title: title,
                    url: url,
                    image: image,
                    type: ItemType.OGLASNIK,
                };
            })
        );
    };
}

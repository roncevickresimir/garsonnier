import { default as axios } from 'axios';
import { parse } from 'node-html-parser';

import { ConfigService } from './config.service';
import { Item, ItemType } from '../models/item.model';
import { getUrlMetaData } from './utils';

export default class NjuskaloService {
    private readonly config: ConfigService = new ConfigService();

    private baseUrl: string;
    private queryUrl: string;

    constructor() {
        this.baseUrl = 'https://www.njuskalo.hr/';
        this.queryUrl = `https://www.njuskalo.hr/iznajmljivanje-stanova/zagreb?price%5Bmin%5D=${this.config.min_price}&price%5Bmax%5D=${this.config.max_price}`;
    }

    public getItems = async (): Promise<Item[]> => {
        const response = await axios.get(this.queryUrl);
        const root = parse(response.data);

        const entries = root
            .querySelectorAll('.EntityList--ListItemRegularAd .EntityList-item')
            .map((e) => e.querySelector('a')?.getAttribute('href')?.slice(1))
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
                    type: ItemType.NJUSKALO,
                };
            })
        );
    };
}

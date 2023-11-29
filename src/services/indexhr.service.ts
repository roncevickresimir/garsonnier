import { default as axios } from 'axios';
import { parse } from 'node-html-parser';

import { ConfigService } from './config.service';
import { Item, ItemType } from '../models/item.model';
import { getUrlMetaData } from './utils';

export default class IndexhrService {
    private readonly config: ConfigService = new ConfigService();

    private baseUrl: string;
    private queryUrl: string;

    constructor() {
        this.baseUrl = 'https://www.index.hr/';
        this.queryUrl = `https://www.index.hr/oglasi/najam-stanova/gid/3279?pojam=&sortby=1&elementsNum=10&cijenaod=${this.config.min_price}&cijenado=${this.config.max_price}&tipoglasa=1&pojamZup=1153&grad=&naselje=&attr_Int_988=&attr_Int_887=&attr_bit_stan=&attr_bit_brojEtaza=&attr_gr_93_1=&attr_gr_93_2=&attr_Int_978=&attr_Int_1334=&attr_bit_eneregetskiCertifikat=&vezani_na=988-887_562-563_978-1334`;
    }

    public getItems = async (): Promise<Item[]> => {
        const response = await axios.get(this.queryUrl);
        const root = parse(response.data);

        const entries = root
            .querySelectorAll('.OglasiRezHolder')
            .map((e) => e.querySelector('a')?.getAttribute('href')?.split(this.baseUrl)[1])
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
                    type: ItemType.INDEXHR,
                };
            })
        );
    };
}

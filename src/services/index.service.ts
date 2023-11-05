import { parse } from 'node-html-parser';
const axios = require('axios').default;

export default class IndexService {
    private static url =
        'https://www.index.hr/oglasi/najam-stanova/gid/3279?pojam=&sortby=1&elementsNum=10&cijenaod=300&cijenado=500&tipoglasa=1&pojamZup=1153&grad=&naselje=&attr_Int_988=&attr_Int_887=&attr_bit_stan=&attr_bit_brojEtaza=&attr_gr_93_1=&attr_gr_93_2=&attr_Int_978=&attr_Int_1334=&attr_bit_eneregetskiCertifikat=&vezani_na=988-887_562-563_978-1334';
    public static data: string[] = [];

    public static getItems = async (): Promise<string[]> => {
        const items = await this.update();

        const result = items.filter((i) => !this.data.includes(i));

        if (result.length) {
            this.data = items;
        }

        return result;
    };

    public static update = async () => {
        const response = await axios.get(this.url);
        const root = parse(response.data);

        const entries = root
            .querySelectorAll('.OglasiRezHolder')
            .map((e: any) => {
                return e.querySelector('a')?.getAttribute('href');
            })
            .filter((e: any) => !!e);

        return entries.map((href: any) => {
            return `${href}`;
        });
    };
}

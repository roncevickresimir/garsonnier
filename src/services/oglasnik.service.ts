import { parse } from 'node-html-parser';
const axios = require('axios').default;

export default class OglasnikService {
    private static url =
        'https://www.oglasnik.hr/stanovi-najam?ad_price_from=300&ad_price_to=500&ad_location_2%5B%5D=7442';
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
            .querySelectorAll('.izdvojeno-osnovni')
            .map((e: any) => {
                return e.getAttribute('href');
            })
            .filter((e: any) => !!e);

        return entries.map((href: any) => {
            return `${href}`;
        });
    };
}

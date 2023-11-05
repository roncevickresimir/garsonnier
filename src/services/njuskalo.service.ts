import { parse } from 'node-html-parser';
const axios = require("axios").default

export default class NjuskaloService {
    private static url = 'https://www.njuskalo.hr/iznajmljivanje-stanova/zagreb?price%5Bmin%5D=300&price%5Bmax%5D=500'
    public static data: string[] = [];

    public static getItems = async (): Promise<string[]> => {
        const items = await this.update();

        const result = items.filter(i => !this.data.includes(i));
        
        if(result.length) {
            this.data = items;
        }
        
        return result
    }

    public static update = async () => {
        const response = await axios.get(this.url);
        const root = parse(response.data);

        const entries = root.querySelectorAll(
            '.EntityList--ListItemRegularAd .EntityList-item'
        );

        return entries.map(e => {
            const href = e.querySelector("a")?.getAttribute('href');

            return `https://www.njuskalo.hr${href}`;
        })
    }
}

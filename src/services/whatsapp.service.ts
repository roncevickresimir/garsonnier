import { default as axios } from 'axios';

import { ConfigService } from './config.service';
import { Item, ItemType } from 'models/item.model';

export default class WhatsappService {
    private readonly config: ConfigService = new ConfigService();

    private accessToken: string;
    private senderId: string;
    private recipientId: string;
    private templates: Record<ItemType, string>;

    constructor() {
        this.accessToken = this.config.wa_access_token;
        this.senderId = this.config.wa_sender_id;
        this.recipientId = this.config.wa_recipient_id;
        this.templates = {
            INDEXHR: 'listing_template_indexhr',
            NJUSKALO: 'listing_template_njuskalo',
            OGLASNIK: 'listing_template_oglasnik',
        };
    }

    public sendMessage = async (item: Item): Promise<boolean> => {
        try {
            await axios.post(
                `https://graph.facebook.com/v17.0/${this.senderId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: this.recipientId,
                    type: 'template',
                    template: {
                        name: this.templates[item.type],
                        language: {
                            code: 'en',
                        },
                        components: [
                            {
                                type: 'header',
                                parameters: [
                                    {
                                        type: 'image',
                                        image: {
                                            link: item.image.length
                                                ? item.image
                                                : 'https://www.oglasnik.hr/assets/img/fallback-images/icn_nekretnine.png',
                                        },
                                    },
                                ],
                            },
                            {
                                type: 'body',
                                parameters: [
                                    {
                                        type: 'text',
                                        text: item.title,
                                    },
                                ],
                            },
                            {
                                type: 'button',
                                sub_type: 'url',
                                index: '0',
                                parameters: [
                                    {
                                        type: 'payload',
                                        payload: item.url,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return true;
        } catch (e) {
            console.log(item);
            console.log(e.response.data);

            return false;
        }
    };
}

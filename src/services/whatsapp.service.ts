import { default as axios } from 'axios';

import { ConfigService } from './config.service';

export default class WhatsappService {
    private readonly config: ConfigService = new ConfigService();

    private accessToken: string;
    private senderId: string;
    private recipientId: string;

    constructor() {
        this.accessToken = this.config.wa_access_token;
        this.senderId = this.config.wa_sender_id;
        this.recipientId = this.config.wa_recipient_id;
    }

    public sendMessage = async (message: string): Promise<boolean> => {
        try {
            const response = await axios.post(
                `https://graph.facebook.com/v17.0/${this.senderId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: this.recipientId,
                    type: 'text',
                    text: {
                        preview_url: true,
                        body: message,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data);

            return true;
        } catch (e) {
            console.log(e.response.data);

            return false;
        }
    };
}

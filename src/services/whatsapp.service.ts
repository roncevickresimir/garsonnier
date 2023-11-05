const axios = require("axios").default

export default class WhatsappService {
    private static accessToken =
        'EAAQxkvrLalgBOZCBNq3cf7QZC6H73R3zlxC8pmFXTMoiQMqX2D6wlvOxCK8CCJZAlzVwrYSOwVNEJMD7oYnm3zRVqn9OfXsfa6ZC7wWJHA8ySWBProPQ5bFZA6JZAz6ZBocqMxy640Qfx5f4wnlm8o3rcSSIwnud4x3RpnUfAZCJUOPQPOFZBZAMfd0zIRH8UKg3Wd';
    private static senderId = '172462892610373';
    private static recipientId = '385923841148';

    public static sendMessage = (message: string) => {
        axios
            .post(
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
            )
            .then((data: any) => {
                'Message sent:';
                console.log(data.data);
            })
            .catch((e: any) => {
                'Message error:';
                console.log(e.response.data);
            });
    };
}

const axios = require("axios").default

export default class WhatsappService {
    // private static accessToken = 'EAAQxkvrLalgBO33kxviTrfblR7kpDn5AR4inVBfRr5sfoCbdZBYhZBGXZAMGLhxtd8gyBTBpzH0cp0X9atZCanGLluuIOfxsZCFQOIINvoYjnLV3HapgiorFS2jLVk8vCpyYT8llQm4xtPYnGhu6AcM90j9i4D7yCNvpahFF09g4YYf7c7s9vPv7CxIIo5xoo';
    private static accessToken = 'EAAQxkvrLalgBO3ymJ8QlMnoGZBqdv2DZA6GzyAZC9R4XPTTzhZAY7NyMZAZA4ZByRMtuCjZCYYZCpvO3AZBx5399deU3UH0PNV9lXDUCxUIfdWE1ju8RNuoqN0rrcq1YRFel4sp0KHfJwOKrPx57I9A1QoM0JbY0LEdAo7tv5hvZBUb5sY47w1qVaL23wRZCRwtRb8Ayy0BP6rN0rIgYSdFd';
    private static senderId = '172462892610373';
    private static recipientId = '385923841148';
    
    public static sendMessage = (message: string) => {
        axios.post(
            `https://graph.facebook.com/v17.0/${this.senderId}/messages`, 
            {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": this.recipientId,
                "type": "text",
                "text": { 
                  "preview_url": true,
                  "body": message
                }
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((data: any) => {
            console.log(data.data)
        })
        .catch((e: any) => {
            console.log(e.response.data)
        });
    } 
}

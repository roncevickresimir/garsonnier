require('dotenv').config();

export class ConfigService {
    public aws_region: string;
    public table_name: string;

    public wa_access_token: string;
    public wa_sender_id: string;
    public wa_recipient_id: string;

    public min_price: string;
    public max_price: string;

    constructor() {
        this.aws_region = this.parseEnv('AWS_REGION');
        this.table_name = this.parseEnv('TABLE_NAME');

        this.wa_access_token = this.parseEnv('WA_ACCESS_TOKEN');
        this.wa_sender_id = this.parseEnv('WA_SENDER_ID');
        this.wa_recipient_id = this.parseEnv('WA_RECIPIENT_ID');

        this.max_price = this.parseEnv('MAX_PRICE');
        this.max_price = this.parseEnv('MAX_PRICE');
    }

    private parseEnv = (envName: string): string => {
        const value: string | undefined = process.env[envName];

        if (!value) {
            throw new Error(`${envName} not defined.`);
        }

        return value;
    };
}

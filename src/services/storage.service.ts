import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient, PutItemOutput } from 'aws-sdk/clients/dynamodb';

import { ConfigService } from './config.service';
import { Item } from 'models/item.model';

export default class ItemStorageService {
    private readonly dynamoDB: DocumentClient = new DynamoDB.DocumentClient();
    private readonly config: ConfigService = new ConfigService();

    constructor() {
        AWS.config.update({ region: this.config.aws_region });
    }

    public putItem = (item: Item): Promise<PutItemOutput> => {
        const params = {
            TableName: this.config.table_name,
            Item: item,
        };
        return this.dynamoDB.put(params).promise();
    };

    public getItemByName = async (name: string): Promise<Item | undefined> => {
        const params = {
            TableName: this.config.table_name,
            Key: { ['name']: name },
        };

        return (await this.dynamoDB.get(params).promise()).Item as
            | Item
            | undefined;
    };
}

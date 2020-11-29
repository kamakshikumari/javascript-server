import * as mongoose from 'mongoose';
import seedData from './seeds';
export default class Database {
    static open (mongoURL) {
        return new Promise((resolve, reject ) => {
            console.log('Mongo URL : ', mongoURL);
            mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log('Database Connected');
                // tslint:disable-next-line: no-null-keyword
                seedData();
                resolve(undefined);
            });
        });
    }

    static disconnect () {
        mongoose.disconnect(err => {
            if (err) {
                console.log(err);
            }
            console.log('Connection Disconnected');
        });
    }
}

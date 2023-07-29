import 'module-alias';
import * as dotenv from 'dotenv';

import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';

dotenv.config();

mongoHelper
  .connect(`mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}/`)
  .then(async () => {
    const app = (await import('./config/app')).default;

    app.listen(3333, () => {
      console.log('Server running at http://localhost:3333');
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

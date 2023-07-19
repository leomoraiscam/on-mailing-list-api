import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';

mongoHelper
  .connect('mongodb://127.0.0.1:27017/')
  .then(async () => {
    const app = (await import('./config/app')).default;

    app.listen(3333, () => {
      console.log('Server running at http://localhost:3333');
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

import { Container } from 'inversify';

import { bootstrapApplication } from './app/bootstrap';
import config from './config';

function main(): void {
  const container = new Container();

  bootstrapApplication(container)
    .then((app) => {
      const PORT = (config.port as unknown as number) || 3000;
      app.listen(PORT, () => console.log(`[server]: Running on PORT:${PORT}`));
    })
    .catch((err) => {
      console.error('Bootstrap failed:', err);
      process.exit(1);
    });
}

main();

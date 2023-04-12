import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  // /u01/Middleware/Oracle_Home/user_projects/domains/base_domain/servers/AdminServer/upload

  // 47071007
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'zone.js';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfVpdX2tWfFN0QHNYf1R1dF9EZ0wgOX1dQl9mSXpRfkRjXHtcdHBVTmJXU00=');
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

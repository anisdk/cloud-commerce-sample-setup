import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { translations, translationChunksConfig } from '@spartacus/assets';
import { B2cStorefrontModule } from '@spartacus/storefront';

import { OccConfig } from '@spartacus/core';
import { environment } from './../environments/environment';
const occConfig: OccConfig = { backend: { occ: {} } };

// only provide the `occ.baseUrl` key if it is explicitly configured, otherwise the value of
// <meta name="occ-backend-base-url" > is ignored.
// This in turn breaks the call to the API aspect in public cloud environments
if (environment.occBaseUrl) {
  occConfig.backend.occ.baseUrl = environment.occBaseUrl;
}
if (environment.prefix) {
  occConfig.backend.occ.prefix = environment.prefix;
}
else {
  occConfig.backend.occ.prefix = '/occ/v2/';
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    B2cStorefrontModule.withConfig({
      backend: occConfig.backend,
      context: {
        currency: ['USD'],
        language: ['en'],
        baseSite: ['electronics-spa']
      },

      i18n: {
        // resources: translations,
        backend: {
            loadPath: 'assets/i18n-assets/{{lng}}/{{ns}}.json'
            // crossOrigin: true (use this option when i18n assets come from a different domain)
        },
        chunks: translationChunksConfig,
        fallbackLang: 'en'
      },
      features: {
        level: '2.1'
      }
    }),
    BrowserTransferStateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

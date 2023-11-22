import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, provideConfigFactory, SiteContextConfig } from "@spartacus/core";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";
import { myOccConfigFactory } from "src/app/myOccConfigFactory";

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig(<OccConfig>{
  }), provideConfig(<SiteContextConfig>{
    context: {
      currency: ['USD', 'GBP'],
      language: ['en', 'de', 'ja', 'zh'],
      baseSite: ['electronics-spa', 'apparel-uk-spa'],
      urlParameters: ['baseSite', 'language', 'currency'],
    },
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }),
  provideConfigFactory(myOccConfigFactory),
  /*
  provideConfig(<OccConfig>{
    backend: {
      media: {
        baseUrl: 'https://api.clwfyft1x1-csamer2021-d37-public.model-t.cc.commerce.ondemand.com',
      }
    },
  }), 
  */
   provideConfig(<FeaturesConfig>{
    features: {
      level: '6.4'
    }
  })]
})
export class SpartacusConfigurationModule { }

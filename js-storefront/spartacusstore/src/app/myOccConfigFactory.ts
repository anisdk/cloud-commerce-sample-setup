import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OccConfig, provideConfigFactory } from '@spartacus/core';

export function myOccConfigFactory(): OccConfig {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const baseUrl = isBrowser
    ? 'https://api.clwfyft1x1-csamer2021-d37-public.model-t.cc.commerce.ondemand.com'
    : 'https://api.clwfyft1x1-csamer2021-d37-private.model-t.cc.commerce.ondemand.com';

    return { backend: { occ: { baseUrl: baseUrl }, media: { baseUrl: "https://api.clwfyft1x1-csamer2021-d37-public.model-t.cc.commerce.ondemand.com" } } };
}
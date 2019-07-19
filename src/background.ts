chrome.webRequest.onBeforeRequest.addListener(
  (details: chrome.webRequest.WebRequestBodyDetails) => {
    const url: URL = new URL(details.url);
    const search: string[] = url.search.replace(/^\?/, '').split('&');
    const params: string[] = [];

    let re: boolean = false;

    if (!search) return;

    let i: number = search.length;
    while (i--) {
      if (
        !search[i].match(
          /^fbclid|^utm_|^fb_action|^fb_source|^action_object_map|^action_type_map|^action_ref_map/
        )
      ) {
        params.push(search[i]);
      } else {
        re = true;
      }
    }
    if (re) {
      const base: string = `${url.origin}${url.pathname}`;
      const to: string = base + (params.length ? `?${params.join('&')}` : '');
      return {
        redirectUrl: to,
      };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

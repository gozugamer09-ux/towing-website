import fs from 'fs';
const body = fs.readFileSync('design/preview/alejos-preview.html','utf8');
fs.writeFileSync('design/preview/_wrapped.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>${body}</body></html>`);

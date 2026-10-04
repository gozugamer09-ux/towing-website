// Builds the Florida service-area map data (state outline, Lee County, city points) as SVG paths.
// Source: us-atlas (US Census Bureau cartographic boundaries, ISC). Run: node scripts/make-florida.mjs
import fs from 'node:fs';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

const states = JSON.parse(fs.readFileSync('node_modules/us-atlas/states-10m.json', 'utf8'));
const counties = JSON.parse(fs.readFileSync('node_modules/us-atlas/counties-10m.json', 'utf8'));
const fl = feature(states, states.objects.states).features.find(f => f.id === '12');
const lee = feature(counties, counties.objects.counties).features.find(f => f.id === '12071');

const W = 600, H = 560, PAD = 18;
const proj = geoMercator().fitExtent([[PAD, PAD], [W - PAD, H - PAD]], fl);
const path = geoPath(proj);
const round = d => d.replace(/(\d+\.\d{1})\d+/g, '$1');

const cities = {
  'Cape Coral': [-81.9495, 26.5629], 'Fort Myers': [-81.8723, 26.6406], 'Naples': [-81.7948, 26.1420],
  'Sarasota': [-82.5307, 27.3364], 'Tampa': [-82.4572, 27.9506], 'Orlando': [-81.3792, 28.5384],
  'Miami': [-80.1918, 25.7617], 'Jacksonville': [-81.6557, 30.3322], 'Tallahassee': [-84.2807, 30.4383],
  'West Palm Beach': [-80.0534, 26.7153], 'Pensacola': [-87.2169, 30.4213], 'Key West': [-81.7800, 24.5551],
};
const pts = Object.fromEntries(Object.entries(cities).map(([k, ll]) => [k, proj(ll).map(v => +v.toFixed(1))]));
const out = { viewBox: `0 0 ${W} ${H}`, state: round(path(fl)), lee: round(path(lee)), cities: pts };
fs.writeFileSync('src/data/florida.json', JSON.stringify(out));
console.log('state path chars', out.state.length, 'lee', out.lee.length, pts);

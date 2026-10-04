const path = require('node:path');
require('esbuild').buildSync({
  entryPoints: [path.join(__dirname, '../src/otium-video-player.jsx')],
  outfile: path.join(__dirname, '../js/generated/otium-video-player.js'),
  bundle: true, minify: true, format: 'iife', globalName: 'OtiumMuxPlayer', target: 'es2020',
  define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'linked'
});
console.log('Built lazy Production Mux player');

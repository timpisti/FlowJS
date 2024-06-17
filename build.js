require('esbuild').build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/main.js',
}).catch(() => process.exit(1));

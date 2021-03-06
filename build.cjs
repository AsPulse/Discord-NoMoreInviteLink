const startTime = new Date();

const red     = '\u001b[31m';
const magenta = '\u001b[35m';
const reset   = '\u001b[0m';

console.log(`${magenta}The build has started...${reset}`);
require('esbuild').build({
    entryPoints: ['src/index.ts'],
    bundle: false,
    outfile: 'dist/index.js',
    minify: false,
    sourcemap: true,
    platform: 'node'
}).then(() => {
    console.log(`${magenta}Build finished successfully.${reset} [${new Date().getTime() - startTime.getTime()}ms]`)
}).catch(() => {
    console.log(`${red}Build failed.${reset} [${new Date().getTime() - startTime.getTime()}ms]`)
});

require('esbuild').build({
    entryPoints: ['src/chk.ts'],
    bundle: false,
    outfile: 'dist/chk.js',
    minify: false,
    sourcemap: true,
    platform: 'node'
}).then(() => {
    console.log(`${magenta}Build finished successfully.${reset} [${new Date().getTime() - startTime.getTime()}ms]`)
}).catch(() => {
    console.log(`${red}Build failed.${reset} [${new Date().getTime() - startTime.getTime()}ms]`)
});

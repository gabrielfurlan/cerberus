NODE_ENV=production npm run build
mkdir -p cerberus/build
cp manifest.json background.js inject.js styles.css cerberus
cp build/zapzap-app.js cerberus/build
cp -r assets cerberus
VERSION=`perl -ne 'print $1 if /^\s*.version.+?([0-9.]+)/' manifest.json`
zip dist/cerberus-v$VERSION.zip -r cerberus
rm -rf cerberus


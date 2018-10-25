NODE_ENV=production npm run build
VERSION=`perl -ne 'print $1 if /^\s*.version.+?([0-9.]+)/' manifest.json`
mkdir -p cerberus-$VERSION/build
cp manifest.json background.js inject.js styles.css cerberus-$VERSION
cp build/zapzap-app.js cerberus-$VERSION/build
cp -r assets cerberus-$VERSION
cp COMO_INSTALAR.mp4 cerberus-$VERSION
zip dist/cerberus-v$VERSION.zip -r cerberus-$VERSION
rm -rf cerberus-$VERSION


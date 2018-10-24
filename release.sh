NODE_ENV=production npm run build
zip dist/cerberus-v0.0.4.zip manifest.json background.js inject.js styles.css build/zapzap-app.js -r assets/*

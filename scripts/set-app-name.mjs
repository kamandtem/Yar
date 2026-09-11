// Sets the Android launcher label to the Persian app name.
// The android/ folder is generated on every CI run, so this runs after `cap add`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const APP_NAME = 'یار';
const file = 'android/app/src/main/res/values/strings.xml';

if (!existsSync(file)) {
  console.log(`[set-app-name] ${file} not found, skipping.`);
  process.exit(0);
}

let xml = readFileSync(file, 'utf8');
for (const key of ['app_name', 'title_activity_main']) {
  xml = xml.replace(
    new RegExp(`(<string name="${key}">)[\\s\\S]*?(</string>)`),
    `$1${APP_NAME}$2`
  );
}
writeFileSync(file, xml, 'utf8');
console.log(`[set-app-name] done:\n${xml}`);

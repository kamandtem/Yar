/**
 * Post-`cap add`/`cap sync` tweaks for the generated Android project.
 * The android/ folder is regenerated on every CI run, so this runs each build.
 * Every step is optional: if a pattern is missing we log and move on, never fail.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const APP_NAME = 'یار';          // Persian launcher label
const LIGHT_BG = '#F5F7FC';      // status bar + window background (light theme)

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const write = (p, s) => {
  writeFileSync(p, s, 'utf8');
  console.log(`[patch-android] updated ${p}`);
};

/* 1. Persian app name -------------------------------------------------- */
const stringsPath = 'android/app/src/main/res/values/strings.xml';
const strings = read(stringsPath);
if (!strings) {
  console.log(`[patch-android] ${stringsPath} not found, skipping.`);
} else {
  let out = strings;
  for (const key of ['app_name', 'title_activity_main']) {
    out = out.replace(new RegExp(`(<string name="${key}">)[\\s\\S]*?(</string>)`), `$1${APP_NAME}$2`);
  }
  write(stringsPath, out);
}

/* 2. Light status bar colour ------------------------------------------- */
const colorsPath = 'android/app/src/main/res/values/colors.xml';
const colors = read(colorsPath);
if (colors) {
  let out = colors;
  if (/<color name="colorPrimaryDark">/.test(out)) {
    out = out.replace(/(<color name="colorPrimaryDark">)[^<]*(<\/color>)/, `$1${LIGHT_BG}$2`);
  } else {
    out = out.replace('</resources>', `    <color name="colorPrimaryDark">${LIGHT_BG}</color>\n</resources>`);
  }
  if (!/name="yarWindowBackground"/.test(out)) {
    out = out.replace('</resources>', `    <color name="yarWindowBackground">${LIGHT_BG}</color>\n</resources>`);
  }
  write(colorsPath, out);
} else {
  console.log(`[patch-android] ${colorsPath} not found, skipping.`);
}

/* 3. Dark status-bar icons + matching window background ---------------- */
const stylesPath = 'android/app/src/main/res/values/styles.xml';
const styles = read(stylesPath);
if (styles) {
  const themeStart = /(<style name="AppTheme\.NoActionBar"[^>]*>)/;
  if (themeStart.test(styles) && !styles.includes('windowLightStatusBar')) {
    const injected =
      '$1\n' +
      '        <item name="android:windowLightStatusBar">true</item>\n' +
      '        <item name="android:windowBackground">@color/yarWindowBackground</item>';
    write(stylesPath, styles.replace(themeStart, injected));
  } else {
    console.log('[patch-android] styles.xml already patched or theme not found, skipping.');
  }
} else {
  console.log(`[patch-android] ${stylesPath} not found, skipping.`);
}

console.log('[patch-android] done.');

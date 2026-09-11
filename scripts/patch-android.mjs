import fs from 'fs';
import path from 'path';

const appResDir = 'android/app/src/main/res';

// Ensure directories exist
const valuesDirs = [
  path.join(appResDir, 'values'),
  path.join(appResDir, 'values-night')
];

for (const dir of valuesDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Patch strings.xml for app name
const stringsPath = path.join(appResDir, 'values', 'strings.xml');
let stringsContent = fs.existsSync(stringsPath) ? fs.readFileSync(stringsPath, 'utf-8') : '';

if (!stringsContent.includes('<string name="app_name">Yar</string>')) {
  if (stringsContent.includes('</resources>')) {
    stringsContent = stringsContent.replace(
      '</resources>',
      '  <string name="app_name">Yar</string>\n</resources>'
    );
  } else {
    stringsContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="app_name">Yar</string>
</resources>`;
  }
  fs.writeFileSync(stringsPath, stringsContent);
  console.log('✓ Updated app_name to "Yar"');
}

// Patch styles.xml for light mode - use HEX COLOR DIRECTLY (no resource reference)
const stylesPath = path.join(appResDir, 'values', 'styles.xml');
let stylesContent = fs.existsSync(stylesPath) ? fs.readFileSync(stylesPath, 'utf-8') : '';

if (!stylesContent.includes('android:windowBackground')) {
  if (stylesContent.includes('</style>')) {
    stylesContent = stylesContent.replace(
      '</style>',
      '    <item name="android:windowBackground">#F5F7FC</item>\n  </style>'
    );
  } else {
    stylesContent = `<resources>
  <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <item name="android:windowBackground">#F5F7FC</item>
  </style>
</resources>`;
  }
  fs.writeFileSync(stylesPath, stylesContent);
  console.log('✓ Set light mode window background to #F5F7FC');
}

// Patch styles.xml for dark mode
const stylesDarkPath = path.join(appResDir, 'values-night', 'styles.xml');
let stylesDarkContent = fs.existsSync(stylesDarkPath) ? fs.readFileSync(stylesDarkPath, 'utf-8') : '';

if (!stylesDarkContent.includes('android:windowBackground')) {
  if (stylesDarkContent.includes('</style>')) {
    stylesDarkContent = stylesDarkContent.replace(
      '</style>',
      '    <item name="android:windowBackground">#1A1A1A</item>\n  </style>'
    );
  } else {
    stylesDarkContent = `<resources>
  <style name="AppTheme" parent="Theme.AppCompat">
    <item name="android:windowBackground">#1A1A1A</item>
  </style>
</resources>`;
  }
  fs.writeFileSync(stylesDarkPath, stylesDarkContent);
  console.log('✓ Set dark mode window background to #1A1A1A');
}

console.log('✓ Android resources patched successfully');

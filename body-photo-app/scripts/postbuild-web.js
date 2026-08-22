// expo export 後の dist/index.html にPWA用のタグとService Worker登録を注入する
const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "dist", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

const headInject = `
<link rel="manifest" href="manifest.json" />
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
<meta name="theme-color" content="#ffffff" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="PHYSIQUE" />`;

const swInject = `
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
</script>`;

if (!html.includes('rel="manifest"')) {
  html = html.replace("</head>", `${headInject}\n</head>`);
}
if (!html.includes("serviceWorker")) {
  html = html.replace("</body>", `${swInject}\n</body>`);
}

fs.writeFileSync(indexPath, html);
console.log("PWA tags injected into dist/index.html");

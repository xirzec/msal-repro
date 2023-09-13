const { PublicClientApplication } = require("@azure/msal-node");
const dotenv = require("dotenv");
const http = require("http");

async function main() {
  dotenv.config();

  let originalListen = http.Server.prototype.listen;
  http.Server.prototype.listen = function (port) {
    const that = this;
    setTimeout(() => {
      originalListen.call(that, port);
    }, 1000);
    return that;
  };

  function openBrowser(url) {
    console.log("Please open browser to this url: " + url);
  }
  const app = new PublicClientApplication({
    auth: {
      clientId: process.env.CLIENT_ID,
      authority: process.env.AUTHORITY,
    },
  });

  const result = await app.acquireTokenInteractive({
    scopes: ["user.read"],
    openBrowser: openBrowser,
  });
  console.log(result);
}

main().catch((e) => console.error("error caught", e));

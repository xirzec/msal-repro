const { PublicClientApplication } = require("@azure/msal-node");
const dotenv = require("dotenv");
const http = require("http");

async function main() {
  dotenv.config();

  let originalListen = http.Server.prototype.listen;
  http.Server.prototype.listen = function (port) {
    const that = this;
    originalListen.call(that, port);
    setTimeout(() => {
      // ensure req.url is false so the promise rejects
      that.emit("request", {}, { end: () => {} });
    }, 100);
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

// the below console log is never printed, even though an error is raised
main().catch((e) => console.error("error caught", e));

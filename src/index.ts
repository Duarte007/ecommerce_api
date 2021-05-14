import App from "./app";
import Dump from "./dump";
import config, { showEnvs } from "./config";

const server = App.listen(config.port, async () => {
  console.log(`Api listening port ${config.port}`);
  showEnvs();
  await Dump.initTables();
});

server.setTimeout(60 * 5000);

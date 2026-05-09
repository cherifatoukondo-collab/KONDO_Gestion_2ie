require("dotenv").config();

const app = require("./src/app");

const port = Number.parseInt(process.env.PORT, 10) || 8001;

app.listen(port, () => {
  console.log(`Serveur demarre sur http://localhost:${port}`);
});

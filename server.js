const express = require("express");
const dotenv = require("dotenv");
const { handleCsvImport } = require("./controllers/csv.controller");

dotenv.config();

const app = express();
const PORT = 3000;

app.get("/upload-csv", handleCsvImport);

app.listen(PORT, () => {
  console.log(`Stared server on http://localhost:${PORT}`);
});

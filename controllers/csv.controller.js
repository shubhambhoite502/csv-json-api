const { convertCsvToJson } = require("../services/csv.service");
const { insertUsers, getAgeDistribution } = require("../services/user.service");
require("dotenv").config();

async function handleCsvImport(req, res) {
  try {
    const users = await convertCsvToJson(process.env.CSV_PATH);
    await insertUsers(users);
    const dist = await getAgeDistribution();

    res
      .status(200)
      .json({ message: "CSV processed successfully", distribution: dist });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "CSV processing failed" });
  }
}

module.exports = { handleCsvImport };

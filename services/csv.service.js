const fs = require("fs");
const readline = require("readline");

async function convertCsvToJson(filePath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  let headers = [];
  const users = [];

  for await (const line of rl) {
    if (!headers.length) {
      headers = line.split(",").map((h) => h.trim());
      continue;
    }

    const values = line.split(",").map((v) => v.trim());
    const nested = convertIntoNested(headers, values);
    const firstName = nested.name?.firstName || "";
    const lastName = nested.name?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const age = parseInt(nested.age);
    const address = nested.address || {};

    delete nested.name;
    delete nested.age;
    delete nested.address;

    users.push({
      name: fullName,
      age,
      address,
      additional_info: nested,
    });
  }

  return users;
}

function convertIntoNested(headers, values) {
  const result = {};
  headers.forEach((header, i) => {
    const parts = header.split(".");
    let curr = result;
    for (let j = 0; j < parts.length - 1; j++) {
      curr[parts[j]] = curr[parts[j]] || {};
      curr = curr[parts[j]];
    }
    curr[parts.at(-1)] = values[i].trim();
  });
  return result;
}

module.exports = { convertCsvToJson };

const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

const readAllItemsData = async () => {
  const alldata = JSON.parse(
    await fs.promises.readFile(dataFilePath, "utf-8", (err, data) => {
      if (err) {
        throw err;
      } else {
        return data;
      }
    })
  );
  return alldata.items;
};

const readCounterData = async () => {
  const alldata = JSON.parse(
    await fs.promises.readFile(dataFilePath, "utf-8", (err, data) => {
      if (err) {
        throw err;
      } else {
        return data;
      }
    })
    );
  alldata.counter++;
  fs.writeFileSync(dataFilePath, JSON.stringify(alldata), 'utf-8', (err) => {
    if (err) {
      throw err;
    }
  });
  return alldata.counter.toString();
};

const addItemData = async (data) => {
  const alldata = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  alldata.items.push(data);
  fs.writeFileSync(dataFilePath, JSON.stringify(alldata), 'utf-8', (err) => {
    if (err) {
      throw err;
    }
  });
};

const writeItemsData = async (data) => {
  const alldata = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  alldata.items = data;
  fs.writeFileSync(dataFilePath, JSON.stringify(alldata), 'utf-8', (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = { readAllItemsData, readCounterData, addItemData, writeItemsData };

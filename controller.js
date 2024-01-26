const fs = require("fs");
const winston = require("winston");

const {
    readAllItemsData,
    readCounterData,
    addItemData,
    writeItemsData,
  } = require("./repository.js");
  
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "donation-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "donation-service.log" }),
  ],
});


const getAllItems = (res) => {
  try {
    readAllItemsData().then((items) => {
      res.writeHead(200, { "Content-Type": "text/application/json" });
      res.end(JSON.stringify(items));
      logger.info("All items were sent successfully.");
    });
  } catch (err) {
    console.error("Error reading JSON file:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
    logger.error("Internal Server Error.");
  }
};

const getItem = async (id, res) => {
  if (id == undefined) {
    res.writeHead(404);
    res.end("Please pass the id to the query string.");
    logger.error("Please pass the id to the query string.");
    return;
  } else {
    try {
      const itemsData = await readAllItemsData();
      const result = getItemFromArray(id, itemsData);
      if (result == -1) {
        res.writeHead(404);
        res.end("no such an item with this id.");
        logger.error("No such an item with this id.");
      } else {
        res.writeHead(200, { "Content-Type": "text/application/json" });
        res.end(JSON.stringify(result));
        logger.info("Item was sent successfully.");
      }
    } catch (err) {
      console.error("Error reading JSON file:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
      logger.error("Internal Server Error.");
      return;
    }
  }
};

const createItem = async (query, res) => {
  try {
    if (
      query.name == undefined ||
      query.email == undefined ||
      query.amount == undefined
    ) {
      res.writeHead(400);
      res.end("Please pass all the parameters to the query string.");
      logger.error("Please pass all the parameters to the query string.");
    } else {
      const nextId = await readCounterData();
      const { name, email, amount } = query;
      const newUser = newDonation(nextId, name, email, amount);
      await addItemData(newUser);
      res.writeHead(201);
      res.end("item created successfully.");
      logger.info("Item was created successfully.");
    }
  } catch (err) {
    console.error("Error reading JSON file:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
    logger.error("Internal Server Error.");
    return;
  }
};

const updateItem = async (query, res) => {
  try {
    if (query.id == undefined) {
      res.writeHead(404);
      res.end("Please pass the id to the query string.");
      logger.error("Please pass the id to the query string.");
      return;
    } else if (
      query.name == undefined ||
      query.email == undefined ||
      query.amount == undefined
    ) {
      res.writeHead(400);
      res.end("Please pass all the parameters to the query string.");
      logger.error("Please pass all the parameters to the query string.");
    } else {
      const itemsData = await readAllItemsData();
      const itemIndex = findDonationIndexById(query.id, itemsData);
      if (itemIndex == -1) {
        res.writeHead(404);
        res.end("no such an item with this id.");
        logger.error("No such an item with this id.");
      } else {
        const { name, email, amount } = query;
        itemsData[itemIndex].name = name;
        itemsData[itemIndex].email = email;
        itemsData[itemIndex].amount = amount;
        await writeItemsData(itemsData);
        res.writeHead(201);
        res.end("item updated successfully.");
        logger.info("Item was updated successfully.");
      }
    }
  } catch (err) {
    console.error("Error reading JSON file:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
    logger.error("Internal Server Error.");
    return;
  }
};

const deleteItem = async (id, res) => {
  try {
    if (id == undefined) {
      res.writeHead(400);
      res.end("Please pass the id to the query string.");
      logger.error("Please pass the id to the query string.");
      return;
    } else {
      const itemsData = await readAllItemsData();
      const itemIndex = findDonationIndexById(id, itemsData);
      if (itemIndex == -1) {
        res.writeHead(404);
        res.end("no such an item with this id.");
        logger.error("No such an item with this id.");
      } else {
        itemsData.splice(itemIndex, 1);
        await writeItemsData(itemsData);
        res.writeHead(201);
        res.end("item deleted successfully.");
        logger.info("Item was deleted successfully.");
      }
    }
  } catch (err) {
    console.error("Error reading JSON file:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
    logger.error("Internal Server Error.");
    return;
  }
};

const getItemFromArray = (id, array) => {
  const foundDonation = findDonationById(id, array);
  if (foundDonation) {
    return foundDonation;
  } else {
    return -1;
  }
};

const findDonationById = (id, array) => {
  if (typeof array == typeof []) {
    return array.find((donation) => donation.id == id.toString());
  } else {
    return undefined;
  }
};

const findDonationIndexById = (id, array) => {
  if (typeof array == typeof []) {
    return array.findIndex((item) => item.id == id);
  } else {
    return undefined;
  }
};

const newDonation = (id, name, email, amount) => {
  var obj = {
    id: id,
    name: name,
    email: email,
    amount: amount,
  };
  return obj;
};

const notFoundResult = (res) => {
    res.writeHead(404);
    res.end('Page not found.');
    logger.error('Page not found.');
  };

module.exports = {
  getItem,
  createItem,
  findDonationById,
  newDonation,
  getAllItems,
  findDonationIndexById,
  updateItem,
  deleteItem,
  notFoundResult,
  logger
};

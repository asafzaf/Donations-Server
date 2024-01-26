const fs = require("fs");
const {
  getItem,
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  notFoundResult,
} = require("./controller.js");

const route = (method, pathname, query, res) => {
  if (method === "GET" && (pathname === "/" || pathname === "/records")) {
    getAllItems(res);
    return;
  } else if (method === "GET" && pathname === "/items") {
    getItem(query.id, res);
  } else if (method == "POST" && pathname === "/items") {
    createItem(query, res);
  } else if (method == "DELETE" && pathname === "/items") {
    deleteItem(query.id, res);
  } else if (method == "PUT" && pathname === "/items") {
    updateItem(query, res);
  } else {
    notFoundResult(res);
  }
};

exports.route = route;

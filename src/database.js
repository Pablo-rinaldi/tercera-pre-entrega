const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

mongoose
  .connect(mongo_url)
  .then(() => console.log("Conexión exitosa"))
  .catch(() => console.log("error, no pudo conectarse"));

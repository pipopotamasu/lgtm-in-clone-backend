require("dotenv").config({ path: ".env" });

module.exports = {
  modelBaseDirectory: "./src/models",
  models: "*.ts",
  data: "data",
  db: "mongodb://localhost:27017/lgtm-clone"
};

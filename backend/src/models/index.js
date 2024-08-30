const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const db = require("../config/db");
console.log(db,'db credentials')

const sequelize = new Sequelize(
  db.DATABASE, 
  db.USER,
  db.PASSWORD, {
  host: db.HOST,
  dialect: db.DIALECT,
  logging: false,
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db1 = {};
db1.Sequelize = Sequelize;
db1.sequelize = sequelize;
db1.DataTypes = DataTypes;
db1.QueryTypes = QueryTypes;

// import all table models
db1.users = require("./users.model")(sequelize, DataTypes)
db1.foodListings = require("./foodListings.model")(sequelize, DataTypes)
db1.foodListingItems = require("./foodListingItems.model")(sequelize, DataTypes)

db1.foodListings.sync({
  alter:true,
});

module.exports = db1;
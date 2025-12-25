const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    team: {
      type: String,
    },
    league: {
      type: String,
    },
    country: {
      type: String,
    },
    continent: {
      type: String,
    },
    player: {
      type: String,
    },
    season: {
      type: String,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    sizes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
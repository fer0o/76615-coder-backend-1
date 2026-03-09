const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    team: {
      type: String,
      required: true,
      trim: true,
    },
    league: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    continent: {
      type: String,
      required: true,
      trim: true,
    },
    player: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default:0,
      min: 0,
    },
    sizes: {
      type: [
        {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL"],
          trim: true,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

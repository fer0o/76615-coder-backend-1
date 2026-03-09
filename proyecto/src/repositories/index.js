const UserMongoDAO = require("../dao/mongo/UserMongoDAO");
const ProductMongoDAO = require("../dao/mongo/ProductMongoDAO");
const CartMongoDAO = require("../dao/mongo/CartMongoDAO");
const TicketMongoDAO = require("../dao/mongo/TicketMongoDAO");

const UserRepository = require("./UserRepository");
const ProductRepository = require("./ProductRepository");
const CartRepository = require("./CartRepository");
const TicketRepository = require("./TicketRepository");

const userRepository = new UserRepository(UserMongoDAO);
const productRepository = new ProductRepository(ProductMongoDAO);
const cartRepository = new CartRepository(CartMongoDAO);
const ticketRepository = new TicketRepository(TicketMongoDAO);

module.exports = {
  userRepository,
  productRepository,
  cartRepository,
  ticketRepository,
};

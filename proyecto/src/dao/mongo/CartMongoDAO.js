const mongoose = require("mongoose");
const CartModel = require("../../models/Cart.model");

const { ObjectId } = mongoose.Types;
//funcion para resolver el filtro por id o por objeto
const resolveFilter = (filterOrId) => {
  if (!filterOrId) {
    return null;
  }

  if (typeof filterOrId === "string" || filterOrId instanceof ObjectId) {
    return { _id: filterOrId };
  }

  if (typeof filterOrId === "object") {
    return filterOrId;
  }

  return null;
};
//clase para el dao de carritos
class CartMongoDAO {
  async create(cartData = { products: [] }, options = {}) {
    const { session } = options;

    if (session) {
      const [cart] = await CartModel.create([cartData], { session });
      return cart.toObject();
    }

    const cart = await CartModel.create(cartData);
    return cart.toObject();
  }

  async getAll(filter = {}, options = {}) {
    const { skip, limit, sort, select, populate, session } = options;

    let query = CartModel.find(filter);

    if (select) {
      query = query.select(select);
    }

    if (sort) {
      query = query.sort(sort);
    }

    if (populate) {
      query = query.populate(populate);
    }

    if (Number.isInteger(skip) && skip >= 0) {
      query = query.skip(skip);
    }

    if (Number.isInteger(limit) && limit > 0) {
      query = query.limit(limit);
    }

    if (session) {
      query = query.session(session);
    }

    return query.lean();
  }

  async getOne(filterOrId, options = {}) {
    const filter = resolveFilter(filterOrId);

    if (!filter) {
      return null;
    }

    const { select, populate, session } = options;
    let query = CartModel.findOne(filter);

    if (select) {
      query = query.select(select);
    }

    if (populate) {
      query = query.populate(populate);
    }

    if (session) {
      query = query.session(session);
    }

    return query.lean();
  }
 //funcion para actualizar un carrito
  async update(filterOrId, updateFields, options = {}) {
    const filter = resolveFilter(filterOrId);

    if (!filter) {
      return null;
    }

    const {
      session,
      runValidators = true,
      upsert = false,
      sort,
      select,
      populate,
    } = options;

    const queryOptions = { new: true, runValidators, upsert };

    if (sort) {
      queryOptions.sort = sort;
    }

    let query = CartModel.findOneAndUpdate(filter, updateFields, queryOptions);

    if (select) {
      query = query.select(select);
    }

    if (populate) {
      query = query.populate(populate);
    }

    if (session) {
      query = query.session(session);
    }

    return query.lean();
  }
  
  async delete(filterOrId, options = {}) {
    const filter = resolveFilter(filterOrId);

    if (!filter) {
      return null;
    }

    const { session } = options;
    let query = CartModel.findOneAndDelete(filter);

    if (session) {
      query = query.session(session);
    }

    return query.lean();
  }
}

module.exports = new CartMongoDAO();

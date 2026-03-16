const mongoose = require("mongoose");
const UserModel = require("../../models/User.model");

const { ObjectId } = mongoose.Types;

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

class UserMongoDAO {
  async create(userData, options = {}) {
    const { session } = options;

    if (session) {
      const [user] = await UserModel.create([userData], { session });
      return user.toObject();
    }

    const user = await UserModel.create(userData);
    return user.toObject();
  }

  async getAll(filter = {}, options = {}) {
    const { skip, limit, sort, select, populate, session } = options;

    let query = UserModel.find(filter);

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
    let query = UserModel.findOne(filter);

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

    let query = UserModel.findOneAndUpdate(filter, updateFields, queryOptions);

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
    let query = UserModel.findOneAndDelete(filter);

    if (session) {
      query = query.session(session);
    }

    return query.lean();
  }
}

module.exports = new UserMongoDAO();

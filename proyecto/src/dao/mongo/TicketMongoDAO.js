const mongoose = require("mongoose");
const TicketModel = require("../../models/Ticket.model");

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

class TicketMongoDAO {
  async create(ticketData, options = {}) {
    const { session } = options;

    if (session) {
      const [ticket] = await TicketModel.create([ticketData], { session });
      return ticket.toObject();
    }

    const ticket = await TicketModel.create(ticketData);
    return ticket.toObject();
  }

  async getAll(filter = {}, options = {}) {
    const { skip, limit, sort, select, populate, session } = options;

    let query = TicketModel.find(filter);

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
    let query = TicketModel.findOne(filter);

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

    let query = TicketModel.findOneAndUpdate(filter, updateFields, queryOptions);

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
    let query = TicketModel.findOneAndDelete(filter);

    if (session) {
      query = query.session(session);
    }

    return query.lean();
  }
}

module.exports = new TicketMongoDAO();

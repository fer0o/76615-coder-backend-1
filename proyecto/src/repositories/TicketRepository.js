class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(ticketData, options = {}) {
    return this.dao.create(ticketData, options);
  }

  getAll(filter = {}, options = {}) {
    return this.dao.getAll(filter, options);
  }

  getOne(filterOrId, options = {}) {
    return this.dao.getOne(filterOrId, options);
  }

  update(filterOrId, updateFields, options = {}) {
    return this.dao.update(filterOrId, updateFields, options);
  }

  delete(filterOrId, options = {}) {
    return this.dao.delete(filterOrId, options);
  }

  findByCode(code, options = {}) {
    return this.dao.getOne({ code }, options);
  }

  findById(id, options = {}) {
    return this.dao.getOne(id, options);
  }
}

module.exports = TicketRepository;

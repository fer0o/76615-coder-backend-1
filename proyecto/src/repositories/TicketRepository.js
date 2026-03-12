class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(ticketData, options = {}) {
    return this.dao.create(ticketData, options);
  }

  findByCode(code) {
    return this.dao.findByCode(code);
  }

  findById(id) {
    return this.dao.findById(id);
  }
}

module.exports = TicketRepository;

const TicketModel = require("../../models/Ticket.model");

class TicketMongoDAO {
    async create( ticketData ) {
        const ticket = await TicketModel.create(ticketData);
        return ticket.toObject();
    }

    async findByCode(code) {
        return TicketModel.findOne({ code }).lean();
    }

    async findById(id) {
        return TicketModel.findById(id).lean();
    }
}

module.exports = new TicketMongoDAO();
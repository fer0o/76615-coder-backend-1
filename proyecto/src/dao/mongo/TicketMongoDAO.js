const TicketModel = require("../../models/Ticket.model");

class TicketMongoDAO {
    async create(ticketData, options = {}) {
        const { session } = options;
        const ticket = new TicketModel(ticketData);
        await ticket.save({ session });
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

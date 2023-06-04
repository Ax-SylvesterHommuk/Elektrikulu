import mongoose from "mongoose";

const customer = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    }
})

export default mongoose.model('Customer', customer);
import mongoose from "mongoose";

const device = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    consumption: {
        required: true,
        type: Number
    }
})

export default mongoose.model('Device', device);
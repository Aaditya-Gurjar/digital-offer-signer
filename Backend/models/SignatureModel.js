const mongoose = require("mongoose");

const SignatureSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    signatureImage: { type: String, required: true }, // Base64 or File URL
    signedAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("Signature", SignatureSchema);

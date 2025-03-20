const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: String, required: true },
    offerLetterUrl: { type: String }, // PDF file URL after generation
    signedPdfUrl: { type: String }, // After signing
    status: { type: String, enum: ["pending", "signed"], default: "pending" },
    isViewed: { type: Boolean, default: false },
    trackingToken: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Offer", OfferSchema);

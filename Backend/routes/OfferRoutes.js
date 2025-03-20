const express = require("express");
const router = express.Router();
const { createOffer, trackEmail, signOffer } = require("../controllers/OfferController");

router.post("/create", createOffer);
router.post("/sign-offer", signOffer);
// router.get("/track-email/:offerId", trackEmail);


module.exports = router;

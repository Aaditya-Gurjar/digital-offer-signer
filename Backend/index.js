const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const offerRoutes = require("./routes/OfferRoutes");
const { trackEmail } = require("./controllers/OfferController");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


app.use("/track-email/:offerId", trackEmail)
app.use("/api/offers", offerRoutes);



app.get("/", (req, res) => {
    res.send("Digital Signature Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

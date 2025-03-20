const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const offerRoutes = require("./routes/OfferRoutes");
const { trackEmail } = require("./controllers/OfferController");


dotenv.config();

const app = express();
app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",  // Your local frontend (Vite)
    "https://esign-offerletter.netlify.app"  // Your deployed frontend
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true); // Allow the request
            } else {
                callback(new Error("CORS Error: This origin is not allowed"));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
        credentials: true, // Allow cookies & authentication headers
    })
);

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

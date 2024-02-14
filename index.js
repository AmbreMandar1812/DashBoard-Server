const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const json2csv = require("json2csv").parse;

const Data = require("./models/data");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(cors());

// connect to mongodb
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then( () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    const data = JSON.parse(fs.readFileSync("./jsondata.json", "utf-8"));

    // console.log(data);

    // import data to MongoDB
    const importData = async () => {
      try {
        await Data.create(data);
        console.log("data successfully imported");
        // to exit the process
        process.exit();
      } catch (error) {
        console.log("error", error);
      }
    };
    // importData()
  })
  .catch((error) => console.log(`${error} did not connect`));

app.get("/", async (req, res) => {
  try {
    // Fetch the top 20 entries from the database
    const topEntries = await Data.find().sort({ relevance: -1 });

    res.json(topEntries);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/intensity", async (req, res) => {
  try {
    const intensity = await Data.find({}, "intensity");
    res.json(intensity);
  } catch (error) {
    console.error("Error fetching intensity data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/export/csv", async (req, res) => {
  try {
    const data = await Data.find();

    // Convert JSON data to CSV string
    const csv = json2csv(data, { header: true });

    // Write CSV string to file
    fs.writeFileSync("data.csv", csv);

    res.attachment("data.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// importData()

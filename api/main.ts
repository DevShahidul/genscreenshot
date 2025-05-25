import express from "express";
// import indexRouter from "../routes/index.ts";
import cors from "cors";
import Scrapping from "./scrape.ts";
// import "./style.css";
const app = express();
const port = 3001;

app.use(cors());

app.get("/", async (req, res) => {
  try {
    await res.send("Welcome to screenshot api tool!");
  } catch (err) {
    console.error("Error: ", err);
  }
});

app.get("/screenshot", async (req, res) => {
  try {
    const url = req.query?.url;
    const screenshot = await Scrapping(url);
    res.set("Content-Type", "image/png");
    res.send(screenshot);
    return;
  } catch (err) {
    const message = `Error taking screenshot ${err}`;
    console.error(message);
    res.status(500).send(message);
  }
});

app.listen(port, (err?: Error) => {
  if (err) {
    console.error(`Error starting server ${err}`);
  } else {
    console.log(`App listening on port ${port}`);
  }
});

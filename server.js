// Dependencies

const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

// Sets up the Express App

const app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// define working arr

let workingArr;

fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8", (err, data) => {
  if (err) console.error(err);
  workingArr = JSON.parse(data);
});

// Routes

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
// Create New Note - takes in JSON input
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uniqid();
  workingArr.push(newNote);
  console.log(workingArr);
  fs.writeFile(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(workingArr),
    (err, data) => {
      if (err) console.error(err);
    }
  );
  //to-do:change
  res.send("Note Added Successfully");
});

//Delete Note
app.delete("/api/notes/:id", (req, res) => {
  workingArr = workingArr.filter((item) => item.id != req.params.id);
  fs.writeFile(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(workingArr),
    (err, data) => {
      if (err) console.error(err);
    }
  );
  res.send(`Note id ${req.params.id} Deleted Successfully`);
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

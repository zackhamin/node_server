const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// POST JSON object to save to file
router.post("/:title", function (req, res, next) {
  const title = req.params.title;
  const content = req.body.content;

  if (!content) {
    return res.status(400).send("Content is required");
  }
  // Create a directory for the document if it doesn't exist
  const dirName = path.join(__dirname, "../", `documents/${title}`);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  // Create a filename for the content based on the timestamp
  const timestamp = Date.now();
  const fileName = `${timestamp}`;
  const filePath = path.join(dirName, fileName);

  // Write the content to the file
  fs.writeFile(filePath, content, function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving file").json(err);
    } else {
      res.send(`Document saved`);
    }
  });
});

//Gets all documents in the directory and returns the titles
router.get("/", function (req, res, next) {
  const documentsDir = path.join(__dirname, "../", "documents");
  const titles = fs.readdirSync(documentsDir);
  res.send(titles);
});

//Gets a specific document based on title
router.get("/:title", function (req, res, next) {
  const title = req.params.title;
  const documentsDir = path.join(__dirname, "../", "documents");
  const titleDir = path.join(documentsDir, title);

  // Check if the directory for the title exists
  if (!fs.existsSync(titleDir)) {
    res.status(404).send("Title not found");
  }

  // Read the directory and return the list of text files
  const files = fs.readdirSync(titleDir);
  const textFiles = files.filter((file) => {
    return (
      !fs.statSync(path.join(titleDir, file)).isDirectory() &&
      path.extname(file) === ""
    );
  });
  res.send(textFiles);
});

// Gets the latest document with given title
router.get("/:title/latest", function (req, res, next) {
  const title = req.params.title;
  const documentsDir = path.join(__dirname, "../", "documents");
  const titleDir = path.join(documentsDir, title);

  // Check if the directory for the title exists
  if (!fs.existsSync(titleDir)) {
    res.status(404).send("Title not found");
  }

  // Read all files in the directory
  fs.readdir(titleDir, function (err, files) {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading directory");
      return;
    }

    // Filter out non-text files
    const textFiles = files.filter(function (file) {
      return path.extname(file) === "";
    });

    // Sort files by timestamp in descending order
    textFiles.sort(function (a, b) {
      return (
        fs.statSync(path.join(titleDir, b)).mtime.getTime() -
        fs.statSync(path.join(titleDir, a)).mtime.getTime()
      );
    });

    // Check if there are any text files
    if (textFiles.length === 0) {
      res.status(404).send("No text files found");
      return;
    }

    // Return the most recent text file
    const fileName = path.join(titleDir, textFiles[0]);
    res.sendFile(fileName);
  });
});

module.exports = router;

const { exec } = require("child_process");
const express = require("express");
// eslint-disable-next-line no-undef
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json("hi ");
});
app.post("/run", (req, res) => {
  const { code } = req.body;
  const fs = require("fs");
  const path = "./temp.js";
  fs.writeFileSync(path, code);
  exec(`node ${path}`, (error, stdout, stderr) => {
    if (error) {
      res.json({ output: stderr });
      return;
    }
    console.log(stdout);
    res.json({ output: stdout });
    // res.json({ output: "Code executed successfully!" });
  });
});

app.listen(3000, () => {
  console.log("server listening on 3000");
});

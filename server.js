const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/compress", upload.single("pdf"), (req, res) => {
  const input = req.file.path;
  const output = `compressed-${Date.now()}.pdf`;

  exec(
    `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=${output} ${input}`,
    (err) => {
      if (err) return res.status(500).send("Compression failed");

      res.download(output, () => {
        fs.unlinkSync(input);
        fs.unlinkSync(output);
      });
    }
  );
});

app.listen(process.env.PORT || 3000, () =>
  console.log("PDFARENA backend running")
);

import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());
app.use(express.static("web"));

app.post("/rewrite", (req, res) => {
  const { source, match, rewrite, language = ".generic" } = req.body;

  const p = spawn("comby", [
    match,
    rewrite,
    "-stdin",
    language,
    "-json-lines"
]);

  let out = "";
  let err = "";

  p.stdout.on("data", d => out += d);
  p.stderr.on("data", d => err += d);

p.on("close", (code) => {
  if (code !== 0) {
    return res.status(400).json({ error: err });
  }

  try {
    const obj = JSON.parse(out.trim());

    res.json({
      diff: obj.diff || "",
      result: obj.rewritten_source || ""
    });
  } catch (e) {
    res.status(500).json({
      error: "Invalid comby JSON output",
      raw: out
    });
  }
});

  p.stdin.end(source);
});

app.listen(8080, () =>
  console.log("Comby playground listening on :8080")
);
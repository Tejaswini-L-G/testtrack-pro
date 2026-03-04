const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/github", async (req, res) => {

  const commits = req.body.commits || [];
  const branch = req.body.ref?.split("/").pop();

  for (const commit of commits) {

    const message = commit.message;
    const hash = commit.id;
    const author = commit.author.name;

    const bugMatch = message.match(/BUG-\d+/);

    await prisma.commit.create({
      data: {
        hash,
        message,
        branch,
        author,
        bugId: bugMatch ? bugMatch[0] : null
      }
    });

  }

  res.json({ message: "Commits processed" });

});

module.exports = router;
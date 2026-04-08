const express = require("express");
const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 👉 Telegram Bot Config
const BOT_TOKEN = process.env.BOT_TOKEN;

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("🔥 PRO API + TELEGRAM BOT RUNNING");
});

// ✅ Main API
app.get("/Saini_bots", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const userId = req.query.user_id;

    if (!videoUrl || !userId) {
      return res.send("❌ url ya user_id missing");
    }

    const fileName = "video.mp4";

    // 🔥 yt-dlp download command
    const command = `./yt-dlp -o ${fileName} "${videoUrl}"`;

    exec(command, async (error) => {
      if (error) {
        return res.send("❌ Download error");
      }

      // 📤 Send to Telegram
      const formData = new FormData();
      formData.append("chat_id", userId);
      formData.append("video", fs.createReadStream(fileName));

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`,
        formData,
        {
          headers: formData.getHeaders()
        }
      );

      // 🧹 delete file
      fs.unlinkSync(fileName);

      res.send("✅ Video sent to Telegram");
    });

  } catch (err) {
    res.send("❌ Server error");
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

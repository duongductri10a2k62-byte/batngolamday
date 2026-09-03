const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Cho phép frontend gửi dữ liệu đến backend
app.use(cors());
app.use(express.json());

// Đường dẫn file lưu dữ liệu
const filePath = path.join(__dirname, "messages.json");

// Kiểm tra server
app.get("/", (req, res) => {
    res.send("Backend đang chạy!");
});
app.get("/api/messages", (req, res) => {

    let messages = [];

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");

        if (data.trim() !== "") {
            messages = JSON.parse(data);
        }
    }

    res.json(messages);
});
// Nhận thông tin khi bấm "Đi luôn"
app.post("/api/message", (req, res) => {

    let messages = [];

    // Đọc dữ liệu cũ
    if (fs.existsSync(filePath)) {

        const data = fs.readFileSync(filePath, "utf8");

        if (data.trim() !== "") {
            messages = JSON.parse(data);
        }
    }

    // Thêm lần nhấn mới
    messages.push({
        action: "Đi luôn",
        time: new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh"
        })
    });

    // Lưu vào messages.json
    fs.writeFileSync(
        filePath,
        JSON.stringify(messages, null, 2)
    );

    res.json({
        success: true,
        message: "Đã lưu thời gian!"
    });
});

// Render cung cấp PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});


const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Cho phép frontend gửi dữ liệu đến backend
app.use(cors());
app.use(express.json());

// Đường dẫn file lưu tin nhắn
const filePath = path.join(__dirname, "messages.json");

// Kiểm tra server
app.get("/", (req, res) => {
    res.send("Backend đang chạy!");
});

// Nhận tin nhắn từ frontend
app.post("/api/message", (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập đủ thông tin!"
        });
    }

    let messages = [];

    // Đọc dữ liệu cũ
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");

        if (data.trim() !== "") {
            messages = JSON.parse(data);
        }
    }

    // Thêm tin nhắn mới
    messages.push({
        name: name,
        message: message,
        time: new Date().toISOString()
    });

    // Lưu vào messages.json
    fs.writeFileSync(
        filePath,
        JSON.stringify(messages, null, 2)
    );

    res.json({
        success: true,
        message: "Đã nhận tin nhắn!"
    });
});

// Render sẽ cung cấp PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});


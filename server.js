const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "messages.json");

// Khởi tạo file nếu chưa có để tránh lỗi đọc file
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
}

// 1. Kiểm tra trạng thái server
app.get("/", (req, res) => {
    res.send("Backend đang hoạt động bình thường!");
});

// 2. API ĐỌC FILE - Dùng link này trên trình duyệt để xem nội dung messages.json
app.get("/api/messages", (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }
        const data = fs.readFileSync(filePath, "utf8");
        const messages = data.trim() ? JSON.parse(data) : [];
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. API GHI FILE khi bấm nút
app.post("/api/message", (req, res) => {
    console.log(">>> Có yêu cầu ghi file:", req.body);

    try {
        let messages = [];

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            if (data.trim()) {
                messages = JSON.parse(data);
            }
        }

        const newMessage = {
            id: Date.now(),
            action: req.body.action || "Đi luôn",
            time: new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh"
            })
        };

        messages.push(newMessage);

        // Ghi đè lại file trên Render
        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), "utf8");

        console.log(">>> Đã ghi file thành công:", newMessage);

        res.status(200).json({
            success: true,
            message: "Đã lưu vào messages.json thành công!",
            data: newMessage
        });
    } catch (error) {
        console.error(">>> Lỗi khi ghi file:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi ghi file",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chạy tại port ${PORT}`);
});

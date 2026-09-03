```js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// File messages.json nằm cùng thư mục với server.js
const filePath = path.join(__dirname, "messages.json");


// ================= KIỂM TRA SERVER =================

app.get("/", (req, res) => {
    res.send("Backend đang chạy!");
});


// ================= XEM ĐƯỜNG DẪN FILE =================

app.get("/test-file", (req, res) => {
    res.json({
        filePath: filePath,
        exists: fs.existsSync(filePath)
    });
});


// ================= XEM DỮ LIỆU =================

app.get("/api/messages", (req, res) => {
    try {

        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }

        const data = fs.readFileSync(filePath, "utf8");

        if (data.trim() === "") {
            return res.json([]);
        }

        const messages = JSON.parse(data);

        res.json(messages);

    } catch (error) {

        console.error("LỖI ĐỌC FILE:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// ================= NHẬN NÚT ĐI LUÔN =================

app.post("/api/message", (req, res) => {

    console.log("================================");
    console.log("CÓ REQUEST TỪ WEBSITE!");
    console.log("DỮ LIỆU:", req.body);
    console.log("FILE:", filePath);
    console.log("================================");

    try {

        let messages = [];

        // Nếu messages.json đã tồn tại
        if (fs.existsSync(filePath)) {

            const data = fs.readFileSync(filePath, "utf8");

            if (data.trim() !== "") {
                messages = JSON.parse(data);
            }
        }

        // Tạo dữ liệu mới
        const newMessage = {
            action: req.body.action || "Đi luôn",
            time: new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh"
            })
        };

        // Thêm vào danh sách
        messages.push(newMessage);

        // Ghi vào messages.json
        fs.writeFileSync(
            filePath,
            JSON.stringify(messages, null, 2),
            "utf8"
        );

        console.log("ĐÃ GHI FILE THÀNH CÔNG!");
        console.log(newMessage);

        res.status(200).json({
            success: true,
            message: "Đã lưu thành công!",
            data: newMessage
        });

    } catch (error) {

        console.error("LỖI KHI GHI FILE:", error);

        res.status(500).json({
            success: false,
            message: "Không thể ghi messages.json",
            error: error.message
        });
    }
});


// ================= CHẠY SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
    console.log(`File messages.json: ${filePath}`);
});
```

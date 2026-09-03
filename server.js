const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "messages.json");

// ================= KIỂM TRA SERVER =================

app.get("/", (req, res) => {
    res.send("Backend đang chạy!");
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
    console.log("Dữ liệu nhận được:", req.body);
    console.log("================================");

    try {

        let messages = [];

        // Nếu file chưa tồn tại
        if (fs.existsSync(filePath)) {

            const data = fs.readFileSync(filePath, "utf8");

            if (data.trim() !== "") {
                messages = JSON.parse(data);
            }
        }

        // Thêm lượt bấm
        const newMessage = {
            action: "Đi luôn",
            time: new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh"
            })
        };

        messages.push(newMessage);

        // Ghi file
        fs.writeFileSync(
            filePath,
            JSON.stringify(messages, null, 2),
            "utf8"
        );

        console.log("ĐÃ LƯU THÀNH CÔNG:");
        console.log(newMessage);

        res.status(200).json({
            success: true,
            message: "Đã lưu thời gian!",
            data: newMessage
        });

    } catch (error) {

        console.error("LỖI KHI LƯU:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lưu dữ liệu!",
            error: error.message
        });
    }
});

// ================= CHẠY SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});

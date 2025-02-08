const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { analyze } = require("./analyse");

const app = express();

// 🌱 تحميل متغيرات البيئة من ملف .env
dotenv.config();

// 🚀 تعريف المنفذ
const PORT = process.env.PORT || 8000;
console.log("API_KEY from .env:", process.env.API_KEY);

// 🔑 تحميل المتغير البيئي الخاص بـ API_KEY
const MEAN_CLOUD_API_KEY = process.env.API_KEY;

// Middlewares
app.use(cors());  // 💬 السماح بالاتصالات عبر الـ CORS
app.use(express.static('dist'));  // 📂 تقديم الملفات الثابتة من مجلد dist
app.use(express.json());  // 📊 تحليل البيانات في الطلبات بصيغة JSON

// 🏠 الصفحة الرئيسية
app.get('/', (req, res) => {
    res.render("index.html");  // عرض الصفحة الرئيسية
});

// 📬 معالجة الطلبات POST
app.post("/", async (req, res) => {
    try {
        // 🔍 الحصول على الرابط من جسم الطلب
        const { URI } = req.body;

        // ⚠️ تحقق من وجود الرابط في الطلب
        if (!URI) {
            return res.status(400).send({ msg: "URL is required", code: 400 });
        }

        // 🧠 تحليل النص من خلال واجهة تحليل النص
        const analyzeResult = await analyze(URI, MEAN_CLOUD_API_KEY);
        const { code, msg, sample } = analyzeResult;

        // ✅ التحقق من نتائج التحليل وإرجاع الإجابة المناسبة
        if (code === 212 || code === 100) {
            return res.status(400).send({ msg, code });
        }

        return res.status(200).send({ sample, code });

    } catch (error) {
        // ❌ التعامل مع الأخطاء المحتملة في العملية
        console.error("Error processing the request:", error);
        return res.status(500).send({ msg: "Internal Server Error", code: 500 });
    }
});

// 🔥 بدء السيرفر
app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT} 🚀`);
});

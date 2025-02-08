import axios from "axios";

// 🛠️ استيراد الدالة isValidUrl من الملف الخارجي للتحقق من صحة الرابط
const { isValidUrl } = require("./checkURL");

const input = document.getElementById("URI");

// 🔄 التعامل مع تغيير الإدخال
document.addEventListener('DOMContentLoaded', function () {
    input.addEventListener("change", (e) => {
        e.preventDefault();
        hide_error();  // ❌ إخفاء الخطأ عند تغيير القيمة
        show_results(false);  // 👀 إخفاء النتائج السابقة عند التغيير
    });
});

// 📤 التعامل مع الإرسال
async function handleSubmit(e) {
    e.preventDefault();  // 🚫 منع السلوك الافتراضي للنموذج

    const form = document.querySelector("form");

    // 🔍 تحقق من صحة الرابط المدخل
    if (!isValidUrl(input.value)) {
        show_error();  // ❌ إظهار رسالة الخطأ
        document.getElementById("error").innerHTML = "Please, Enter a valid URL";  // ⚠️ نص الخطأ
        input.value = "";  // 🔄 إعادة تعيين قيمة المدخل
        return;
    }

    loading(true);  // ⏳ إظهار مؤشر التحميل
    const { data } = await axios.post(
        'http://localhost:8000/',  // 🌐 إرسال الطلب إلى السيرفر
        form,
        {
            headers: {
                'Content-Type': 'application/json'  // 📋 تحديد نوع المحتوى
            }
        }
    );
    display_results(data);  // ✅ عرض النتائج بعد استلامها
}

// 📊 عرض النتائج على واجهة المستخدم
const display_results = data => {
    loading(false);  // ❌ إخفاء مؤشر التحميل عند الانتهاء

    if (data.msg) {
        show_error();  // ❌ إظهار الخطأ إذا كانت هناك مشكلة
        show_results(false);  // 👀 إخفاء النتائج
        document.getElementById("error").innerHTML = `${data.msg}`;  // ⚠️ عرض رسالة الخطأ

        return;
    }

    hide_error();  // ✅ إخفاء رسالة الخطأ عند الحصول على نتائج صحيحة
    show_results(true);  // 👀 إظهار النتائج

    // 📝 عرض المعلومات المستلمة في الصفحة
    document.getElementById("agreement").innerHTML = `Agreement: ${data.sample.agreement}`;
    document.getElementById("subjectivity").innerHTML = `Subjectivity: ${data.sample.subjectivity}`;
    document.getElementById("confidence").innerHTML = `Confidence: ${data.sample.confidence}`;
    document.getElementById("irony").innerHTML = `Irony: ${data.sample.irony}`;
    document.getElementById("score_tag").innerHTML = `Score Tag: ${data.sample.score_tag}`;
}

// ⏳ إظهار وإخفاء مؤشر التحميل
const loading = (bool) => {
    // 🔄 مؤشر التحميل
    const loader = document.getElementById('loader');
    if (bool) {
        loader.style.display = 'block';  // 👀 عرض مؤشر التحميل
        return;
    }
    loader.style.display = 'none';  // ❌ إخفاء مؤشر التحميل
}

// 👀 إظهار أو إخفاء النتائج
const show_results = (bool) => {
    if (bool) {
        document.querySelectorAll("ul li").forEach(element => {
            element.style.display = "block";  // ✅ إظهار النتائج
        });
        return;
    }
    document.querySelectorAll("ul li").forEach(element => {
        element.style.display = "none";  // ❌ إخفاء النتائج
    });
    return;
}

// ❌ إظهار رسالة الخطأ
const show_error = () => document.getElementById("error").style.display = "block";

// ✅ إخفاء رسالة الخطأ
const hide_error = () => document.getElementById("error").style.display = "none";

export { handleSubmit };  // 📤 تصدير الدالة لاستخدامها في مكان آخر


const meaningCloud = "https://api.meaningcloud.com/sentiment-2.1";
const axios = require("axios");

// 🧠 دالة تحليل النصوص باستخدام واجهة MeaningCloud API
analyze = async (url, key) => {
    // 🔗 بناء الرابط لإجراء التحليل باستخدام API
    analysis = await axios.get(`${meaningCloud}?key=${key}&url=${url}&lang=en`)
        .then(function (response) {
            const { code } = response.data.status;
            // ⚠️ التعامل مع الأخطاء عند وجود مشكلة في التحليل
            if (code == 100) {
                const error = handleError(code, "please enter a valid URL");
                return error;
            } else if (code == 212) {
                const error = handleError(code, response.data.status.msg);
                return error;
            }
            // ✅ في حال كان التحليل ناجحاً، إعادة البيانات مع الوضع الصحيح
            return successResponse(response.data, code);
        });
    return analysis;  // إعادة نتيجة التحليل
}

// ❌ التعامل مع الأخطاء
const handleError = (code, msg) => {
    const error = {
        code: code,
        msg: msg
    };
    return error;  // إعادة كائن الخطأ
}

// 🎯 معالجة البيانات وإرسالها إلى العميل
const successResponse = (data, code) => {
    const { score_tag, agreement, subjectivity, confidence, irony } = data;
    let sample = {
        score_tag: score_tag,  // التصنيف العام للمشاعر (إيجابي، سلبي، محايد...)
        agreement: agreement,  // الاتفاق مع النص
        subjectivity: subjectivity,  // نسبة الموضوعية في النص
        confidence: confidence,  // مستوى الثقة في التحليل
        irony: irony  // وجود السخرية في النص
    };
    result = { sample, status: code };  // النتيجة النهائية التي تحتوي على التحليل وحالة الاستجابة
    return result;  // إعادة النتيجة النهائية
}

module.exports = {
    analyze  // تصدير الدالة لاستخدامها في أجزاء أخرى من التطبيق
};

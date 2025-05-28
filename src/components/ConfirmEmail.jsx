import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/global.css"; // ✅ تأكد من استيراد الأنماط
function ConfirmEmail() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ استخدم useNavigate

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${id}`);

        if (res.data) {
          await axios.patch(`http://localhost:3001/users/${id}`, {
            is_approved: true,
          });

          alert("✅ تم تأكيد بريدك الإلكتروني بنجاح!");

          localStorage.removeItem("pendingUserId"); // 🧼 امسح بيانات التسجيل المؤقتة

          navigate("/login"); // ✅ إعادة التوجيه بعد التأكيد
        }
      } catch (error) {
        console.error("Error confirming email:", error);
      }
    };

    confirm();
  }, [id, navigate]);

  return <h2>جاري تأكيد البريد...</h2>;
}

export default ConfirmEmail;

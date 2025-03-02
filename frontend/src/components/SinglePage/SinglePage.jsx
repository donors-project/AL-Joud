import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux"; // استيراد الـ dispatch
import { setDonationAmount } from "../../redux/donationSlice"; // تأكد من مسار الـ slice
import { Link } from "react-router-dom";

const SinglePage = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");

  const dispatch = useDispatch(); // تعريف الـ dispatch

  const handleDonation = () => {
    // Dispatch المبلغ إلى Redux أو إجراء أي منطق آخر
    dispatch(setDonationAmount(amount));

    // يمكنك أيضاً إضافة منطق آخر مثل إرسال البيانات إلى API
    console.log("تم التبرع بالمبلغ:", amount);
  };

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  // Method 1: Using useParams if you're using React Router
  const params = useParams();

  // Method 2: Extract ID from the URL manually
  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathSegments = path.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  // Use either the route param or extract from URL
  const cardId = params?.id || getIdFromUrl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for ID:", cardId);

        // Fetch data from API
        const response = await axios.get("http://localhost:5000/api/BFY");

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format");
        }

        console.log("API Response:", response.data);

        // Try both string and number comparison
        // Some APIs return IDs as numbers, while URL params are strings
        const foundCard = response.data.find(
          (card) =>
            String(card.id) === String(cardId) ||
            card._id === cardId ||
            card.id === parseInt(cardId)
        );

        console.log("Found card:", foundCard);

        if (!foundCard) {
          setError("البطاقة غير موجودة");
        } else {
          setCardData(foundCard);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("فشل في تحميل البيانات. الرجاء المحاولة مرة أخرى.");
        setLoading(false);
      }
    };

    if (cardId) {
      fetchData();
    } else {
      setError("معرف البطاقة غير موجود");
      setLoading(false);
    }
  }, [cardId]);

  // لطباعة البيانات الكاملة للتصحيح
  useEffect(() => {
    console.log("Current card data:", cardData);
  }, [cardData]);

  if (loading) return <div className="text-center py-6">جاري التحميل...</div>;
  if (error)
    return <div className="text-center py-6 text-red-600">{error}</div>;
  if (!cardData)
    return <div className="text-center py-6">لم يتم العثور على البطاقة</div>;

  return (
    <>
      <div className="p-4 flex-wrap justify-center gap-10 flex my-20">
        <div className="p-6 bg-white rounded-xl shadow-sm w-[40%] flex flex-col justify-around mx-auto">
          <div className="flex justify-end mb-4">
            <h2 className="text-lg font-bold text-gray-800">مبلغ التبرع</h2>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 rtl">
            <button
              onClick={() => handleAmountClick("100")}
              className="py-2 px-4 border border-gray-300 rounded-md text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#69844c]"
            >
              <span className="text-[#69844c]">١٠٠ دينار</span>
            </button>
            <button
              onClick={() => handleAmountClick("50")}
              className="py-2 px-4 border border-gray-300 rounded-md text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#69844c]"
            >
              <span className="text-[#69844c]">٥٠ دينار</span>
            </button>
            <button
              onClick={() => handleAmountClick("10")}
              className="py-2 px-4 border border-gray-300 rounded-md text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#69844c]"
            >
              <span className="text-[#69844c]">١٠ دينار</span>
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-right"
              placeholder="قيمة المبلغ"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mb-4">
            <label className="text-gray-700 text-[20px]">
              تبرع عن أهلك أو أصدقائك وشاركهم الأجر
            </label>
          </div>
          <Link to={"/payment"}>
            <button
              onClick={handleDonation}
              className="w-full bg-[#8da474] hover:cursor-pointer hover:bg-[#7c9364] text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              تبرع الآن
            </button>
          </Link>
        </div>

        <div className="font-sans w-[55%] text-right" dir="rtl">
          {/* Main card */}
          <div className="rounded-lg h-[550px] flex flex-col justify-between overflow-hidden shadow-md">
            {/* Teal background with decorative leaves */}
            <div className="bg-[#AAB99A] h-[200px] relative">
              {/* White card */}
              <div className="bg-white h-[150px] m-6 items-center flex justify-center rounded-lg p-4 text-center shadow-sm">
                <p className=" text-2xl">{cardData.reason}</p>
              </div>
              <div className="h-4 bg-[#D0DDD0] relative">
                <div className="h-full bg-[#727D73] absolute right-0 w-1/5"></div>
                <div className="absolute right-2 top-0 text-xs font-bold text-white">
                  20%
                </div>
              </div>
            </div>

            {/* Progress bar */}

            {/* Case number */}
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-lg font-bold">رقم الحالة:</p>
                <p className="text-lg mr-2">{cardData.id}</p>
              </div>
            </div>

            {/* Statistics grid */}
            <div className="grid grid-cols-3 border-t border-gray-200">
              {/* Amount collected */}
              <div className="p-4 border-l border-gray-200">
                <p className="text-[#7c9364] text-center font-bold mb-2">
                  تم جمع
                </p>
                <div className="flex justify-center items-center">
                  <p className="text-xs mr-1 font-bold px-2 py-1 rounded">
                    د.أ
                  </p>
                  <p className="text-lg font-bold">{cardData.remaining_debt}</p>
                </div>
              </div>

              {/* Amount required */}
              <div className="p-4 border-l border-gray-200">
                <p className="text-[#7c9364] text-center font-bold mb-2">
                  المبلغ المتبقي
                </p>
                <div className="flex justify-center items-center">
                  <p className="text-xs mr-1 font-bold px-2 py-1 rounded">
                    د.أ
                  </p>
                  <p className="text-lg font-bold">
                    {cardData.total_debt - cardData.remaining_debt}
                  </p>
                </div>
              </div>

              {/* Number of beneficiaries */}
              <div className="p-4">
                <p className="text-[#7c9364] text-center font-bold mb-2">
                  عدد المستفيدين
                </p>
                <div className="flex justify-center items-center">
                  <p className="text-lg font-bold">0</p>
                  <p className="text-sm mr-1">مستفيد</p>
                </div>
              </div>
            </div>

            {/* Beneficiary type and city */}
            <div className="grid grid-cols-2 border-t border-gray-200">
              <div className="p-4 border-l border-gray-200">
                <p className="text-[#7c9364] text-center font-bold mb-2">
                  سبب الدين
                </p>
                <p className="text-center font-bold">{cardData.reason}</p>
              </div>

              <div className="p-4">
                <p className="text-[#7c9364] text-center font-bold mb-2">
                  نوع المستفيد
                </p>
                <p className="text-center font-bold">المواطنون</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePage;

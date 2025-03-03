import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHandHoldingUsd, FaHandshake } from "react-icons/fa";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const buttons = [
  {
    icon: <MdOutlineVolunteerActivism size={40} />,
    text: "مساعدة المرضى",
    category: "مساعدة المرضى",
  },
  {
    icon: <FaHandHoldingUsd size={40} />,
    text: "فك كربة السجناء",
    category: "فك كربة السجناء",
  },
  {
    icon: <FaHandshake size={40} />,
    text: "سداد ديون الأسر المحتاجة",
    category: "سداد ديون الأسر المحتاجة",
  },
  {
    icon: <GiOpenBook size={40} />,
    text: "سداد ديون التعليم",
    category: "سداد ديون التعليم",
  },
];

const Announcements = () => {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/BFY");
        setCardsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    setCategoryFilter(category === categoryFilter ? "all" : category);
  };

  const handleDonateClick = (id) => {
    navigate(`/single-page/${id}`);
  };

  const handleDetailsClick = (id) => {
    navigate(`/single-page/${id}`);
  };

  // طريقة مختصرة لتوليد رقم فاتورة ثابت
  const generateInvoiceNumber = (id) => {
    // استخدام الـID والعمليات الحسابية البسيطة لتوليد رقم ثابت يبدو عشوائياً
    const randomPart = (id * 73 + 19).toString().slice(0, 6);
    return `${id}${randomPart}`;
  };

  // ثانياً: تعديل وظيفة البحث في الفلتر
  let filteredCards = cardsData.filter((card) => {
    if (!card.verified || card.total_debt - card.remaining_debt === 0) {
      return false;
    }

    const totalDebt = parseFloat(card.total_debt || 0);
    const remainingDebt = parseFloat(card.remaining_debt || 0);
    const collectionPercentage =
      Math.round((1 - remainingDebt / totalDebt) * 100) || 0;

    // استخدام رقم الفاتورة الثابت المولد من الـ ID في البحث
    const invoiceNumber = generateInvoiceNumber(card.id);

    const matchesSearch =
      invoiceNumber.includes(searchTerm) ||
      card.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.remaining_debt.toString().includes(searchTerm);

    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "low" && collectionPercentage < 50) ||
      (filterValue === "medium" &&
        collectionPercentage >= 50 &&
        collectionPercentage < 80) ||
      (filterValue === "high" && collectionPercentage >= 80);

    const matchesCategory =
      categoryFilter === "all" || card.category === categoryFilter;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  if (loading) return <div className="text-center py-6">جاري التحميل...</div>;
  if (error)
    return <div className="text-center py-6 text-red-600">{error}</div>;

  return (
    <div
      className=" w-full flex-col flex items-center justify-center bg-gray-100"
      dir="rtl"
    >
     <section className="bg-[#dfe8df] mb-5 py-16 px-6 w-full text-center">
      <motion.h2 
        className="text-3xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        أبطال العطاء! 🏆 
      </motion.h2>
      <motion.p 
        className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        تعرف على الأشخاص الرائعين الذين ساهموا في تغيير حياة المحتاجين. كل تبرع يحدث فرقًا حقيقيًا!
      </motion.p>
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/top-donations">
          <button className="bg-[#AAB99A] text-white px-6 py-3 text-lg font-semibold rounded-full hover:cursor-pointer shadow-md hover:bg-[#727D73] transition">
            استكشف المتبرعين المميزين
          </button>
        </Link>
      </motion.div>
    </section>

      <div className="flex w-full justify-around space-x-6 rtl:space-x-reverse p-4">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={`flex flex-col items-center hover:cursor-pointer transition ${
              categoryFilter === btn.category
                ? "text-[#5f7249] font-bold"
                : "text-[#849d6a] hover:text-[#5f7249]"
            }`}
            onClick={() => handleCategoryClick(btn.category)}
          >
            {btn.icon}
            <span className="mt-2 text-lg font-medium">{btn.text}</span>
          </button>
        ))}
      </div>
      <div className="p-6 w-[90%] bg-gray-100" dir="rtl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="بحث"
              className="w-full py-3 pr-10 pl-4 text-right bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#809b62] focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-8 pr-8 pl-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#809b62] focus:border-transparent cursor-pointer transition-all duration-200 w-full md:w-auto"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="all">كل النسب </option>
              <option value="low">أقل من 50%</option>
              <option value="medium">بين 50% و 80%</option>
              <option value="high">أكثر من 80%</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-[#809b62]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                ></path>
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-[#809b62]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        {categoryFilter !== "all" && (
          <div className="mb-4 p-2 bg-[#D0DDD0] rounded-lg text-center">
            <p className="font-medium">
              تم التصفية حسب: {categoryFilter}
              <button
                className="mr-2 px-2 py-1 bg-[#AAB99A] rounded-md hover:bg-[#849d6a] text-white"
                onClick={() => setCategoryFilter("all")}
              >
                إلغاء التصفية
              </button>
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.length > 0 ? (
            filteredCards.map((cardData) => {
              const totalDebt = parseFloat(cardData.total_debt || 0);
              const remainingDebt = parseFloat(cardData.remaining_debt || 0);
              const collectionPercentage =
                Math.round((1 - remainingDebt / totalDebt) * 100) || 0;

              return (
                <div
                  key={cardData.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="bg-[#AAB99A] p-4 relative">
                    <div className="bg-white rounded-lg p-4 mt-2 mb-6">
                      <p className="text-center font-medium text-gray-800">
                        {cardData.reason}
                      </p>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-2 bg-[#D0DDD0]"
                      style={{ width: `${collectionPercentage}%` }}
                    ></div>
                    <div className="absolute bottom-0 right-0 bg-[#727D73] px-2 rounded-tl-md text-white text-sm">
                      {collectionPercentage}%
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <div className="text-gray-700">
                      رقم الفاتورة: {generateInvoiceNumber(cardData.id)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <div className="text-right">
                      <p className="text-gray-500 mb-1">تم جمع</p>
                      <p className="font-bold text-lg">
                        %{" "}
                        {(
                          (cardData.remaining_debt / cardData.total_debt) *
                          100
                        ).toFixed()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 mb-1">المبلغ المتبقي</p>
                      <p className="font-bold text-lg">
                        د.أ {cardData.total_debt - cardData.remaining_debt}
                      </p>
                    </div>
                  </div>
                  <div className="flex p-4 gap-2">
                    <button
                      className="bg-[#8da474] hover:cursor-pointer hover:bg-[#7c9364] text-white px-4 py-2 rounded-md w-1/3"
                      onClick={() => handleDonateClick(cardData.id)}
                    >
                      تبرع الآن
                    </button>
                    <div className="flex border rounded-md w-2/3">
                      <input
                        type="number"
                        className="w-full px-3 py-2 text-right outline-none"
                        placeholder="مبلغ التبرع"
                      />
                      <span className="bg-gray-100 px-3 py-2 text-gray-600 border-l">
                        د.أ
                      </span>
                    </div>
                  </div>
                  <div className="p-4 text-center border-t">
                    <button
                      className="text-gray-500 font-bold hover:cursor-pointer hover:text-gray-800"
                      onClick={() => handleDetailsClick(cardData.id)}
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              لا توجد بيانات متاحة
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;

import React, { useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaHandsHelping,
  FaBuilding,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Contact() {
  const [formStatus, setFormStatus] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact/submit",
        formData
      );
      setFormStatus("success");
      console.log(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
      setFormStatus("error");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-white to-[#F7F7F7] flex flex-col"
    >
      <div className="max-w-5xl w-full mx-auto px-4 mt-12 mb-16">
        <h1 className="text-3xl font-bold text-center text-[#727D73] mb-2">
          تواصل معنا
        </h1>
        <p className="text-center text-[#AAB99A] mb-8 text-base">
          نحن هنا للاستماع إليك ومساعدتك
        </p>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="p-6 md:p-8 col-span-3 border-b md:border-b-0 md:border-r border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-[#727D73] flex items-center">
                <span className="inline-block w-8 h-1 bg-[#AAB99A] ml-3"></span>
                أرسل لنا رسالة
              </h2>

              {formStatus === "success" ? (
                <div className="bg-[#D0DDD0] border border-[#AAB99A] rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-[#727D73] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#727D73]">
                    شكراً لك!
                  </h3>
                  <p className="text-[#727D73] mb-4 text-base">
                    تم استلام رسالتك. سنعاود الاتصال بك قريباً.
                  </p>
                  <button
                    onClick={() => setFormStatus(null)}
                    className="px-5 py-2 rounded-lg font-medium text-white bg-[#727D73] hover:bg-[#AAB99A] transition-colors duration-300 shadow-md"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium mb-1 text-[#727D73]">
                        الاسم
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 rounded-lg border border-[#D0DDD0] focus:outline-none focus:ring-2 focus:ring-[#AAB99A] focus:border-transparent transition-all duration-300"
                          placeholder="اسمك الكريم"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#727D73]">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 rounded-lg border border-[#D0DDD0] focus:outline-none focus:ring-2 focus:ring-[#AAB99A] focus:border-transparent transition-all duration-300"
                        placeholder="بريدك الإلكتروني"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#727D73]">
                      الرسالة
                    </label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 rounded-lg border border-[#D0DDD0] focus:outline-none focus:ring-2 focus:ring-[#AAB99A] focus:border-transparent transition-all duration-300"
                      placeholder="أخبرنا كيف تود المشاركة..."
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-lg text-white font-medium bg-[#727D73] hover:bg-[#AAB99A] focus:outline-none focus:ring-2 focus:ring-[#727D73] shadow-md transition-all duration-300"
                    >
                      إرسال رسالتك
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info Section */}
            <div className="col-span-2 p-6 md:p-8 bg-gradient-to-br from-[#F7F7F7] to-[#E8EFE8]">
              <h3 className="text-lg font-bold mb-6 text-[#727D73] flex items-center">
                <span className="inline-block w-6 h-1 bg-[#AAB99A] ml-2"></span>
                كيف تساعد مساهمتك؟
              </h3>
              <div className="space-y-5">
                <div className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full ml-4 bg-[#D0DDD0] shadow-md">
                    <FaUsers className="w-4 h-4 text-[#727D73]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#727D73]">5,000+</h4>
                    <p className="text-[#AAB99A] text-sm">
                      أشخاص يتم مساعدتهم سنوياً
                    </p>
                  </div>
                </div>

                <div className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full ml-4 bg-[#D0DDD0] shadow-md">
                    <FaHandsHelping className="w-4 h-4 text-[#727D73]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#727D73]">200+</h4>
                    <p className="text-[#AAB99A] text-sm">متطوعين نشطين</p>
                  </div>
                </div>

                <div className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full ml-4 bg-[#D0DDD0] shadow-md">
                    <FaBuilding className="w-4 h-4 text-[#727D73]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#727D73]">15</h4>
                    <p className="text-[#AAB99A] text-sm">مراكز مجتمعية</p>
                  </div>
                </div>

                <hr className="border-t border-[#D0DDD0]" />

                {/* Contact Information */}
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="text-lg font-bold mb-4 text-[#727D73] flex items-center">
                    <span className="inline-block w-6 h-1 bg-[#AAB99A] ml-2"></span>
                    تواصل معنا
                  </h3>
                  <div className="space-y-3 text-[#727D73]">
                    <div className="flex items-center bg-[#F7F7F7] p-2 rounded-lg">
                      <div className="w-8 h-8 bg-[#D0DDD0] rounded-full flex items-center justify-center ml-3">
                        <FaPhone className="w-3 h-3 text-[#727D73]" />
                      </div>
                      <span className="text-sm">(123) 456-7890</span>
                    </div>

                    <div className="flex items-center bg-[#F7F7F7] p-2 rounded-lg">
                      <div className="w-8 h-8 bg-[#D0DDD0] rounded-full flex items-center justify-center ml-3">
                        <HiOutlineMail className="w-3 h-3 text-[#727D73]" />
                      </div>
                      <span className="text-sm">contact@yourcharity.org</span>
                    </div>

                    <div className="flex items-center bg-[#F7F7F7] p-2 rounded-lg">
                      <div className="w-8 h-8 bg-[#D0DDD0] rounded-full flex items-center justify-center ml-3">
                        <FaMapMarkerAlt className="w-3 h-3 text-[#727D73]" />
                      </div>
                      <span className="text-sm">
                        شارع الجمعية 123
                        <br />
                        اسم المدينة، الرمز 12345
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

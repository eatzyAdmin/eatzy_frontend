"use client";
import React from "react";
import { } from "@repo/ui";
import { User, Coffee, Leaf } from "@repo/ui/icons";

export default function AboutSection() {
  return (
    <section className="px-6 py-12 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-2">Về chúng tôi</h2>
          <p className="text-gray-700 mb-4">Nhà hàng A tự hào mang tới những trải nghiệm ẩm thực hấp dẫn, với nguyên liệu sạch và đầu bếp tài năng.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-full bg-green-50 text-green-500"><Leaf size={18} /></div>
              <div>
                <div className="font-semibold">Nguyên liệu sạch</div>
                <div className="text-sm text-gray-600">Chọn từ các nhà cung cấp sạch, hữu cơ</div>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-full bg-orange-50 text-orange-500"><Coffee size={18} /></div>
              <div>
                <div className="font-semibold">Phong cách ẩm thực</div>
                <div className="text-sm text-gray-600">Fusion Việt, Á, Âu kết hợp sáng tạo</div>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-full bg-blue-50 text-blue-500"><User size={18} /></div>
              <div>
                <div className="font-semibold">Đầu bếp chuyên nghiệp</div>
                <div className="text-sm text-gray-600">Đầu bếp từng làm việc tại nhà hàng danh tiếng</div>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-full bg-yellow-50 text-yellow-500">⭐</div>
              <div>
                <div className="font-semibold">Điểm đặc trưng</div>
                <div className="text-sm text-gray-600">Menu thay đổi theo mùa, nhiều lựa chọn cho người ăn chay</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Hành trình của chúng tôi</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold">2020</div>
                <div>
                  <div className="font-semibold">Thành lập</div>
                  <div className="text-sm text-gray-600">Bắt đầu với tầm nhìn phục vụ ẩm thực tinh tế</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold">2022</div>
                <div>
                  <div className="font-semibold">Giải thưởng</div>
                  <div className="text-sm text-gray-600">Được công nhận với giải thưởng 'Best Local Cuisine'</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold">2024</div>
                <div>
                  <div className="font-semibold">Mở rộng Menu</div>
                  <div className="text-sm text-gray-600">Nhiều món chay và lựa chọn healthy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="p-4 rounded-lg bg-white border">
            <h3 className="font-semibold mb-2">Câu chuyện</h3>
            <p className="text-sm text-gray-600">Nhà hàng A được thành lập với tâm huyết đem ẩm thực tinh tế đến gần hơn với thực khách.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

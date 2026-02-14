import localFont from "next/font/local";

/**
 * PHIÊN BẢN ANTONIO CŨ (DÙNG CHO CƠ CHẾ NEXT.JS)
 * Lưu ý: Chúng ta dùng EatzyMixedFont trong globals.css để xử lý Tiếng Việt.
 * Biến này vẫn được giữ lại để đảm bảo tính tương thích với layout.
 */
export const antonio = localFont({
  variable: "--font-anton-local",
  src: [
    { path: "../Antonio/Antonio-Thin.ttf", weight: "100", style: "normal" },
    { path: "../Antonio/Antonio-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../Antonio/Antonio-Light.ttf", weight: "300", style: "normal" },
    { path: "../Antonio/Antonio-Regular.ttf", weight: "400", style: "normal" },
    { path: "../Antonio/Antonio-Medium.ttf", weight: "500", style: "normal" },
    { path: "../Antonio/Antonio-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../Antonio/Antonio-Bold.ttf", weight: "700", style: "normal" }
  ],
  display: "swap",
});
export const getExpiryStatus = (itemDate) => {
  if (!itemDate) return { diffDays: 0, isUrgent: false, isExpired: false, text: "" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(itemDate);
  expiryDate.setHours(0, 0, 0, 0); // 確保過期日期也歸零時間，只比年月日

  // 計算毫秒差並轉為天數
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return {
    diffDays,
    isUrgent: diffDays <= 3 && diffDays >= 0,
    // isExpired: diffDays < 0,
    // 你甚至可以直接在這裡把顯示文字準備好
    color: diffDays <= 3 ? "#ff4d4f" : "#030900ff"
  };
};
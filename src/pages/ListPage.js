import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'; // 1. 引入 Hook
import { getExpiryStatus } from "../utils/dateHelper";


function ListPage({ list, onDelete }) {

  const [swipingId, setSwipingId] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const touchStartRef = useRef(0);
  const { t } = useTranslation();

  const navigate = useNavigate(); // 2. 初始化導航函數
  const handleAddManually = () => {
    // 這裡可以放一些跳轉前的邏輯
    navigate('/'); // 3. 執行跳轉
  };
  return (
    <div style={{ padding: "20px", paddingBottom: "80px" }}>
      <h2>🧊 {t('own')}</h2>
      {list.length === 0 && (
        <p style={{ color: "#999", textAlign: "center" }}>{t('empty')}</p>
      )}
      {list.map((item) => {
        const { diffDays, isUrgent, color } = getExpiryStatus(item.expiryDate);

        return (
          <div
            key={item.id}
            style={{
              position: "relative",
              height: "65px",
              marginBottom: "12px",
              overflow: "hidden",
              borderRadius: "12px",
              backgroundColor: "#f44336",
              touchAction: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "20px",
                top: "22px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {(t('delete'))}
            </div>
            <div
              onTouchStart={(e) => {
                setSwipingId(item.id);
                touchStartRef.current = e.targetTouches[0].clientX;
              }}
              onTouchMove={(e) => {
                if (swipingId !== item.id) return;
                const diff = touchStartRef.current - e.targetTouches[0].clientX;
                if (diff > 0) setOffsetX(Math.min(diff, 80));
              }}
              onTouchEnd={() => {
                if (offsetX > 65) onDelete(item.id);
                setOffsetX(0);
                setSwipingId(null);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 2,
                // --- 2. 修改這裡：如果是緊急食材，背景變淡紅 ---
                backgroundColor: isUrgent ? "#fff1f0" : "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px",
                boxSizing: "border-box",
                borderBottom: "1px solid #f0f0f0",
                transform:
                  swipingId === item.id
                    ? `translateX(-${offsetX}px)`
                    : "translateX(0)",
                transition:
                  swipingId === item.id
                    ? "none"
                    : "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                // 加個左邊框更醒目
                borderLeft: isUrgent ? "6px solid #f44336" : "none",
              }}
            >
              {/* --- 3. 修改文字顏色 --- */}
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: color,
                }}
              >
                {item.name} {isUrgent && (diffDays < 0 ? "⚠️" : "⏰")}
              </span>

              <span
                style={{
                  color: color,
                  fontSize: "14px",
                  fontWeight: isUrgent ? "bold" : "normal",
                }}
              >
                {item.expiryDate ? item.expiryDate : t('no_date')}
              </span>
            </div>
          </div>    
        );
      })}
       <button
        onClick={handleAddManually}
        
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      > {(t('add_manually'))}</button>
    </div>
  );
}

export default ListPage;

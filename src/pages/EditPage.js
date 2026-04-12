import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import { useFridgeData } from "../hooks/useFridgeData";

function EditPage({ onAdd, handleAddMultipleFoods }) {
  const {handleIdentify, loading, progress, scannedItems,setScannedItems,isConfirming,setIsConfirming
  ,isFlying,setIsFlying} = useFridgeData(); // 呼叫 Hook

  const SUGGESTED_DAYS = { 牛奶: 7, 鸡蛋: 14, 面包: 5, 水果: 4, 蔬菜: 7 };
  const [foodName, setFoodName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");



  const { t } = useTranslation();

  // 动作
  const handleSave = () => {
    if (!foodName || !expiryDate) return;
    onAdd({ id: `${Date.now()}`, name: foodName, expiryDate: expiryDate });
    //--清空输入框内数据  动画效果
    setIsFlying(true);
    setTimeout(() => {
      setIsFlying(false);
      setFoodName("");
    }, 800);
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>🍎{t("app_name")} </h2>
      <input
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          boxSizing: "border-box",
        }}
        value={foodName}
        placeholder={t('example')}
        onChange={(e) => {
          const val = e.target.value;
          setFoodName(val);
          if (SUGGESTED_DAYS[val]) {
            const d = new Date();
            d.setDate(d.getDate() + SUGGESTED_DAYS[val]);
            setExpiryDate(d.toISOString().split("T")[0]);
          }
        }}
      />
      <input
        type="date"
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          boxSizing: "border-box",
        }}
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
      <button
        onClick={handleSave}
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
      >
       {  t('save')}
      </button>

        <div style={{ marginTop: '30px' }}>
          {/* 修改這裡：onChange 綁定 handleIdentify */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleIdentify} 
            id="receipt-upload" 
            style={{ display: 'none' }} 
          />
           <button 
            onClick={() => document.getElementById('receipt-upload').click()}
            className="scan-btn"
            disabled={loading}
            style={{
              width: '100%', padding: '15px', backgroundColor: '#007AFF',
              color: 'white', borderRadius: '12px', fontSize: '18px',
              fontWeight: 'bold', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? t('loading') + ` ${progress}%...` : t('take_photo')}
          </button>
          
        <ConfirmModal
          isOpen={isConfirming}
          items={scannedItems}
          onClose={() => setIsConfirming(false)}
          onUpdateItem={(index, field, value) => {
            const newItems = [...scannedItems];
            newItems[index][field] = value;
            setScannedItems(newItems);
          }}
          onDeleteItem={(index) => {
            setScannedItems(scannedItems.filter((_, i) => i !== index));
          }}
          onSave={() => {
            // 這裡可以把 scannedItems 批量加入到 list 中
        handleAddMultipleFoods(scannedItems); // 一次搞定所有項目

            setIsConfirming(false);
             //--清空输入框内数据
         setIsFlying(true);
          }}
        />
          
        </div>
     
        
      {/* 動畫小方塊 */}
      {isFlying && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "40%",
            width: "30px",
            height: "30px",
            backgroundColor: "#28a745",
            borderRadius: "5px",
            zIndex: 999,
            animation: "flyDown 0.8s ease-in-out forwards",
          }}
        />
        
      )}

      {/* CSS 動畫效果 */}
      <style>{`
  @keyframes flyDown {
    0% { transform: scale(1) translateY(0) translateX(0); opacity: 1; }
    100% { transform: scale(0.2) translateY(1100px) translateX(130px); opacity: 0; }
  }
`}</style>
    </div>
  );
}

export default EditPage;

// src/hooks/useFridgeData.js   hook
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useFridgeData() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scannedItems, setScannedItems] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
   const [isFlying, setIsFlying] = useState(false);
  
  // 1. 初始化讀取
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("my_fridge_data");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 自動同步到 LocalStorage
  useEffect(() => {
    localStorage.setItem("my_fridge_data", JSON.stringify(list));
  }, [list]);

  // 3. 封裝新增功能 单个
  const addFood = (item) => {
    setList(prev => [...prev, item]);
  };
 
//   //3.1 新增：批量新增方法 (給 AI 識別用的)
    //批量处理ai食材
  // 專門處理 AI 辨識出的多個項目
const handleAddMultipleFoods = (newItems) => {
  if (!Array.isArray(newItems)) return;

  setList((prevList) => {
    // 在這裡偷偷幫每一項補上一個「虛擬 ID」
    // 這樣你在刪除時就有依據，不需要手動管理
    const itemsWithIdentity = newItems.map((item, index) => ({
      ...item,
      // 使用時間戳 + 循環索引，保證這批數據絕對不會撞車
      id: `${Date.now()}-${index}`
    }));

    const updatedList = [...prevList, ...itemsWithIdentity];
    localStorage.setItem("my_fridge_data", JSON.stringify(updatedList));
    return updatedList;
  });
};
  

  // 4. 封裝刪除功能
  const deleteFood = (id) => {
    const targetItem = list.find((item) => item.id === id);
    if (window.confirm(t("confirm_delete", { foodName: targetItem?.name || t("this_food") }))) {
      setList(prev => prev.filter((item) => item.id !== id));
    }
  };

  ////图片缩放  识别
  const compressImage = (file, maxWidth = 1024, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // 1. 创建 FileReader 读取文件
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      // 2. 将读取到的 DataURL 装载到 Image 对象中
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // 3. 计算压缩后的尺寸
        let width = img.width;
        let height = img.height;

      let ratio = 1;
if (width > maxWidth || height > maxWidth) {
  // 找出寬高之中較大的一個，確保最長的那一邊不超過 1024
  ratio = maxWidth / Math.max(width, height);
  width = width * ratio;
  height = height * ratio;
}

        // 4. 使用 Canvas 进行绘制和压缩
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // 将 Image 绘制到 Canvas 上
        ctx.drawImage(img, 0, 0, width, height);

        // 5. 将 Canvas 内容导出为 Blob
        // 第一个参数是目标格式 (jpeg 压缩效果最好)，第二个是质量
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob); // 成功返回压缩后的 Blob
          } else {
            reject(new Error('图片压缩失败'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
}
//
  // --- 核心 AI 識別邏輯 ---
  const handleIdentify = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(10); // 開始處理

    try {
      // Step 1: 壓縮圖片
      setProgress(30);
      const compressedBlob = await compressImage(file);
      
      // Step 2: 轉 Base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedBlob);
      
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        setProgress(60);
const apiKey = process.env.REACT_APP_AI_API_KEY;

        // Step 3: 調用 Gemini API
        try {
          const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key="+apiKey;
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: "識別圖中商品和預估保質期。請直接返回 JSON 數組格式，包含 name 和 expiryDate（格式 YYYY-MM-DD）。例如：[{\"name\": \"牛奶\", \"expiryDate\": \"2026-04-15\"}]" },
                  { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                ]
              }]
            })
          });

          const data = await response.json();
        
          const aiText = data.candidates[0].content.parts[0].text;
          
          // 解析 JSON 並更新彈窗內容
          const cleanedJson = JSON.parse(aiText.replace(/```json|```/g, ""));
          setScannedItems(cleanedJson);
         
          setProgress(100);
          setIsConfirming(true); // 識別成功後自動打開彈窗
        } catch (apiErr) {
          alert(t('ai_error'));
          // 2. 用戶點擊「確定」後，會執行到這裡，觸發重新整理
  window.location.reload();
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
 
  // 回傳給外部使用的數據和方法
  return { list, addFood, deleteFood, setList, handleAddMultipleFoods,
     compressImage, handleIdentify, loading, progress, scannedItems, 
     setScannedItems, isConfirming, setIsConfirming, isFlying, setIsFlying };
}
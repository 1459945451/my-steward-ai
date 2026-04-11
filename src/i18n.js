import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "Home Manager",
      "add_item": "Add Item",
      "expiry_date": "Expiry Date",
      "urgent_tag": "Expiring Soon",
      "delete": "Delete",
      "list": "List",
      "example": "Example: Milk",
      "save": "Save",
      "own": "Fridge Contents",
      "empty": "Fridge is Empty",
      "this_food": "This Food",
      'confirm_items': "Confirm Items",
      'please_check': "Please check the scan results and adjust the dates.",
      'cancel': "Cancel",
      'confirm_save': "Confirm Save",
      'scan_receipt': "Scan Receipt",
      'add_manually': "Add Manually",
      'take_photo': "📷 Take Photo to Add",
      'loading': "Loading..."
    }
  },
  ja: {
    translation: {
      "app_name": "ホームマネージャー",
      "add_item": "食材を追加",
      "expiry_date": "賞味期限",
      "urgent_tag": "期限間近",
      "delete": "削除",
      'list': "リスト",
      'example': "例:牛乳",
      'save': "保存",
      'own': "冷蔵庫の食材",
      'empty': "冷蔵庫は現在空です",
      'this_food': "この食材",
      'confirm_delete': "冷蔵庫から「{{foodName}}」を削除しますか？",
      'confirm_items': "このアイテムを確認しますか？",
      'please_check': "スキャン結果を確認し、日付を微調整してください。",
      'cancel': "キャンセル",
      'confirm_save': "保存を確認しますか？",
      'scan_receipt': "レシートをスキャン",
      'add_manually': "手動で追加",
      'take_photo': "📷 撮影して追加",
      'loading': "読み込み中...",
      'ai_error': "サーバーが混雑しています。3秒後に再試行してください。"
    }
  },
  zh: {
    translation: {
      "app_name": "家庭小管家",
      "add_item": "添加食材",
      "expiry_date": "过期日期",
      "urgent_tag": "即将过期",
      "delete": "删除",
      'list': "清单",
      'example': "例如:牛奶",
      'save': "保存",
      'own': "冰箱内现有食材",
      'empty': "冰箱目前是空的",
      'this_food': "这个食材",
      'confirm_delete': "确定要从冰箱移除「{{foodName}}」吗？",
      'confirm_items': "确定项目",
      'please_check': "请检查扫描结果并微调日期。",
      'cancel': "取消",
      'confirm_save': "确认保存",
      'scan_receipt': "扫描收据",
      'add_manually': "手动添加",
      'take_photo': "📷 拍摄添加",
      'loading': "读取中...",
      'ai_error': "服务器太挤了，请过3秒后重试"
    }
  }
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    // 2. 核心修改：優先從 localStorage 讀取，如果沒有才偵測
    // 注意：LanguageDetector 默認查找的 key 是 'i18nextLng'
    lng: localStorage.getItem('i18nextLng') || undefined, 
    
    fallbackLng: 'zh', // 建議設為 zh 或 ja，因為這是你的主要語系
    
    detection: {
      // 告訴檢測器優先檢查 localStorage
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng', // 確保這裡的 Key 跟你的代碼一致
      caches: ['localStorage']
    },
    
    interpolation: { 
      escapeValue: false 
    }
  });
export default i18n;
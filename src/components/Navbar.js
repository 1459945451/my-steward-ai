
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
function Navbar({ listCount }) {
  const { t, i18n } = useTranslation();
const toggleLanguage = () => {
    const nextLang = i18n.language === 'ja' ? 'zh' : 'ja';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('i18nextLng', nextLang);
  };
  return (
    <div>
      <button onClick={toggleLanguage} style={{
        position: 'absolute',    // 絕對固定位元置
        top: '15px',          // 距離頂部 15 像素
        right: '45px',        // 距離右側 15 像素
        zIndex: 9999,         // 確保在所有元素最上層
        padding: '2px 8px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        backgroundColor: '#f5f5f5'
      }}>
        {i18n.language === 'zh' ? ' 日本語' : '中文'}
      </button>
    <nav style={{
      position: 'fixed', 
      bottom: 0, 
      width: '100%', 
    //   maxWidth: '500px', // 配合你的容器寬度
      height: '60px', 
      backgroundColor: 'white', 
      display: 'flex',
      borderTop: '1px solid #ddd', 
      zIndex: 1000
    }}>
      <Link to="/" style={navItemStyle}>
        <span style={{ fontSize: '18px' }}>✏️</span>
        <span>{t('add_item')}</span>
      </Link>
      
      <Link to="/list" style={navItemStyle}>
        <span style={{ fontSize: '18px' }}>📋</span>
        <span>{t('list')}({listCount})</span>
      </Link>
     
    </nav>
    </div>
  );
}
const navItemStyle = {
  flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
  textDecoration: 'none', color: '#333', fontWeight: 'bold'
};
export default Navbar;
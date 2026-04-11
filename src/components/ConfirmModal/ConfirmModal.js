import React from 'react';
import { useTranslation } from 'react-i18next';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, items, onClose, onSave, onUpdateItem, onDeleteItem }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 頂部裝飾條（像 App 抽屜） */}
        <div className="modal-handle"></div>
        
        <h2 className="modal-title">{t('confirm_items')}</h2>
        <p className="modal-subtitle">{t('please_check')}</p>

        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className="item-card">
              <div className="item-main">
                <input 
                  className="item-name-input"
                  value={item.name}
                  onChange={(e) => onUpdateItem(index, 'name', e.target.value)}
                />
                <button className="delete-mini-btn" onClick={() => onDeleteItem(index)}>✕</button>
              </div>
              
              <div className="item-details">
                <div className="input-group">
                  <label>{t('expiry_date')}</label>
                  <input 
                    type="date" 
                    className="item-date-input"
                    value={item.expiryDate}
                    onChange={(e) => onUpdateItem(index, 'expiryDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>{t('cancel')}</button>
          <button className="btn-confirm" onClick={onSave}>{t('confirm_save')}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
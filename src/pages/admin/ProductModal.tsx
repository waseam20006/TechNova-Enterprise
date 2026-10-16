import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  productToEdit?: Product | null;
  categories: string[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'Laptops & Workstations',
    price: 1999.00,
    originalPrice: 2299.00,
    discountPercentage: 13,
    badge: 'Enterprise Choice',
    stock: 15,
    ram: '32 GB & Above',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow, 2 PM',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title,
        brand: productToEdit.brand,
        category: productToEdit.category,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice || Math.round(productToEdit.price * 1.15),
        discountPercentage: productToEdit.discountPercentage || 10,
        badge: productToEdit.badge || '',
        stock: productToEdit.stock,
        ram: productToEdit.ram || '32 GB & Above',
        deliverySpeed: productToEdit.deliverySpeed || 'Get It Tomorrow',
        deliveryDateText: productToEdit.deliveryDateText || 'Tomorrow',
        description: productToEdit.description,
        image: productToEdit.image,
      });
    } else {
      setFormData({
        title: '',
        brand: 'Apple',
        category: 'Laptops & Workstations',
        price: 1999.00,
        originalPrice: 2299.00,
        discountPercentage: 13,
        badge: 'Enterprise Choice',
        stock: 20,
        ram: '32 GB & Above',
        deliverySpeed: 'Get It Tomorrow',
        deliveryDateText: 'Tomorrow',
        description: 'High performance enterprise computing hardware.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      stock: Number(formData.stock) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-8">
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">inventory</span>
            <h3 className="font-bold text-sm">
              {productToEdit ? t('editProduct') : t('addNewHardwareProduct')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 text-xs space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Dell Precision 7780 Mobile Workstation"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Apple, ASUS, Dell, Lenovo"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Department / Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] bg-white font-semibold"
              >
                <option value="Laptops & Workstations">Laptops & Workstations</option>
                <option value="Monitors & Displays">Monitors & Displays</option>
                <option value="Smartphones & Tablets">Smartphones & Tablets</option>
                <option value="Computer Components">Computer Components</option>
                <option value="PC Gaming & Desktops">PC Gaming & Desktops</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Current Selling Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Original List Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Inventory Stock Units *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Promotional Badge</label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              >
                <option value="">None</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Limited Time Deal">Limited Time Deal</option>
                <option value="Enterprise Choice">Enterprise Choice</option>
                <option value="Platinum Tech">Platinum Tech</option>
                <option value="Top Rated">Top Rated</option>
                <option value="Great Value">Great Value</option>
                <option value="ProArt Series">ProArt Series</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">System Memory (RAM)</label>
              <select
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              >
                <option value="32 GB & Above">32 GB & Above</option>
                <option value="64 GB & Above">64 GB & Above</option>
                <option value="16 GB">16 GB</option>
                <option value="N/A">N/A (Accessories / Displays)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Delivery Speed Tier</label>
              <select
                value={formData.deliverySpeed}
                onChange={(e) => setFormData({ ...formData, deliverySpeed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              >
                <option value="Get It Tomorrow">Get It Tomorrow</option>
                <option value="Get It in 2 Days">Get It in 2 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Hardware Technical Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed enterprise specifications..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
            />
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn-sharp px-5 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded shadow-xs cursor-pointer"
            >
              {productToEdit ? t('saveChanges') : t('createProduct')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

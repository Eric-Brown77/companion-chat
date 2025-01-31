import React, { useState } from 'react';
import Button from '../common/Button';

const Inventory = ({ items = [], maxSize = 20, onUseItem, onDropItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemInfo, setShowItemInfo] = useState(false);

  // 物品类型对应的颜色
  const itemTypeColors = {
    equipment: 'bg-purple-100 border-purple-300',
    consumable: 'bg-green-100 border-green-300',
    material: 'bg-yellow-100 border-yellow-300',
    special: 'bg-blue-100 border-blue-300'
  };

  // 物品信息弹窗
  const ItemInfoModal = ({ item }) => (
    <div className="absolute z-50 bg-white rounded-lg shadow-xl p-4 w-64">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setShowItemInfo(false)}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      
      <div className="mt-2 space-y-2">
        <p className="text-sm text-gray-600">{item.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="capitalize">类型: {item.type}</span>
          <span className="mx-2">•</span>
          <span>数量: {item.quantity}</span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        {item.type === 'consumable' && (
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              onUseItem(item);
              setShowItemInfo(false);
            }}
          >
            使用
          </Button>
        )}
        <Button
          variant="danger"
          size="small"
          onClick={() => {
            onDropItem(item);
            setShowItemInfo(false);
          }}
        >
          丢弃
        </Button>
      </div>
    </div>
  );

  // 背包格子
  const InventorySlot = ({ item, index }) => (
    <div
      className={`
        w-full aspect-square border-2 rounded-lg cursor-pointer
        hover:border-blue-500 transition-colors
        ${item ? itemTypeColors[item.type] : 'border-gray-200'}
      `}
      onClick={() => {
        if (item) {
          setSelectedItem(item);
          setShowItemInfo(true);
        }
      }}
    >
      {item ? (
        <div className="relative w-full h-full p-1">
          {/* 物品图标或默认显示 */}
          <div className="w-full h-full rounded flex items-center justify-center">
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.itemName}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600">
                {item.itemName[0]}
              </span>
            )}
          </div>
          
          {/* 物品数量 */}
          {item.quantity > 1 && (
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 rounded">
              {item.quantity}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          {index + 1}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      {/* 背包标题 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">背包</h2>
        <span className="text-sm text-gray-500">
          {items.length} / {maxSize}
        </span>
      </div>

      {/* 背包格子网格 */}
      <div className="grid grid-cols-4 gap-2">
        {Array(maxSize).fill(null).map((_, index) => (
          <InventorySlot
            key={index}
            item={items[index]}
            index={index}
          />
        ))}
      </div>

      {/* 物品信息弹窗 */}
      {showItemInfo && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <ItemInfoModal item={selectedItem} />
        </div>
      )}
    </div>
  );
};

export default Inventory;
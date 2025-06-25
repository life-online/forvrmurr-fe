import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  className = '',
  disabled = false,
  min = 1,
  max,
}) => {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if ((!max || quantity < max) && !disabled) {
      onIncrease();
    }
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-lg ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={disabled || (max ? quantity >= max : false)}
        className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;

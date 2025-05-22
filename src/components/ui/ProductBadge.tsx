import React from "react";

type BadgeType = "prime" | "premium" | "bestseller";

interface ProductBadgeProps {
  type: BadgeType;
  className?: string;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({
  type,
  className = "",
}) => {
  switch (type) {
    case "prime":
      return (
        <div
          className={`absolute flex gap-1 top-0 text-nowrap left-0 text-red-800 text-xs py-1 rounded-full font-medium z-10 flex mb-3 items-center ${className}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
              fill="#FAD94A"
            />
            <path
              d="M7.97755 2.1275H7.96505C7.7013 5.385 4.99255 7.95125 1.67505 7.98625V8.015C4.99255 8.05 7.7013 10.6163 7.96505 13.8738H7.97755C8.24255 10.5975 10.9825 8.02 14.3263 8.01375V7.98625C10.9825 7.98125 8.2438 5.40375 7.97755 2.12625V2.1275Z"
              fill="white"
            />
          </svg>
          PRIME
        </div>
      );
    case "premium":
      return (
        <div
          className={`absolute top-0 text-nowrap left-0  text-red-800 text-xs py-1 rounded-full font-medium z-10 flex mb-3 items-center ${className}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <g clipPath="url(#clip0_premium)">
              <path
                d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
                fill="#FAD94A"
              />
              <path
                d="M19.9437 5.31855H19.9125C19.2531 13.4623 12.4813 19.8779 4.1875 19.9654V20.0373C12.4813 20.1248 19.2531 26.5404 19.9125 34.6842H19.9437C20.6062 26.4936 27.4562 20.0498 35.8156 20.0342V19.9654C27.4562 19.9529 20.6094 13.5092 19.9437 5.31543V5.31855Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_premium">
                <rect width="40" height="40" fill="white" />
              </clipPath>
            </defs>
          </svg>
          PREMIUM
        </div>
      );
    case "bestseller":
      return (
        <div
          className={`absolute top-0 text-nowrap right-0 bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-sm font-medium z-10 mb-3 flex items-center ${className}`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
              fill="#92400e"
            />
          </svg>
          <p>BEST SELLER</p>
        </div>
      );
    default:
      return null;
  }
};

export default ProductBadge;

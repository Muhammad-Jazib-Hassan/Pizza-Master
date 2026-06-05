import React from 'react';

interface PizzaMasterLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function PizzaMasterLogo({ className = '', size = 'md' }: PizzaMasterLogoProps) {
  // Dimensions based on size
  const dimensions = {
    xs: { width: 'w-8 h-8' },
    sm: { width: 'w-10 h-10' },
    md: { width: 'w-14 h-14' },
    lg: { width: 'w-24 h-24' },
    xl: { width: 'w-36 h-36' },
  };

  const dim = dimensions[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dim.width} ${className}`} id="pizza-master-logo">
      {/* SVG Vector Logo approximating the uploaded branding image precisely */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
      >
        {/* Circular Outer Red Badge */}
        <circle cx="100" cy="100" r="85" fill="#DC2626" />
        <circle cx="100" cy="100" r="78" stroke="white" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="72" stroke="#15803D" strokeWidth="2.5" />

        {/* Pizza Slice Vector Overlapping */}
        <g transform="translate(100, 90) scale(1.05)">
          {/* Sourdough Crust (Top curve) */}
          <path
            d="M -60 -35 C -60 -35 -20 -52 0 -52 C 20 -52 60 -35 60 -35 C 60 -35 65 -25 60 -18 C 55 -11 45 -12 45 -12 Q 0 -35 -45 -12 C -45 -12 -55 -11 -60 -18 C -65 -25 -60 -35 -60 -35 Z"
            fill="#F3E5D8"
            stroke="#D09E72"
            strokeWidth="3"
          />
          {/* Slice Yellow Cheese Tri-angle body */}
          <path
            d="M -45 -12 Q 0 -34 45 -12 L 0 65 Z"
            fill="#FACC15"
          />
          {/* Melted Cheese Details */}
          <path
            d="M -45 -12 Q 0 -26 45 -12 L 35 4 Q 0 -14 -35 4 Z"
            fill="#EAB308"
          />

          {/* Slices of Pepperonis (Red circles) */}
          <circle cx="-14" cy="2" r="9" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
          <circle cx="14" cy="-1" r="10" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
          <circle cx="0" cy="24" r="11" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />

          {/* Tiny Oregano / Green Pepper flakes */}
          <rect x="-24" y="-12" width="6" height="2.5" rx="1" transform="rotate(25, -24, -12)" fill="#166534" />
          <rect x="20" y="-13" width="7" height="2.5" rx="1" transform="rotate(-40, 20, -13)" fill="#166534" />
          <rect x="-16" y="16" width="5.5" height="2.5" rx="1" transform="rotate(80, -16, 16)" fill="#166534" />
          <rect x="18" y="13" width="6" height="2.5" rx="1" transform="rotate(-15, 18, 13)" fill="#166534" />
        </g>

        {/* "THE" label (Top arched/centered text) */}
        <text
          x="100"
          y="64"
          textAnchor="middle"
          fill="white"
          fontSize="17"
          fontWeight="900"
          fontFamily="'Oswald', 'Inter', sans-serif"
          letterSpacing="0.12em"
        >
          THE
        </text>

        {/* Back and Ribbon end folds */}
        {/* Ribbon Left Tail */}
        <path d="M 20 125 L 5 110 L 20 95 Z" fill="#14532D" stroke="#15803D" strokeWidth="1" />
        {/* Ribbon Right Tail */}
        <path d="M 180 125 L 195 110 L 180 95 Z" fill="#14532D" stroke="#15803D" strokeWidth="1" />
        
        {/* Ribbon Fold Shadows */}
        <path d="M 23 113 L 34 113 L 34 125 Z" fill="#14532D" />
        <path d="M 177 113 L 166 113 L 166 125 Z" fill="#14532D" />

        {/* Green Ribbon Body */}
        <path
          d="M 15 110 C 15 110 55 98 100 98 C 145 98 185 110 185 110 L 175 142 C 175 142 140 130 100 130 C 60 130 25 142 25 142 Z"
          fill="#15803D"
          stroke="#166534"
          strokeWidth="2.5"
        />

        {/* PIZZA TEXT (Serif bold yellow uppercase text) */}
        <text
          x="100"
          y="114"
          textAnchor="middle"
          fill="#F59E0B"
          stroke="#78350F"
          strokeWidth="2"
          paintOrder="stroke"
          fontSize="24"
          fontWeight="900"
          fontFamily="'Oswald', sans-serif"
          letterSpacing="0.05em"
        >
          PIZZA
        </text>

        {/* MASTER TEXT (Bold white uppercase text) */}
        <text
          x="100"
          y="134"
          textAnchor="middle"
          fill="white"
          stroke="#14532D"
          strokeWidth="2.5"
          paintOrder="stroke"
          fontSize="18"
          fontWeight="900"
          fontFamily="'Oswald', sans-serif"
          letterSpacing="0.08em"
        >
          MASTER
        </text>
      </svg>
    </div>
  );
}

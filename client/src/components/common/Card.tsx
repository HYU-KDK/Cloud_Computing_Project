import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

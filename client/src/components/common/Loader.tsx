import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const spinner = (
    <div className={`${sizeStyles[size]} animate-spin`}>
      <div className="w-full h-full border-4 border-gray-200 border-t-blue-500 rounded-full"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center">{spinner}</div>;
};

export default Loader;

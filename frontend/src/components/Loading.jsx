import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="spinner mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export const PageLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="spinner mb-4" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  );
};

export const ButtonLoading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
    </div>
  );
};

export default Loading;

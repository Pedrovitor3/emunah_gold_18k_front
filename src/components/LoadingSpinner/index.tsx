import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Spin size="large" tip="Carregando..." />
    </div>
  );
};

export default LoadingSpinner;
import React from 'react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

// Componente de mensagem de erro reutilizável
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span className="block sm:inline">{error}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        Tentar novamente
      </button>
    )}
  </div>
);

export default ErrorMessage; 
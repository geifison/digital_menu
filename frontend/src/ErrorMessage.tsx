// src/components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="text-red-500 bg-red-100 p-4 rounded-md mt-4">
    {message}
  </div>
);

export default ErrorMessage;

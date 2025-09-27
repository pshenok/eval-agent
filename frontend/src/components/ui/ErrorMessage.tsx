import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import BackgroundFX from './BackgroundFX';
import { cn } from '@utils/index';

interface ErrorMessageProps {
  error: any;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry,
  fullScreen = true 
}) => {
  const errorMessage = error?.response?.data?.message || 
                      error?.message || 
                      'Something went wrong. Please try again.';

  const containerClasses = fullScreen 
    ? 'min-h-screen text-slate-200 bg-[#0a0a10] flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      {fullScreen && <BackgroundFX />}
      <div className={cn('p-8 rounded-3xl text-center max-w-md', 'glass')}>
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-slate-300/90 mb-6">
          {errorMessage}
        </p>

        {onRetry && (
          <button 
            onClick={onRetry}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

import { ReactNode } from 'react';

interface QuestionStepProps {
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  canProceed: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export default function QuestionStep({
  children,
  onNext,
  onBack,
  canProceed,
  isFirstStep = false,
  isLastStep = false,
}: QuestionStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
        <div className="space-y-8">
          {children}

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            {!isFirstStep ? (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-garet font-medium
                  text-dark/60 hover:text-dark transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-garet font-medium
                transition-all duration-300 transform
                ${canProceed
                  ? 'gradient-primary text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLastStep ? 'Enviar respuestas' : 'Siguiente'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

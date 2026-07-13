interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between mb-2 text-sm font-garet text-white">
        <span>Pregunta {current} de {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full gradient-progress transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

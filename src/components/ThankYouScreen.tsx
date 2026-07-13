export default function ThankYouScreen() {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-16 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 flex items-center justify-center animate-bounce-slow">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-creato font-bold text-dark">
          ¡Muchas gracias!
        </h1>

        <p className="text-lg md:text-xl font-garet text-dark/70 leading-relaxed">
          Hemos recibido tus respuestas. Tu opinión es muy valiosa para nosotros y nos ayudará a seguir mejorando el servicio para tu marca.
        </p>

        <div className="pt-4">
          <div className="inline-block px-8 py-3 gradient-animated rounded-xl">
            <p className="text-white font-garet font-medium">
              Páramo Creativo · Evaluación registrada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
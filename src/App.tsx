import { useState, useEffect } from 'react';
import { SurveyData } from './types/survey';
import ProgressBar from './components/ProgressBar';
import TextInput from './components/TextInput';
import QuestionStep from './components/QuestionStep';
import ThankYouScreen from './components/ThankYouScreen';

const ENFOQUE_OPCIONES = [
  'Más videos/Reels estructurados y dinámicos (Alta producción)',
  'Estrategias de pauta publicitaria (Meta Ads) para captar clientes',
  'Mayor cobertura y generación de contenido en sitio (Presencial)',
  'Mantener el alcance del plan actual',
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [surveyData, setSurveyData] = useState<SurveyData>({
    nombreCliente: '',
    calidadGeneral: '',
    diseno: '',
    copywriting: '',
    comunicacion: '',
    ahorroTiempo: '',
    enfoqueTrimestre: [],
    sugerencia: '',
  });

  const totalSteps = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleOnline = () => setHasError(false);
    const handleOffline = () => setHasError(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === totalSteps) {
      await submitToNetlifyForms(surveyData);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleEnfoque = (opcion: string) => {
    const actuales = surveyData.enfoqueTrimestre;
    if (actuales.includes(opcion)) {
      setSurveyData({
        ...surveyData,
        enfoqueTrimestre: actuales.filter((o) => o !== opcion),
      });
    } else {
      setSurveyData({
        ...surveyData,
        enfoqueTrimestre: [...actuales, opcion],
      });
    }
  };

  const canProceedStep1 = surveyData.nombreCliente.trim().length > 0;
  const canProceedStep2 = surveyData.calidadGeneral !== '';
  const canProceedStep3 = surveyData.diseno !== '';
  const canProceedStep4 = surveyData.copywriting !== '';
  const canProceedStep5 = surveyData.comunicacion !== '';
  const canProceedStep6 = surveyData.ahorroTiempo !== '';
  const canProceedStep7 = surveyData.enfoqueTrimestre.length > 0;
  const canProceedStep8 = true;

  const submitToNetlifyForms = async (data: SurveyData) => {
    let userIP = 'No disponible';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      userIP = ipData.ip;
    } catch (error) {
      console.error('Error al obtener IP:', error);
    }

    const now = new Date();
    const fechaHora = now.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const subject = `Encuesta de satisfacción - ${data.nombreCliente} - ${fechaHora}`;

    const formData = new FormData();
    formData.append('form-name', 'satisfaccion-clientes');
    formData.append('subject', subject);
    formData.append('nombre-cliente', data.nombreCliente);
    formData.append('calidad-general', data.calidadGeneral);
    formData.append('diseno', data.diseno);
    formData.append('copywriting', data.copywriting);
    formData.append('comunicacion', data.comunicacion);
    formData.append('ahorro-tiempo', data.ahorroTiempo);
    formData.append('enfoque-trimestre', data.enfoqueTrimestre.join(' | '));
    formData.append('sugerencia', data.sugerencia || 'Sin comentarios');
    formData.append('fecha-hora', fechaHora);
    formData.append('direccion-ip', userIP);

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(
          Array.from(formData.entries()) as [string, string][],
        ).toString(),
      });
      console.log('Formulario enviado exitosamente a Netlify Forms');
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-garet">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <h2 className="text-2xl font-creato font-bold mb-4">Error de Conexión</h2>
          <p className="text-white/90 font-garet mb-6">
            Parece que hay un problema con la conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-dark px-6 py-3 rounded-lg font-garet font-medium hover:bg-white/90 transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <ThankYouScreen />
        <footer className="absolute bottom-6 text-center text-white/80 text-sm font-garet">
          Página 1 de 1 · Páramo Creativo · Encuesta de Clientes
        </footer>
      </div>
    );
  }

  const optionButtonClass = (selected: boolean) =>
    `w-full text-left px-5 py-4 rounded-xl font-garet text-base md:text-lg transition-all duration-300 transform hover:scale-[1.01] ${
      selected
        ? 'gradient-primary text-white shadow-lg'
        : 'bg-white text-dark border-2 border-gray-200 hover:border-primary/50'
    }`;

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-creato font-bold text-white mb-3">
            Evaluación de Calidad y Rendimiento
          </h1>
          <p className="text-white/90 font-garet text-lg">
            Páramo Creativo • Formulario de Satisfacción de Clientes
          </p>
          <p className="text-white/80 font-garet text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Estimado cliente: Con el objetivo de optimizar y elevar constantemente el nivel de nuestro servicio de marketing y gestión de redes sociales, le agradecemos tomarse 2 minutos para responder con total sinceridad estas breves preguntas. Sus respuestas son vitales para mejorar la experiencia de su marca.
          </p>
        </div>

        <ProgressBar current={currentStep} total={totalSteps} />

        {currentStep === 1 && (
          <QuestionStep
            onNext={handleNext}
            canProceed={canProceedStep1}
            isFirstStep
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                Antes de comenzar, ¿cuál es tu nombre o el nombre de tu marca?
              </h2>
              <p className="text-center text-sm font-garet text-dark/60">
                Usaremos este dato solo para identificar tu respuesta.
              </p>
              <div>
                <label className="block text-sm font-garet text-dark/70 mb-2">
                  Nombre del cliente o marca (Obligatorio)
                </label>
                <TextInput
                  value={surveyData.nombreCliente}
                  onChange={(value) =>
                    setSurveyData({ ...surveyData, nombreCliente: value })
                  }
                  placeholder="Escribe tu nombre o el de tu marca..."
                  autoFocus
                />
              </div>
            </div>
          </QuestionStep>
        )}

        {currentStep === 2 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep2}
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                ¿Cómo calificarías la calidad general del contenido que publicamos para tu marca?
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { value: 'Excelente (Supera las expectativas)', label: 'Excelente (Supera las expectativas)' },
                  { value: 'Buena (Cumple con lo acordado)', label: 'Buena (Cumple con lo acordado)' },
                  { value: 'Regular (Hay cosas por mejorar)', label: 'Regular (Hay cosas por mejorar)' },
                  { value: 'Mala', label: 'Mala' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, calidadGeneral: option.value })
                    }
                    className={optionButtonClass(surveyData.calidadGeneral === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </QuestionStep>
        )}

        {currentStep === 3 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep3}
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                ¿Qué tan satisfecho estás con la línea gráfica, creatividad y pulcritud visual de las publicaciones? (Área de Diseño)
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    value: 'Muy satisfecho',
                    label: 'Muy satisfecho. Los diseños representan perfectamente la calidad de mi negocio.',
                  },
                  {
                    value: 'Satisfecho',
                    label: 'Satisfecho. El diseño es correcto y cumple con lo acordado.',
                  },
                  {
                    value: 'Poco satisfecho',
                    label: 'Poco satisfecho. Siento que el estilo visual se ha vuelto monótono o no termina de convencerme.',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, diseno: option.value })
                    }
                    className={optionButtonClass(surveyData.diseno === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </QuestionStep>
        )}

        {currentStep === 4 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep4}
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                ¿Qué tan bien sientes que logramos captar las ideas, la esencia y las necesidades de tu negocio al redactar los textos de las publicaciones? (Copywriting)
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    value: 'Excelente',
                    label: 'Excelente. El equipo entiende la marca a la perfección y captan la idea a la primera.',
                  },
                  {
                    value: 'Bueno',
                    label: 'Bueno. Captan bien la idea, aunque a veces requerimos de varias rondas de ajustes.',
                  },
                  {
                    value: 'Regular',
                    label: 'Regular. Siento que nos cuesta sintonizarnos o que debo explicar las cosas demasiadas veces.',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, copywriting: option.value })
                    }
                    className={optionButtonClass(surveyData.copywriting === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </QuestionStep>
        )}

        {currentStep === 5 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep5}
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                ¿Cómo calificarías la comunicación con el equipo? (No solo en rapidez de respuesta, sino en entendimiento mutuo y efectividad)
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    value: 'Muy satisfecho',
                    label: 'Muy satisfecho. El canal es fluido, entienden rápido mis requerimientos y me dan soluciones reales.',
                  },
                  {
                    value: 'Satisfecho',
                    label: 'Satisfecho. La comunicación es rápida y correcta.',
                  },
                  {
                    value: 'Poco satisfecho',
                    label: 'Poco satisfecho. Siento que respondemos rápido pero nos cuesta avanzar o ejecutar los cambios con claridad.',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, comunicacion: option.value })
                    }
                    className={optionButtonClass(surveyData.comunicacion === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </QuestionStep>
        )}

        {currentStep === 6 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep6}
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                ¿Sientes que el servicio actual te ayuda a ahorrar tiempo y a mantener la presencia de tu negocio activa?
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    value: 'Sí, totalmente',
                    label: 'Sí, totalmente. Es un gran apoyo y me libera de esa carga de trabajo.',
                  },
                  {
                    value: 'A medias, pero ayuda',
                    label: 'A medias, pero ayuda.',
                  },
                  {
                    value: 'No mucho',
                    label: 'No mucho.',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, ahorroTiempo: option.value })
                    }
                    className={optionButtonClass(surveyData.ahorroTiempo === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </QuestionStep>
        )}

        {currentStep === 7 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep7}
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                De las siguientes áreas, ¿en cuál te gustaría que nos enfocáramos más de cara al próximo trimestre? (Puedes marcar varias)
              </h2>
              <div className="flex flex-col gap-3">
                {ENFOQUE_OPCIONES.map((opcion) => {
                  const seleccionada = surveyData.enfoqueTrimestre.includes(opcion);
                  return (
                    <button
                      key={opcion}
                      onClick={() => toggleEnfoque(opcion)}
                      className={`w-full text-left px-5 py-4 rounded-xl font-garet text-base md:text-lg transition-all duration-300 transform hover:scale-[1.01] flex items-start gap-3 ${
                        seleccionada
                          ? 'gradient-primary text-white shadow-lg'
                          : 'bg-white text-dark border-2 border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <span
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                          seleccionada ? 'border-white bg-white/20' : 'border-gray-400'
                        }`}
                      >
                        {seleccionada && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span>{opcion}</span>
                    </button>
                  );
                })}
              </div>
              {surveyData.enfoqueTrimestre.length > 0 && (
                <p className="text-center text-sm font-garet text-dark/60">
                  {surveyData.enfoqueTrimestre.length} seleccionada
                  {surveyData.enfoqueTrimestre.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </QuestionStep>
        )}

        {currentStep === 8 && (
          <QuestionStep
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceedStep8}
            isLastStep
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-creato font-medium text-dark text-center leading-relaxed">
                ¿Tienes alguna sugerencia o comentario adicional para mejorar nuestro servicio?
              </h2>
              <div>
                <label className="block text-sm font-garet text-dark/70 mb-2">
                  Tu opinión (Opcional)
                </label>
                <TextInput
                  value={surveyData.sugerencia}
                  onChange={(value) =>
                    setSurveyData({ ...surveyData, sugerencia: value })
                  }
                  placeholder="Escribe tus comentarios o sugerencias aquí..."
                  multiline
                  autoFocus
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-6 space-y-3 mt-4">
                <h3 className="text-sm font-garet font-semibold text-dark/80 uppercase tracking-wide">
                  Resumen de tus respuestas
                </h3>
                <div className="flex flex-col gap-2 text-sm font-garet">
                  <ResumenRow label="Cliente / Marca" value={surveyData.nombreCliente} />
                  <ResumenRow label="2. Calidad general" value={surveyData.calidadGeneral} />
                  <ResumenRow label="3. Diseño" value={surveyData.diseno} />
                  <ResumenRow label="4. Copywriting" value={surveyData.copywriting} />
                  <ResumenRow label="5. Comunicación" value={surveyData.comunicacion} />
                  <ResumenRow label="6. Ahorro de tiempo" value={surveyData.ahorroTiempo} />
                  <ResumenEnfoque opciones={surveyData.enfoqueTrimestre} />
                </div>
              </div>
            </div>
          </QuestionStep>
        )}

        <footer className="text-center text-white/80 text-sm font-garet mt-8">
          Página 1 de 1 · Páramo Creativo · Encuesta de Clientes
        </footer>
      </div>
    </div>
  );
}

function ResumenRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-garet font-medium text-dark/70 flex-shrink-0">{label}</span>
      <span className="font-garet text-dark text-right break-words">{value || '—'}</span>
    </div>
  );
}

function ResumenEnfoque({ opciones }: { opciones: string[] }) {
  return (
    <div className="py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-garet font-medium text-dark/70 block mb-1">
        6. Enfoque próximo trimestre
      </span>
      {opciones.length > 0 ? (
        <ul className="font-garet text-dark space-y-1 list-disc list-inside">
          {opciones.map((opcion) => (
            <li key={opcion} className="break-words">
              {opcion}
            </li>
          ))}
        </ul>
      ) : (
        <span className="font-garet text-dark/50">—</span>
      )}
    </div>
  );
}

export default App;
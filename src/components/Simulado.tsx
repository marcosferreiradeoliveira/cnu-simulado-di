
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  eixo: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

interface SimuladoProps {
  profile: {
    weights: {
      eixo1: number;
      eixo2: number;
      eixo3: number;
      eixo4: number;
      eixo5: number;
    };
  };
  onFinish: (resultado: any) => void;
}

const Simulado: React.FC<SimuladoProps> = ({ profile, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora em segundos
  const [questions, setQuestions] = useState<Question[]>([]);

  // Gerar questões baseadas nos pesos
  useEffect(() => {
    const generateQuestions = () => {
      const mockQuestions: Question[] = [];
      let id = 1;

      const eixos = [
        { name: 'Eixo 1', weight: profile.weights.eixo1, tema: 'Gestão Governamental e Governança Pública' },
        { name: 'Eixo 2', weight: profile.weights.eixo2, tema: 'Riscos, Inovação, Participação e Coordenação' },
        { name: 'Eixo 3', weight: profile.weights.eixo3, tema: 'Políticas Públicas' },
        { name: 'Eixo 4', weight: profile.weights.eixo4, tema: 'Administração Financeira e Orçamentária' },
        { name: 'Eixo 5', weight: profile.weights.eixo5, tema: 'Transparência e Proteção de Dados' },
      ];

      eixos.forEach(eixo => {
        const numQuestions = eixo.weight * 5; // 5 questões por peso
        for (let i = 0; i < numQuestions; i++) {
          mockQuestions.push({
            id: id++,
            eixo: eixo.name,
            enunciado: `Questão sobre ${eixo.tema} - ${i + 1}. Em relação aos princípios fundamentais da administração pública, assinale a alternativa correta sobre ${eixo.tema.toLowerCase()}.`,
            alternativas: [
              'A implementação deve seguir rigorosamente os protocolos estabelecidos pela administração superior.',
              'Os processos devem ser transparentes e acessíveis ao controle social, respeitando a legislação vigente.',
              'As decisões devem priorizar a eficiência operacional em detrimento dos aspectos legais.',
              'O controle interno é suficiente para garantir a conformidade com as normas estabelecidas.',
              'A participação popular deve ser limitada aos casos expressamente previstos em lei.'
            ],
            correta: 1,
            explicacao: `Esta questão aborda conceitos fundamentais de ${eixo.tema}. A alternativa correta enfatiza a importância da transparência e controle social, princípios essenciais na administração pública moderna.`
          });
        }
      });

      return mockQuestions.sort(() => Math.random() - 0.5); // Embaralhar questões
    };

    setQuestions(generateQuestions());
  }, [profile.weights]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleFinish();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, answer: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    let correctAnswers = 0;
    const resultsByEixo: { [key: string]: { correct: number; total: number } } = {};

    questions.forEach(question => {
      const eixo = question.eixo;
      if (!resultsByEixo[eixo]) {
        resultsByEixo[eixo] = { correct: 0, total: 0 };
      }
      resultsByEixo[eixo].total++;

      if (answers[question.id] === question.correta) {
        correctAnswers++;
        resultsByEixo[eixo].correct++;
      }
    });

    const resultado = {
      totalQuestions: questions.length,
      correctAnswers,
      score: Math.round((correctAnswers / questions.length) * 100),
      resultsByEixo,
      answers,
      questions,
      timeSpent: 3600 - timeLeft
    };

    onFinish(resultado);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Gerando seu simulado personalizado...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  {currentQ.eixo}
                </Badge>
                <span className="text-sm font-medium">
                  Questão {currentQuestion + 1} de {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Respondidas: {answered}/{questions.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
          </CardContent>
        </Card>

        {/* Questão */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              {currentQ.enunciado}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.alternativas.map((alternativa, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[currentQ.id] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
                onClick={() => handleAnswer(currentQ.id, index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <p className="text-sm leading-relaxed">{alternativa}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navegação */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                ← Anterior
              </Button>
              
              <div className="flex gap-2">
                {answers[currentQ.id] !== undefined ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
                <span className="text-sm text-gray-600">
                  {answers[currentQ.id] !== undefined ? 'Respondida' : 'Não respondida'}
                </span>
              </div>

              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNext} className="gradient-primary text-white">
                  Próxima →
                </Button>
              ) : (
                <Button onClick={handleFinish} className="bg-green-600 text-white hover:bg-green-700">
                  Finalizar Simulado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulado;

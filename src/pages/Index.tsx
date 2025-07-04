
import React, { useState } from 'react';
import ProfileSetup from '@/components/ProfileSetup';
import Dashboard from '@/components/Dashboard';
import Simulado from '@/components/Simulado';
import Resultado from '@/components/Resultado';
import { useToast } from '@/hooks/use-toast';

type AppState = 'setup' | 'dashboard' | 'simulado' | 'resultado';

interface Profile {
  name: string;
  cargo: string;
  weights: {
    eixo1: number;
    eixo2: number;
    eixo3: number;
    eixo4: number;
    eixo5: number;
  };
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('setup');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

  const handleProfileComplete = (newProfile: Profile) => {
    setProfile(newProfile);
    setCurrentState('dashboard');
    toast({
      title: `Bem-vindo, ${newProfile.name}! 🎉`,
      description: "Seu perfil foi configurado com sucesso. Pronto para começar a estudar?",
    });
  };

  const handleStartSimulado = () => {
    setCurrentState('simulado');
    toast({
      title: "Simulado Iniciado! 📝",
      description: "Boa sorte! Lembre-se: cada questão é importante para seu resultado.",
    });
  };

  const handleSimuladoFinish = (resultado: any) => {
    setLastResult(resultado);
    setCurrentState('resultado');
    
    const scoreMessage = resultado.score >= 70 ? "Parabéns! 🎉" : "Continue estudando! 💪";
    toast({
      title: scoreMessage,
      description: `Você acertou ${resultado.correctAnswers} de ${resultado.totalQuestions} questões (${resultado.score}%).`,
    });
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
  };

  const handleGeneratePodcast = () => {
    toast({
      title: "🎧 Podcast em Produção!",
      description: "Sua análise personalizada está sendo gerada. Você receberá uma notificação quando estiver pronta!",
    });
    
    // Simular geração do podcast
    setTimeout(() => {
      toast({
        title: "✅ Podcast Pronto!",
        description: "Seu podcast de análise de erros está disponível na seção de resultados.",
      });
    }, 5000);
  };

  const handleViewResults = () => {
    if (lastResult) {
      setCurrentState('resultado');
    } else {
      toast({
        title: "Nenhum resultado encontrado",
        description: "Faça um simulado primeiro para ver seus resultados!",
        variant: "destructive",
      });
    }
  };

  switch (currentState) {
    case 'setup':
      return <ProfileSetup onProfileComplete={handleProfileComplete} />;
    case 'dashboard':
      return (
        <Dashboard
          profile={profile!}
          onStartSimulado={handleStartSimulado}
          onViewResults={handleViewResults}
        />
      );
    case 'simulado':
      return (
        <Simulado
          profile={profile!}
          onFinish={handleSimuladoFinish}
        />
      );
    case 'resultado':
      return (
        <Resultado
          resultado={lastResult}
          onBackToDashboard={handleBackToDashboard}
          onGeneratePodcast={handleGeneratePodcast}
        />
      );
    default:
      return <ProfileSetup onProfileComplete={handleProfileComplete} />;
  }
};

export default Index;

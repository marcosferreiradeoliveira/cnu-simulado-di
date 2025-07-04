
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CargoWeights {
  eixo1: number;
  eixo2: number;
  eixo3: number;
  eixo4: number;
  eixo5: number;
}

interface ProfileSetupProps {
  onProfileComplete: (profile: { name: string; cargo: string; weights: CargoWeights }) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileComplete }) => {
  const [name, setName] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('');
  const [customWeights, setCustomWeights] = useState<CargoWeights>({
    eixo1: 1,
    eixo2: 1,
    eixo3: 1,
    eixo4: 1,
    eixo5: 1
  });

  const cargosPresets = {
    'B5-06-A': { name: 'Analista I - Administração', weights: { eixo1: 3, eixo2: 2, eixo3: 1, eixo4: 3, eixo5: 1 } },
    'custom': { name: 'Personalizado', weights: customWeights }
  };

  const eixosNames = {
    eixo1: 'Gestão Governamental e Governança Pública',
    eixo2: 'Riscos, Inovação, Participação e Coordenação', 
    eixo3: 'Políticas Públicas',
    eixo4: 'Administração Financeira e Orçamentária',
    eixo5: 'Transparência e Proteção de Dados'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedCargo) {
      const weights = selectedCargo === 'custom' ? customWeights : cargosPresets[selectedCargo as keyof typeof cargosPresets].weights;
      onProfileComplete({
        name,
        cargo: cargosPresets[selectedCargo as keyof typeof cargosPresets].name,
        weights
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Configure seu Perfil CNU
          </CardTitle>
          <CardDescription className="text-lg">
            Personalize seus simulados de acordo com o seu cargo e prioridades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo pretendido</Label>
              <Select value={selectedCargo} onValueChange={setSelectedCargo}>
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B5-06-A">Analista I - Administração</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCargo && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pesos dos Eixos Temáticos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(eixosNames).map(([key, name]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium">{name}</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={selectedCargo === 'custom' ? customWeights[key as keyof CargoWeights] : cargosPresets[selectedCargo as keyof typeof cargosPresets]?.weights[key as keyof CargoWeights] || 1}
                          onChange={(e) => {
                            if (selectedCargo === 'custom') {
                              setCustomWeights(prev => ({
                                ...prev,
                                [key]: parseInt(e.target.value) || 1
                              }));
                            }
                          }}
                          disabled={selectedCargo !== 'custom'}
                          className="w-16"
                        />
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full mr-1 ${
                                i < (selectedCargo === 'custom' ? customWeights[key as keyof CargoWeights] : cargosPresets[selectedCargo as keyof typeof cargosPresets]?.weights[key as keyof CargoWeights] || 1)
                                  ? 'bg-blue-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white text-lg py-6"
              disabled={!name || !selectedCargo}
            >
              Começar a Estudar 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;

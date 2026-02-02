'use client';

import { FileText, Upload, Brain, BarChart3, Trophy, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: FileText,
    title: 'Création d\'offres',
    description: 'Créez rapidement vos offres d\'emploi avec tous les critères importants.',
  },
  {
    icon: Upload,
    title: 'Upload CV',
    description: 'Téléchargez en masse les CV des candidats en PDF ou DOCX.',
  },
  {
    icon: Brain,
    title: 'Analyse IA',
    description: 'Notre moteur IA analyse chaque CV par rapport à vos offres en temps réel.',
  },
  {
    icon: BarChart3,
    title: 'Scoring automatique',
    description: 'Obtenez un score de compatibilité détaillé pour chaque candidat.',
  },
  {
    icon: Trophy,
    title: 'Sélection Top 3',
    description: 'Identifiez instantanément les trois meilleurs profils.',
  },
  {
    icon: Zap,
    title: 'Gain de productivité',
    description: '70% de temps gagné sur le tri des candidatures.',
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Les fonctionnalités clés de SMA
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Une plateforme complète pour transformer votre processus de recrutement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

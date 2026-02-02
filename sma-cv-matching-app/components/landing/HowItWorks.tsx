'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Créer une offre',
    description: 'Définissez les critères de votre poste : compétences, expérience, localisation, salaire.',
    details: ['Titre du poste', 'Description détaillée', 'Compétences requises', 'Niveau d\'expérience'],
  },
  {
    number: '2',
    title: 'Uploader les CV',
    description: 'Importez tous les CV de vos candidats en une seule action. Nos systèmes les analyse immédiatement.',
    details: ['Format PDF ou DOCX', 'Upload en masse', 'Extraction automatique', 'Validation instantanée'],
  },
  {
    number: '3',
    title: 'Obtenir les meilleurs profils',
    description: 'Recevez un ranking automatique des candidats avec scores de compatibilité et détails clés.',
    details: ['Ranking par score', 'Top 3 mis en évidence', 'Détails de compatibilité', 'Prêt pour l\'entretien'],
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Comment ça marche en 3 étapes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Un processus simple et rapide pour trouver vos meilleurs talents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-t-4 border-t-primary h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>

                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

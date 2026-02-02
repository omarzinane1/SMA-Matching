'use client';

import { AlertCircle, Clock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const problems = [
  {
    icon: AlertCircle,
    title: 'Trop de candidats',
    description: 'Des centaines de CV à analyser manuellement, sans critère clair de sélection.',
  },
  {
    icon: Clock,
    title: 'Temps perdu',
    description: 'Des heures passées à lire et comparer des CV au lieu de focaliser sur les vrais enjeux RH.',
  },
  {
    icon: Eye,
    title: 'Mauvaise visibilité',
    description: 'Difficile d\'identifier rapidement les meilleurs candidats et les talents cachés.',
  },
];

export function Problems() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Les défis du recrutement moderne
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Les RH font face à des challenges quotidiens qui ralentissent leurs processus de recrutement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card key={index} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

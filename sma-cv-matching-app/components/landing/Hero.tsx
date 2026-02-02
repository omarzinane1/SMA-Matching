'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, Gauge } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background/95">
      {/* Grid background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_1px,rgba(200,200,200,0.03)_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10">
        {/* Main hero content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 hover:border-primary/50 transition-colors">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Alimenté par l'IA avancée</span>
            </div>
          </div>

          {/* Headline section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight text-balance tracking-tight">
              Trouvez les meilleurs profils en secondes
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 text-balance leading-relaxed">
              Laissez notre intelligence artificielle analyser automatiquement et scorer les CV pour trouver les candidats parfaits. Réduisez le temps de recrutement de 80%.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="px-8 py-6 text-base font-semibold gap-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-full bg-transparent border-2 hover:bg-muted/50 transition-colors">
                  Se connecter
                </Button>
              </Link>
            </div>

            {/* Subtext */}
            <p className="text-sm text-muted-foreground">
              ✓ Accès gratuit  •  ✓ Aucune carte de crédit  •  ✓ Essai illimité
            </p>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 pt-20 border-t border-border/50">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Gauge className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">98%</p>
              <p className="text-sm text-muted-foreground">Précision de matching</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">10K+</p>
              <p className="text-sm text-muted-foreground">Recruteurs actifs</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">80%</p>
              <p className="text-sm text-muted-foreground">Moins de temps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

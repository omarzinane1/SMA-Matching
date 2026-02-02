'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 overflow-hidden">
          <div className="px-6 sm:px-12 py-16 sm:py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Prêt à révolutionner votre recrutement ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Rejoignez des entreprises qui utilisent SMA pour recruter les meilleurs talents 3x plus vite.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Commencer maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

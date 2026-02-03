'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, Gauge } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium">
            <Zap className="w-4 h-4 text-primary" />
            Propulsé par l’intelligence artificielle
          </span>
        </div>

        {/* Headline */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-foreground">
              Le recrutement
            </span>
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              devient intelligent
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Analyse automatique des CV, scoring intelligent et matching précis
            pour identifier les meilleurs candidats en quelques secondes.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-8 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-full text-base font-semibold bg-transparent"
              >
                Se connecter
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            ✓ Gratuit • ✓ Sans carte bancaire • ✓ Accès immédiat
          </p>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Stat
            icon={<Gauge className="w-6 h-6 text-primary" />}
            value="98%"
            label="Précision de matching"
          />
          <Stat
            icon={<Users className="w-6 h-6 text-accent" />}
            value="10 000+"
            label="Recruteurs actifs"
          />
          <Stat
            icon={<Zap className="w-6 h-6 text-primary" />}
            value="80%"
            label="Temps économisé"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Stat Card ---------- */
function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur p-8 text-center shadow-sm hover:shadow-md transition">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-lg bg-muted">{icon}</div>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

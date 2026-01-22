'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            SMA Matching
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Système Multi-Agent pour le matching intelligent entre CVs et offres d'emploi
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            Utilisez notre plateforme pour trouver les meilleures correspondances entre candidats et postes
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
            >
              Se connecter
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/register')}
            >
              S'inscrire (Admin)
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="text-lg font-semibold mb-2">📄 Analyse CV</h3>
              <p className="text-muted-foreground">
                Téléchargez et analysez automatiquement les CVs
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="text-lg font-semibold mb-2">🎯 Matching Intelligent</h3>
              <p className="text-muted-foreground">
                Scores de compatibilité en temps réel
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="text-lg font-semibold mb-2">📊 Dashboard</h3>
              <p className="text-muted-foreground">
                Gestion complète des offres et résultats
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

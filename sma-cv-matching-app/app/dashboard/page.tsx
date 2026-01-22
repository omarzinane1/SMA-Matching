'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

interface Offer {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/offers', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch offers');
        const data = await res.json();
        setOffers(data.offers || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            {user?.role === 'admin' && (
              <Link href="/create-offer">
                <Button>Créer une offre</Button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          ) : offers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Aucune offre disponible</p>
              {user?.role === 'admin' && (
                <Link href="/create-offer">
                  <Button>Créer une offre</Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <Card key={offer._id} className="p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {offer.description}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/results?offerId=${offer._id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Voir CVs
                      </Button>
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <Button variant="outline">Éditer</Button>
                        <Button variant="destructive">Supprimer</Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

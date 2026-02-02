'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOffers } from '@/lib/api';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

type JobOffer = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  cvCount: number;
};

export default function ResultsIndexPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ⛔ stop if token not ready
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchOffers = async () => {
      try {
        const data = await getOffers(token);
        const filtered = data.filter((o: JobOffer) => o.cvCount > 0);
        alert(filtered.length)
        setOffers(filtered);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load offers'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 ml-64">
          <Topbar title="Results" />

          <main className="pt-24 pb-12 px-8 max-w-5xl">
            <div className="mb-8">
              <h2 className="text-xl font-semibold">Candidate Matching Results</h2>
              <p className="text-sm text-muted-foreground">
                View AI-calculated matching scores for uploaded CVs
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-6 p-4 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* LOADING */}
            {isLoading && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}

            {/* EMPTY */}
            {!isLoading && offers.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No results available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Upload CVs for job offers to see matching results.
                  </p>
                  <Link href="/cv/upload">
                    <Button>Upload CVs</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* LIST */}
            {!isLoading && offers.length > 0 && (
              <div className="space-y-4">
                {offers.map((offer) => {
                  const offerId = offer._id || offer.id;
                  if (!offerId) return null;

                  return (
                    <Link key={offerId} href={`/results/${offerId}`}>
                      <Card className="hover:shadow-md transition cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {offer.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {offer.description}
                              </p>
                              <div className="mt-3">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                  {offer.cvCount} CV
                                  {offer.cvCount > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

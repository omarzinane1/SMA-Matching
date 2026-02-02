'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getOffers } from '@/lib/api';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Upload, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { JobOffer } from '@/lib/api';

export default function OfferDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffer = async () => {
      if (!token) return;

      try {
        const offers: JobOffer[] = await getOffers(token);

        const found = offers.find(
          (o: JobOffer) => o._id === id
        );

        if (!found) {
          setError('Offer not found');
          return;
        }

        setOffer(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [token, id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Offer Details" />

          <main className="pt-24 pb-12 px-8">
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Offers
            </Link>

            {/* Error */}
            {error && (
              <Card className="border-destructive bg-destructive/10 mb-6">
                <CardContent className="pt-6 text-destructive">
                  {error}
                </CardContent>
              </Card>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}

            {/* Offer */}
            {offer && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl mb-2">
                      {offer.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Posted on {formatDate(offer.date_created)}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {offer.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground font-medium">
                          CVs Uploaded
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {offer.cv_ids.length}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-muted-foreground font-medium">
                          Status
                        </p>
                        <p className="text-2xl font-bold mt-1 text-accent">
                          Active
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href={`/cv/upload/${offer._id}`}>
                    <Button className="w-full h-12" size="lg">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload CV
                    </Button>
                  </Link>

                  <Link href={`/results/${offer._id}`}>
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-transparent"
                      size="lg"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      View Results
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

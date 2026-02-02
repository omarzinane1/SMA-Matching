'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getOffers } from '@/lib/api';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { JobOffer } from '@/lib/api';

export default function UploadCVIndexPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      if (!token) return;
      try {
        const data = await getOffers(token);
        setOffers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Upload CV" />

          <main className="pt-24 pb-12 px-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold">Select a Job Offer</h2>
              <p className="text-sm text-muted-foreground">
                Choose which position to upload a CV for
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {!isLoading && offers.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No job offers available</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a job offer first before uploading CVs.
                  </p>
                  <Link href="/offers/new">
                    <Button>Create Job Offer</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {!isLoading && offers.length > 0 && (
              <div className="space-y-4 max-w-2xl">
                {offers.map((offer) => (
                  <Link key={offer._id} href={`/cv/upload/${offer._id}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-clamp-1">{offer.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {offer.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

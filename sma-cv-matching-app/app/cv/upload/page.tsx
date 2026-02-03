'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOffers } from '@/lib/api';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Upload, Briefcase } from 'lucide-react';
import Link from 'next/link';
import type { JobOffer } from '@/lib/api';

export default function UploadCVIndexPage() {
  const { token } = useAuth();

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
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 ml-64">
          <Topbar title="Upload CV" />

          <main className="pt-24 pb-12 px-8 max-w-6xl">
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Select a Job Offer
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the position where you want to upload candidate CVs
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}

            {/* Empty */}
            {!isLoading && offers.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No job offers available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You need to create a job offer before uploading CVs.
                  </p>
                  <Link href="/offers/new">
                    <Button>
                      Create Job Offer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Offers Grid */}
            {!isLoading && offers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <Link key={offer._id} href={`/cv/upload/${offer._id}`}>
                    <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="pt-6 flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold line-clamp-2">
                            {offer.title}
                          </h3>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                          {offer.description}
                        </p>

                        <div className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
                            <Upload className="w-3 h-3" />
                            Upload CV
                          </span>

                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
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

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOffers, deleteOffer } from '@/lib/api';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Eye, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import type { JobOffer } from '@/lib/api';

export default function OffersPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchOffers = async () => {
    if (!token) return;
    try {
      setError('');
      const data = await getOffers(token);
      setOffers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteOffer(token, id);
      setOffers(prev => prev.filter(o => o._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete offer');
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Job Offers" />

          <main className="pt-24 pb-12 px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold">Manage Job Offers</h2>
                <p className="text-sm text-muted-foreground">
                  Create and manage your job positions
                </p>
              </div>
              <Link href="/offers/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Offer
                </Button>
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Empty */}
            {offers.length === 0 && !isLoading && (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No job offers yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first job offer to start matching candidates.
                  </p>
                  <Link href="/offers/new">
                    <Button>Create First Offer</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Grid */}
            {offers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <Card key={offer._id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {offer.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {offer.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(offer.date_created)}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {offer.cv_ids.length} CV
                        </div>
                      </div>
                    </CardContent>

                    <div className="border-t pt-4 flex gap-2 px-4 pb-4">
                      <Link href={`/offers/${offer._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive bg-transparent"
                        onClick={() =>
                          setDeleteId(deleteId === offer._id ? null : offer._id)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {deleteId === offer._id && (
                      <div className="mx-4 mb-4 p-3 bg-destructive/10 rounded-lg space-y-2">
                        <p className="text-xs text-destructive font-medium">
                          Are you sure?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(offer._id)}
                            className="flex-1"
                          >
                            Delete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

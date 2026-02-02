'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import {
  getResults,
  keepTop3,
  deleteAllResults,
  getOffers,
} from '@/lib/api';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { ChevronLeft, Star, Trash2, Download } from 'lucide-react';

import type { CV, JobOffer } from '@/lib/api';

export default function ResultsPage() {
  const params = useParams();
  const offerId = params.offerId as string;

  const { token } = useAuth();

  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // ===============================
  // Fetch results + offer
  // ===============================
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setError('');

        const [resultsData, offersData] = await Promise.all([
          getResults(token, offerId),
          getOffers(token),
        ]);

        const foundOffer = offersData.find(
          (o: JobOffer) => o.id === offerId || o._id === offerId
        );

        setOffer(foundOffer || null);

        const sorted = (resultsData.cvs || [])
          .slice()
          .sort((a: CV, b: CV) => (b.score?.score || 0) - (a.score?.score || 0));

        setCvs(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, offerId]);

  // ===============================
  // Keep Top 3
  // ===============================
  const handleKeepTop3 = async () => {
    if (!token) return;

    setIsProcessing(true);
    try {
      const top3 = await keepTop3(token, offerId);
      setCvs(top3.sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0)));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to keep top 3');
    } finally {
      setIsProcessing(false);
    }
  };

  // ===============================
  // Delete all
  // ===============================
  const handleDeleteAll = async () => {
    if (!token) return;

    setIsProcessing(true);
    try {
      await deleteAllResults(token, offerId);
      setCvs([]);
      setDeleteConfirm(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete results');
    } finally {
      setIsProcessing(false);
    }
  };

  // ===============================
  // Score color
  // ===============================
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64">
          <Topbar title="Results" />

          <main className="pt-24 pb-12 px-8">
            <Link
              href={offerId ? `/offers/${offerId}` : '/offers'}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" />
              </div>
            )}

            {!isLoading && offer && (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold">{offer.title} – Results</h2>
                  <p className="text-muted-foreground">
                    {cvs.length} candidate{cvs.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Actions */}
                {cvs.length > 0 && (
                  <div className="flex gap-3 flex-wrap">
                    <Button onClick={handleKeepTop3} disabled={isProcessing} className="gap-2">
                      <Star className="w-4 h-4" />
                      Keep Top 3
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirm(true)}
                      className="text-destructive gap-2"
                      disabled={isProcessing}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete All
                    </Button>
                  </div>
                )}

                {/* Delete confirmation */}
                {deleteConfirm && (
                  <Card className="border-destructive bg-destructive/10">
                    <CardContent className="pt-6 flex gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAll}
                        disabled={isProcessing}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteConfirm(false)}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Empty state */}
                {cvs.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Download className="mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">No results yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Upload CVs to see AI matching results.
                      </p>
                      <Link href={`/cv/upload/${offerId}`}>
                        <Button>Upload CVs</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {cvs.length > 0 && (
                  <div className="space-y-4">
                    {cvs.map((cv, index) => {
                      const scoreValue = cv.score?.score ?? 0;
                      return (
                        <Card key={cv._id ?? index} className="hover:shadow-md">
                          <CardContent className="pt-6 flex items-center gap-4">
                            {/* Rank */}
                            <Badge variant="outline">#{index + 1}</Badge>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{cv.full_name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{cv.email}</p>

                              {cv.skills?.length > 0 && (
                                <div className="mt-2 flex gap-2 flex-wrap">
                                  {cv.skills.slice(0, 5).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {cv.skills.length > 5 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{cv.skills.length - 5} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0 w-24">
                              <div className="text-xs font-semibold mb-1 text-right">{scoreValue}%</div>
                              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`${getScoreColor(scoreValue)} h-full`}
                                  style={{ width: `${Math.min(scoreValue, 100)}%` }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from './loading'; // Import the loading component

interface CVResult {
  id: string;
  filename: string;
  score: number;
  uploadedAt: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offerId');

  const [results, setResults] = useState<CVResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offerTitle, setOfferTitle] = useState('');

  useEffect(() => {
    if (!offerId) {
      setError('Offre non spécifiée');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/results/list?offerId=${offerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        
        // Tri par score décroissant
        const sorted = (data.results || []).sort((a: CVResult, b: CVResult) => b.score - a.score);
        setResults(sorted);
        setOfferTitle(data.offerTitle || 'Offre');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [offerId]);

  const handleDelete = async (cvId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/results/delete?cvId=${cvId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete CV');

      setResults(results.filter((r) => r.id !== cvId));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const topResults = results.slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/dashboard" className="mb-4 text-primary hover:underline">
            ← Retour au Dashboard
          </Link>

          {loading ? (
            <Loading /> // Use the Loading component here
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          ) : results.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Aucun CV trouvé pour cette offre</p>
              <Link href="/upload-cv">
                <Button>Télécharger un CV</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Top 3 Results */}
              {topResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Top 3 Correspondances</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {topResults.map((result, idx) => (
                      <Card
                        key={result.id}
                        className="p-6 border-2 border-primary/20 hover:shadow-lg transition relative"
                      >
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{result.filename}</h3>
                        <p className={`text-3xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Téléchargé: {new Date(result.uploadedAt).toLocaleDateString()}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(result.id)}
                          className="w-full"
                        >
                          Supprimer
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Results Table */}
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Tous les CVs ({results.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold">Fichier</th>
                        <th className="text-left p-4 font-semibold">Score</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr
                          key={result.id}
                          className="border-b border-border hover:bg-muted/30 transition"
                        >
                          <td className="p-4">{result.filename}</td>
                          <td className={`p-4 font-bold ${getScoreColor(result.score)}`}>
                            {result.score}%
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(result.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(result.id)}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

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
import { Upload, FileText, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ offers: 0, cvs: 0, topMatches: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const offers = await getOffers(token);
        console.log(offers)
        setStats({
          offers: offers.length,
          cvs: offers.reduce((sum, o) => sum + (o.cv_ids?.length || 0), 0),
          topMatches: 0,
        });
      } catch (err) {
        console.error('[v0] Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Dashboard" />

          <main className="pt-24 pb-12 px-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Total Job Offers</CardTitle>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.offers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active positions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Total CVs Uploaded</CardTitle>
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.cvs}</div>
                  <p className="text-xs text-muted-foreground mt-1">Candidates reviewed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Top Matches</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.topMatches}</div>
                  <p className="text-xs text-muted-foreground mt-1">Best candidates</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/offers/new">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Create Job Offer</h3>
                          <p className="text-sm text-muted-foreground">Post a new job position</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/cv/upload">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <Upload className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Upload CV</h3>
                          <p className="text-sm text-muted-foreground">Add candidate resumes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Empty State */}
            {stats.offers === 0 && !isLoading && (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No job offers yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first job offer to get started with candidate matching.</p>
                  <Link href="/offers/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Offer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createOffer } from '@/lib/api';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewOfferPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (!token) return;

    setIsLoading(true);
    try {
      const result = await createOffer(token, title, description);

      if (!result?.offer_id) {
        throw new Error('Invalid response from server');
      }

      router.push(`/offers/${result.offer_id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Create Job Offer" />

          <main className="pt-24 pb-12 px-8">
            <Link href="/offers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ChevronLeft className="w-4 h-4" />
              Back to Offers
            </Link>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Create New Job Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Job Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g., Senior React Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                      Job Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe the job position, requirements, and responsibilities..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isLoading}
                      required
                      rows={8}
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? 'Creating...' : 'Create Offer'}
                    </Button>
                    <Link href="/offers" className="flex-1">
                      <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface Offer {
  _id: string;
  title: string;
}

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [offerId, setOfferId] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        if (data.offers?.length > 0) {
          setOfferId(data.offers[0].id);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Veuillez sélectionner un fichier PDF ou DOCX');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file || !offerId) {
      setError('Veuillez sélectionner un fichier et une offre');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('offerId', offerId);

      const token = localStorage.getItem('token');
      const res = await fetch('/api/cv/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      setSuccess('CV téléchargé avec succès!');
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Télécharger un CV</h1>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Sélectionner une offre</label>
                <select
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={uploading}
                >
                  <option value="">-- Sélectionner une offre --</option>
                  {offers.map((offer) => (
                    <option key={offer._id} value={offer._id}>
                      {offer.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Télécharger votre CV (PDF ou DOCX)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/5 transition cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <p className="text-muted-foreground">
                      {file ? file.name : 'Cliquez pour sélectionner ou déposez votre fichier'}
                    </p>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 text-green-700 p-4 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={uploading || !file || !offerId}
              >
                {uploading ? 'Téléchargement...' : 'Télécharger le CV'}
              </Button>
            </form>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

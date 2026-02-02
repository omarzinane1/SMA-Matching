'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { getOffers, uploadCV } from '@/lib/api';
import type { JobOffer } from '@/lib/api';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Upload, CheckCircle2, FileText } from 'lucide-react';

export default function UploadCVPage() {
  const params = useParams();
  const offerId = params.offerId as string;
  const router = useRouter();
  const { token } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // =========================
  // Fetch offer
  // =========================
  useEffect(() => {
    const fetchOffer = async () => {
      if (!token || !offerId) return;

      try {
        const offers = await getOffers(token);

        // ⚠️ Important : utiliser _id pour MongoDB
        const found = offers.find((o: JobOffer) => o._id === offerId);

        if (!found) {
          setError('Offer not found');
          setOffer(null);
        } else {
          setOffer(found);
          setError('');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [token, offerId]);

  // =========================
  // File handling
  // =========================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF and DOCX files are accepted');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange({
        target: { files: droppedFiles },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // =========================
  // Upload
  // =========================
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !token) return;

    setIsUploading(true);
    setError('');

    try {
      await uploadCV(token, offerId, file);
      setSuccess(true);
      setFile(null);

      setTimeout(() => {
        router.push(`/offers/${offerId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CV');
    } finally {
      setIsUploading(false);
    }
  };

  // =========================
  // Render
  // =========================
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Upload CV" />

          <main className="pt-24 pb-12 px-8">
            <Link
              href={offerId ? `/offers/${offerId}` : '/offers'}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>

            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary" />
              </div>
            )}

            {error && !isLoading && (
              <Card className="border-destructive bg-destructive/10 mb-6">
                <CardContent className="pt-6 text-destructive">{error}</CardContent>
              </Card>
            )}

            {offer && !isLoading && (
              <div className="max-w-2xl">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Upload CV for {offer.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Upload candidate resumes (PDF or DOCX, max 10MB). Our AI will analyze skills and calculate matching scores.
                    </p>
                  </CardContent>
                </Card>

                {success ? (
                  <Card className="border-accent bg-accent/5">
                    <CardContent className="pt-12 pb-12 text-center">
                      <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">CV Uploaded Successfully</h3>
                      <p className="text-muted-foreground">Redirecting to offer details…</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <form onSubmit={handleUpload} className="space-y-6">
                        {/* Upload Area */}
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                          />

                          <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="font-semibold">
                            {file ? 'File selected' : 'Drop your CV here or click to browse'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {file ? file.name : 'PDF or DOCX (max 10MB)'}
                          </p>
                        </div>

                        {/* File Info */}
                        {file && (
                          <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                          <Button type="submit" disabled={!file || isUploading} className="flex-1">
                            {isUploading ? 'Uploading…' : 'Upload CV'}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            disabled={isUploading}
                            onClick={() => {
                              setFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { Briefcase } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">SMA</span>
          </div>

          <div className="text-center sm:text-right text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Smart Matching Algorithm</p>
            <p>SaaS RH – IA Matching pour le recrutement moderne</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            © 2024 SMA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

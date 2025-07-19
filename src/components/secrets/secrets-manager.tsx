'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Secret } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddSecretDialog from './add-secret-dialog';
import SecretsList from './secrets-list';

export default function SecretsManager() {
  const [secrets, setSecrets] = useLocalStorage<Secret[]>('secrets', []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addSecret = (secret: Omit<Secret, 'id' | 'createdAt'>) => {
    const newSecret: Secret = {
      ...secret,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setSecrets(prev => [newSecret, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const deleteSecret = (id: string) => {
    setSecrets(prev => prev.filter(s => s.id !== id));
  };

  const filteredSecrets = useMemo(() => {
    if (!isMounted) return [];
    return secrets.filter(secret =>
      secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secret.serviceDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [secrets, searchTerm, isMounted]);

  return (
    <div className="w-full space-y-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Secret Agent
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your personal vault for passwords and API keys. Stored securely in your browser.
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="search"
            placeholder="Search secrets by name or description..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Secret
          </Button>
        </div>

        {isMounted ? (
            <SecretsList
                secrets={filteredSecrets}
                onDelete={deleteSecret}
            />
        ) : (
            <div className="w-full h-48 flex items-center justify-center">
                {/* Skeleton loader could go here */}
            </div>
        )}
      </div>

      <AddSecretDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddSecret={addSecret}
      />
    </div>
  );
}

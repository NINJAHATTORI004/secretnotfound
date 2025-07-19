'use client';

import { useState } from 'react';
import type { Secret } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, KeyRound, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ViewSecretDialog from './view-secret-dialog';
import DeleteSecretAlert from './delete-secret-alert';

interface SecretsListProps {
  secrets: Secret[];
  onDelete: (id: string) => void;
}

export default function SecretsList({ secrets, onDelete }: SecretsListProps) {
  const [viewingSecret, setViewingSecret] = useState<Secret | null>(null);
  const [deletingSecret, setDeletingSecret] = useState<Secret | null>(null);

  if (secrets.length === 0) {
    return (
      <Card className="text-center py-12 border-dashed">
        <CardHeader>
            <div className="mx-auto bg-secondary rounded-full p-3 w-fit">
               <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4 font-headline">Your vault is empty</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Click "Add New Secret" to generate and store your first secret.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] hidden sm:table-cell"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {secrets.map(secret => (
                <TableRow key={secret.id} data-testid={`secret-row-${secret.id}`}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="p-2 bg-muted rounded-md w-fit">
                    {secret.type === 'password' ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <KeyRound className="h-5 w-5 text-muted-foreground" />
                    )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{secret.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {secret.type === 'apiKey' ? 'API Key' : 'Password'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(secret.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewingSecret(secret)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive" onClick={() => setDeletingSecret(secret)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {viewingSecret && (
        <ViewSecretDialog
          secret={viewingSecret}
          open={!!viewingSecret}
          onOpenChange={(open) => !open && setViewingSecret(null)}
        />
      )}

      {deletingSecret && (
        <DeleteSecretAlert
          open={!!deletingSecret}
          onOpenChange={(open) => !open && setDeletingSecret(null)}
          onConfirm={() => {
            onDelete(deletingSecret.id);
            setDeletingSecret(null);
          }}
        />
      )}
    </>
  );
}

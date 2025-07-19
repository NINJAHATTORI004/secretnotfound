'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Secret } from '@/lib/types';

interface ViewSecretDialogProps {
  secret: Secret;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewSecretDialog({ secret, open, onOpenChange }: ViewSecretDialogProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setIsRevealed(false);
      setHasCopied(false);
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret.value);
    setHasCopied(true);
    toast({
        title: "Copied to clipboard!",
        description: `The secret for "${secret.name}" has been copied.`,
    })
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{secret.name}</DialogTitle>
          <DialogDescription>
            View and copy your secret. Remember to keep it safe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="secret-value">Secret Value</Label>
                <div className="relative">
                    <Input
                        id="secret-value"
                        readOnly
                        type={isRevealed ? 'text' : 'password'}
                        value={secret.value}
                        className="pr-20 font-code"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                        <Button variant="ghost" size="icon" onClick={() => setIsRevealed(!isRevealed)}>
                            {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{isRevealed ? 'Hide' : 'Reveal'} secret</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                            {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copy to clipboard</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

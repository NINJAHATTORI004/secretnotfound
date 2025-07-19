'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateStrongPassword } from '@/ai/flows/generate-strong-password';
import { suggestApiKey } from '@/ai/flows/suggest-api-key';
import type { Secret } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface AddSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSecret: (secret: Omit<Secret, 'id' | 'createdAt'>) => void;
}

const passwordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  length: z.number().min(8).max(128).default(16),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
});

const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceDescription: z.string().min(1, 'Service description is required'),
  accessLevel: z.string().min(1, 'Access level is required'),
});

export default function AddSecretDialog({ open, onOpenChange, onAddSecret }: AddSecretDialogProps) {
  const [activeTab, setActiveTab] = useState('password');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState('');
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const { toast } = useToast();

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      name: '',
      length: 16,
      includeNumbers: true,
      includeSymbols: true,
    },
  });

  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      serviceDescription: '',
      accessLevel: '',
    },
  });

  const handleGeneratePassword = async () => {
    setIsGeneratingPassword(true);
    setGeneratedPassword('');
    const values = passwordForm.getValues();
    try {
      const result = await generateStrongPassword({
        length: values.length,
        includeNumbers: values.includeNumbers,
        includeSymbols: values.includeSymbols,
      });
      setGeneratedPassword(result.password);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate password.' });
      console.error(error);
    } finally {
      setIsGeneratingPassword(false);
    }
  };
  
  const handleGenerateApiKey = async (values: z.infer<typeof apiKeySchema>) => {
    setIsGeneratingApiKey(true);
    setGeneratedApiKey('');
    try {
      const result = await suggestApiKey({
        serviceDescription: values.serviceDescription,
        accessLevel: values.accessLevel,
      });
      setGeneratedApiKey(result.apiKey);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate API key.' });
      console.error(error);
    } finally {
      setIsGeneratingApiKey(false);
    }
  };

  const saveSecret = () => {
    if (activeTab === 'password' && generatedPassword) {
      const { name, ...metadata } = passwordForm.getValues();
      onAddSecret({
        name,
        type: 'password',
        value: generatedPassword,
        ...metadata,
      });
      closeAndReset();
    } else if (activeTab === 'apiKey' && generatedApiKey) {
      const { name, ...metadata } = apiKeyForm.getValues();
      onAddSecret({
        name,
        type: 'apiKey',
        value: generatedApiKey,
        ...metadata,
      });
      closeAndReset();
    }
  };

  const closeAndReset = () => {
    onOpenChange(false);
    setTimeout(() => {
        passwordForm.reset();
        apiKeyForm.reset();
        setGeneratedPassword('');
        setGeneratedApiKey('');
        setActiveTab('password');
    }, 300);
  };
  
  const [hasCopied, setHasCopied] = useState(false);
  const handleCopy = (value: string) => {
    if(!value) return;
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    toast({ title: "Copied to clipboard!"});
    setTimeout(() => setHasCopied(false), 2000);
  };
  

  const GeneratedValueDisplay = ({ value, onCopy }: { value: string, onCopy: (v:string) => void }) => {
    if (!value) return null;
    return (
        <div className="mt-4 space-y-2 rounded-lg border bg-secondary p-4">
            <Label>Generated Value</Label>
            <div className="relative">
                <Input readOnly value={value} className="pr-10 bg-background font-code" />
                <Button variant="ghost" size="icon" className="absolute inset-y-0 right-0" onClick={() => onCopy(value)}>
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) closeAndReset(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Add a New Secret</DialogTitle>
          <DialogDescription>
            Generate a secure password or API key using AI.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="apiKey">API Key</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <Form {...passwordForm}>
              <form onSubmit={(e) => { e.preventDefault(); handleGeneratePassword(); }} className="space-y-6 pt-4">
                <FormField control={passwordForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name / Label</FormLabel>
                      <FormControl><Input placeholder="e.g., Google Account" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />

                <FormField control={passwordForm.control} name="length" render={({ field: { value, onChange } }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Length</FormLabel>
                            <span className="text-sm text-muted-foreground font-code">{value} characters</span>
                        </div>
                        <FormControl>
                            <Slider
                                min={8} max={128} step={1}
                                value={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                            />
                        </FormControl>
                    </FormItem>
                )} />

                <div className="flex items-center space-x-4">
                    <FormField control={passwordForm.control} name="includeNumbers" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 flex-1">
                            <FormLabel className="text-sm mr-2 select-none">Numbers</FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={passwordForm.control} name="includeSymbols" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 flex-1">
                            <FormLabel className="text-sm mr-2 select-none">Symbols</FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                </div>
                
                <Button type="submit" disabled={isGeneratingPassword || !passwordForm.formState.isValid} className="w-full" variant="outline">
                  {isGeneratingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Password
                </Button>

                <GeneratedValueDisplay value={generatedPassword} onCopy={handleCopy} />

                <Button type="button" onClick={saveSecret} disabled={!generatedPassword} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Save Secret</Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="apiKey">
            <Form {...apiKeyForm}>
              <form onSubmit={apiKeyForm.handleSubmit(handleGenerateApiKey)} className="space-y-6 pt-4">
                <FormField control={apiKeyForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name / Label</FormLabel>
                    <FormControl><Input placeholder="e.g., GitHub API" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={apiKeyForm.control} name="serviceDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl><Input placeholder="e.g., For my personal automation scripts" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={apiKeyForm.control} name="accessLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Level</FormLabel>
                    <FormControl><Input placeholder="e.g., Read-only access to repositories" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <Button type="submit" disabled={isGeneratingApiKey} className="w-full" variant="outline">
                  {isGeneratingApiKey ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate API Key
                </Button>
                
                <GeneratedValueDisplay value={generatedApiKey} onCopy={handleCopy} />

                <Button type="button" onClick={saveSecret} disabled={!generatedApiKey} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Save Secret</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

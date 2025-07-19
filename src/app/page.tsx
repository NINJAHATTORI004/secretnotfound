import SecretsManager from '@/components/secrets/secrets-manager';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <SecretsManager />
      </div>
    </main>
  );
}

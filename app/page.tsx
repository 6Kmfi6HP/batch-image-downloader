import { ImageDownloader } from "@/components/ImageDownloader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 sm:p-8">
      <ImageDownloader />
    </main>
  );
}
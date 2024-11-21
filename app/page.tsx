'use client';

import { ImageDownloader } from "@/components/ImageDownloader";
import { SettingsPanel } from "@/components/settings-panel";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <HomeContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HomeContent() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {mounted ? t('title') : ''}
          </h1>
          <p className="text-muted-foreground">
            {mounted ? t('description') : ''}
          </p>
        </div>
        {/* <SettingsPanel /> */}
      </div>
      <ImageDownloader />
    </>
  );
}
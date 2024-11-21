"use client";

import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function Footer() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {mounted ? t('footer.copyright', { year: new Date().getFullYear() }) : ''}
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/yourusername/batch-image-downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={mounted ? t('footer.github') : ''}
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">{mounted ? t('footer.github') : ''}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

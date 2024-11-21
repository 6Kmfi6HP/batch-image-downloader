"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Download, ImageIcon, Loader2, X, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientOnly } from "@/components/client-only";
import JSZip from 'jszip';

interface DownloadStatus {
  url: string;
  status: 'pending' | 'downloading' | 'success' | 'error';
  error?: string;
}

export function ImageDownloader() {
  const [urls, setUrls] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadStatuses, setDownloadStatuses] = useState<DownloadStatus[]>([]);
  const [customFileName, setCustomFileName] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const getDefaultFileName = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `images_${timestamp}`;
  };

  const getFileName = () => {
    return (customFileName.trim() || getDefaultFileName()) + '.zip';
  };

  const handleDownload = async () => {
    const imageUrls = urls
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (imageUrls.length === 0) {
      toast({
        title: t('status.error'),
        description: t('imageDownloader.noUrls'),
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);
    setProgress(0);
    setDownloadStatuses(imageUrls.map(url => ({ url, status: 'pending' })));

    let successCount = 0;
    let errorCount = 0;
    const zip = new JSZip();

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      setDownloadStatuses(prev => 
        prev.map((status, idx) => 
          idx === i ? { ...status, status: 'downloading' } : status
        )
      );

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        
        // Add the image to zip file
        const extension = blob.type.split("/")[1] || "jpg";
        zip.file(`image-${i + 1}.${extension}`, blob);

        setDownloadStatuses(prev => 
          prev.map((status, idx) => 
            idx === i ? { ...status, status: 'success' } : status
          )
        );
        successCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setDownloadStatuses(prev => 
          prev.map((status, idx) => 
            idx === i ? { ...status, status: 'error', error: errorMessage } : status
          )
        );
        errorCount++;
      }

      setProgress(((i + 1) / imageUrls.length) * 100);
    }

    if (successCount > 0) {
      // Generate zip file and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = getFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }

    toast({
      title: t('status.completed'),
      description: t('imageDownloader.downloadComplete', { 
        success: successCount,
        failed: errorCount
      }),
      variant: errorCount > 0 ? "destructive" : "default",
    });

    setDownloading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      case 'downloading':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          <ClientOnly>
            {t('imageDownloader.title')}
          </ClientOnly>
        </CardTitle>
        <CardDescription>
          <ClientOnly>
            {t('imageDownloader.description')}
          </ClientOnly>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fileName" className="text-sm font-medium">
            <ClientOnly>
              {t('imageDownloader.filename')}
            </ClientOnly>
          </label>
          <Input
            id="fileName"
            placeholder={getDefaultFileName()}
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
          />
        </div>

        <Textarea
          placeholder={t('imageDownloader.placeholder')}
          className="min-h-[200px] font-mono text-sm"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        
        {downloading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              <ClientOnly>
                {t('status.downloading')} {Math.round(progress)}%
              </ClientOnly>
            </p>
          </div>
        )}

        {downloadStatuses.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                <ClientOnly>
                  {t('imageDownloader.downloadStatus')}
                </ClientOnly>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  {downloadStatuses.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        {getStatusIcon(status.status)}
                        <span className="text-sm truncate">{status.url}</span>
                      </div>
                      <Badge variant={status.status === 'success' ? 'default' : 'secondary'}>
                        <ClientOnly>
                          {t(`status.${status.status}`)}
                        </ClientOnly>
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleDownload}
          disabled={downloading || !urls.trim()}
          className="w-full"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          <ClientOnly>
            {downloading ? t('status.downloading') : t('download')}
          </ClientOnly>
        </Button>
      </CardContent>
    </Card>
  );
}
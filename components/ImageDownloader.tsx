"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Download, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export function ImageDownloader() {
  const [urls, setUrls] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDownload = async () => {
    const imageUrls = urls
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (imageUrls.length === 0) {
      toast({
        title: "No URLs found",
        description: "Please enter at least one valid image URL",
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);
    setProgress(0);

    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const url = imageUrls[i];
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Create a download link
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `image-${i + 1}.${blob.type.split("/")[1] || "jpg"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

        setProgress(((i + 1) / imageUrls.length) * 100);
      } catch (error) {
        toast({
          title: "Download Error",
          description: `Failed to download image ${i + 1}`,
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Download Complete",
      description: `Successfully downloaded ${imageUrls.length} images`,
    });

    setDownloading(false);
    setProgress(0);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          Batch Image Downloader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter image URLs (one per line or comma-separated)
Example:
https://example.com/image1.jpg
https://example.com/image2.png, https://example.com/image3.jpg"
          className="min-h-[200px] font-mono text-sm"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        
        {downloading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Downloading... {Math.round(progress)}%
            </p>
          </div>
        )}

        <Button
          onClick={handleDownload}
          disabled={downloading || !urls.trim()}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloading ? "Downloading..." : "Download Images"}
        </Button>
      </CardContent>
    </Card>
  );
}
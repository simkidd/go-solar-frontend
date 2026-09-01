"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SocialShare = ({ title }: { title?: string }) => {
  const [pageUrl, setPageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const copyPageUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold text-[11px] h-8 px-3 cursor-pointer shadow-xs transition-all duration-200"
        >
          <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-black text-foreground">Share Product</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Copy the product link or share it directly to your social channels.
          </DialogDescription>
        </DialogHeader>

        {/* Social Buttons */}
        <div className="flex items-center gap-4 py-4 justify-center">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}${title ? `&text=${encodeURIComponent(`Check out ${title} on GoSolar Ng!`)}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-border bg-card hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 hover:text-[#1DA1F2] text-foreground flex items-center justify-center transition-all duration-300 shadow-2xs group cursor-pointer"
            aria-label="Share on X"
          >
            <FaTwitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>

          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}${title ? `&title=${encodeURIComponent(title)}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-border bg-card hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:text-[#0A66C2] text-foreground flex items-center justify-center transition-all duration-300 shadow-2xs group cursor-pointer"
            aria-label="Share on LinkedIn"
          >
            <FaLinkedinIn className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-border bg-card hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:text-[#1877F2] text-foreground flex items-center justify-center transition-all duration-300 shadow-2xs group cursor-pointer"
            aria-label="Share on Facebook"
          >
            <FaFacebookF className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>

          <a
            href="https://www.instagram.com/direct/inbox/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-border bg-card hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30 hover:text-[#E1306C] text-foreground flex items-center justify-center transition-all duration-300 shadow-2xs group cursor-pointer"
            aria-label="Share on Instagram"
          >
            <FaInstagram className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>
        </div>

        {/* Link Input + Copy Button */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              Link
            </label>
            <Input
              id="link"
              value={pageUrl}
              readOnly
              className="h-10 rounded-xl font-medium text-xs bg-muted/30 border-border/80 focus-visible:ring-primary select-all"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={copyPageUrl}
            className="px-3 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs cursor-pointer shadow-xs shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShare;

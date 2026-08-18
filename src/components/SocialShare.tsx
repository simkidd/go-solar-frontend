"use client";

import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { toast } from "sonner";
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaLink } from "react-icons/fa6";

const SocialShare = () => {
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const copyPageUrl = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.info("Link copied to clipboard!");
  };

  return (
    <div className="flex items-center gap-4 text-zinc-900 dark:text-zinc-200">
      <TwitterShareButton url={pageUrl}>
        <FaTwitter className="h-4.5 w-4.5 hover:text-[#08AA08] transition-colors cursor-pointer" />
      </TwitterShareButton>
      
      <LinkedinShareButton url={pageUrl}>
        <FaLinkedinIn className="h-4.5 w-4.5 hover:text-[#08AA08] transition-colors cursor-pointer" />
      </LinkedinShareButton>
      
      <FacebookShareButton url={pageUrl}>
        <FaFacebookF className="h-4.5 w-4.5 hover:text-[#08AA08] transition-colors cursor-pointer" />
      </FacebookShareButton>
      
      <button
        onClick={copyPageUrl}
        className="hover:text-[#08AA08] transition-colors cursor-pointer"
        aria-label="Copy link"
      >
        <FaLink className="h-4.5 w-4.5" />
      </button>
    </div>
  );
};

export default SocialShare;

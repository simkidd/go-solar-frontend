"use client";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { FaCopy } from "react-icons/fa6";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import { toast } from "react-toastify";

const SocialShare = () => {
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const copyPageUrl = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.info("Copied to clipboard");
  };

  return (
    <div className="flex items-center gap-2">
      <div>
        <TwitterShareButton url={pageUrl}>
          <XIcon size={40} round />
        </TwitterShareButton>
      </div>
      <div>
        <FacebookShareButton url={pageUrl}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
      </div>
      <div>
        <LinkedinShareButton url={pageUrl}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
      </div>
      <div>
        <WhatsappShareButton url={pageUrl}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
      </div>

      <button onClick={copyPageUrl}>
        <FaCopy size={30} />
      </button>
    </div>
  );
};

export default SocialShare;

"use client";

import React, { useEffect, useState } from "react";
import { useAnnouncementQuery } from "@/hooks/queries/useAnnouncementQuery";
import { useUpdateAnnouncementMutation } from "@/hooks/mutations/useAnnouncementMutations";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Megaphone, Save, Loader2 } from "lucide-react";

export default function AnnouncementForm() {
  const { data, isLoading } = useAnnouncementQuery();
  const updateMutation = useUpdateAnnouncementMutation();

  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (data?.announcement) {
      setText(data.announcement.text);
      setIsActive(data.announcement.isActive);
      setLink(data.announcement.link || "");
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ text, isActive, link });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 max-w-2xl font-inter">
      {/* Action Header */}
      <div className="flex flex-col gap-1 ">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Announcement Bar
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage the global announcement banner notice shown at the very top of
          the storefront.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-border/40">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50 ">
                Enable Announcement Bar
              </label>
              <p className="text-[10px] text-muted-foreground ">
                Toggle visibility on the homepage and storefront.
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 ">
              Announcement Message
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. ⚡ Free Shipping on Orders Over ₦2,500,000! Limited Time Offer."
              className="min-h-[100px] bg-muted/20 border-border/60 rounded-xl text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 ">
              Redirect URL (Optional Link)
            </label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. /shop or /products/hybrid-inverter"
              className="bg-muted/20 border-border/60 rounded-xl text-sm"
            />
            <p className="text-[9px] text-muted-foreground">
              Optional page url path to redirect users to when they click the
              announcement.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-xs tracking-wider uppercase font-black text-[10px] cursor-pointer"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

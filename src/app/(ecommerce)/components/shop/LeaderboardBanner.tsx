"use client";

import React, { useMemo } from "react";
import { useActiveBannersQuery } from "@/hooks/queries/useBannersQuery";
import Link from "next/link";

const LeaderboardBanner: React.FC = () => {
  const { data: serverBanners = [] } = useActiveBannersQuery();

  const leaderboardBanner = useMemo(() => {
    const pool = serverBanners.filter(
      (b: any) =>
        b.placement === "storefront_leaderboard" && b.isActive !== false,
    );
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [serverBanners]);

  if (!leaderboardBanner) return null;

  return (
    <div className="w-full relative rounded-2xl overflow-hidden aspect-[1264/180] border border-border/60 shadow-xs bg-zinc-950">
      {leaderboardBanner.ctaLink ? (
        <Link
          href={leaderboardBanner.ctaLink}
          className="absolute inset-0 w-full h-full block"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${leaderboardBanner.image}')` }}
          />
        </Link>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${leaderboardBanner.image}')` }}
        />
      )}
    </div>
  );
};

export default LeaderboardBanner;

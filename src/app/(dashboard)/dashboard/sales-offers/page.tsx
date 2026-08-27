import { Metadata } from "next";
import OffersComp from "../../components/OffersComp";
import BannersTable from "../../components/banners/BannersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Sparkles } from "lucide-react";

const pageTitle = "Marketing Campaigns";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const OffersPage = () => {
  return (
    <div className="w-full font-inter">
      <Tabs defaultValue="promotions" className="w-full space-y-6">
        <div className="border-b border-border/80 pb-3 flex justify-start">
          <TabsList className="bg-muted/50 p-1 rounded-xl h-11 border border-border/60">
            <TabsTrigger
              value="promotions"
              className="rounded-lg text-xs font-bold gap-2 px-5 h-9 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              <Tag className="h-4 w-4" />
              Promotions & Offers
            </TabsTrigger>
            <TabsTrigger
              value="banners"
              className="rounded-lg text-xs font-bold gap-2 px-5 h-9 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Storefront Banners
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="promotions" className="focus-visible:outline-hidden mt-0">
          <OffersComp />
        </TabsContent>

        <TabsContent value="banners" className="focus-visible:outline-hidden mt-0">
          <BannersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OffersPage;

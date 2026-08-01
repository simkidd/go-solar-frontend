"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-number-input";

const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const ContactForm = () => {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
            
            <div className="w-full col-span-1">
              <Input
                type="text"
                placeholder="Your Name"
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full col-span-1">
              <Input
                type="email"
                placeholder="Email Address"
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full col-span-1">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                placeholder="Phone Number"
                value={""}
                onChange={() => {}}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-11 px-3 text-xs focus-within:ring-2 focus-within:ring-emerald-500 [&>input]:bg-transparent [&>input]:px-2 [&>input]:outline-0 [&>input]:h-full [&>input]:text-zinc-800 dark:[&>input]:text-white [&>input]:text-xs font-semibold"
              />
            </div>

            <div className="w-full col-span-1">
              <Input
                type="text"
                placeholder="Subject"
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full lg:col-span-2 col-span-1">
              <Textarea
                placeholder="Message"
                className="w-full min-h-32 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="lg:col-span-2 pt-4">
              <Button type="submit" className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-xl">
                Send Message
              </Button>
            </div>

          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;

"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    toast.success("Thank you! Your message has been sent to our engineers.");
    reset();
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
            <div className="w-full col-span-1">
              <Input
                placeholder="Your Name"
                {...register("name", { required: true })}
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full col-span-1">
              <Input
                type="email"
                placeholder="Email Address"
                {...register("email", { required: true })}
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full col-span-1">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="NG"
                    placeholder="Phone Number"
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-11 px-3 text-xs focus-within:ring-2 focus-within:ring-emerald-500 [&>input]:bg-transparent [&>input]:px-2 [&>input]:outline-0 [&>input]:h-full [&>input]:text-zinc-800 dark:[&>input]:text-white [&>input]:text-xs font-semibold"
                  />
                )}
              />
            </div>

            <div className="w-full col-span-1">
              <Input
                placeholder="Subject"
                {...register("subject", { required: true })}
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full lg:col-span-2 col-span-1">
              <Textarea
                placeholder="Message"
                rows={5}
                {...register("message", { required: true })}
                className="w-full min-h-32 border-zinc-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <div className="w-full lg:col-span-2 col-span-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200"
              >
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

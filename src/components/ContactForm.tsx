"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  service: string;
  message: string;
}

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

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
      service: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    toast.success("Thank you! Your message has been sent to our engineers.");
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="border border-zinc-150 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-6 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="w-16 h-16 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center text-3xl mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white">
            Message Sent!
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
            Thank you for contacting GoSolar. One of our team members will get
            back to you within one business day.
          </p>
          <p className="text-zinc-505 dark:text-zinc-500 text-xs leading-relaxed max-w-sm mx-auto">
            For urgent enquiries, call us directly on{" "}
            <a
              href="tel:+2347062762879"
              className="text-[#08AA08] font-bold hover:underline"
            >
              +234 706 276 2879
            </a>
            .
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold uppercase tracking-wider text-zinc-450 hover:text-zinc-650 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-inter">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">
            Full Name *
          </label>
          <Input
            placeholder="Tunde Adewale"
            {...register("name", { required: true })}
            className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">
            Phone Number *
          </label>
          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field }) => (
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                placeholder="+234 803 123 4567"
                value={field.value}
                onChange={field.onChange}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-11 px-3 text-xs focus-within:ring-2 focus-within:ring-emerald-500 [&>input]:bg-transparent [&>input]:px-2 [&>input]:outline-0 [&>input]:h-full [&>input]:text-zinc-800 dark:[&>input]:text-white [&>input]:text-xs font-semibold w-full"
              />
            )}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">
            Email Address *
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            {...register("email", { required: true })}
            className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">
            Subject *
          </label>
          <Input
            placeholder="Solar system quote"
            {...register("subject", { required: true })}
            className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">
            Service of Interest
          </label>
          <select
            {...register("service")}
            className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 text-xs bg-white dark:bg-zinc-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08AA08] h-11 text-zinc-800 dark:text-zinc-200 font-semibold"
          >
            <option value="">Select a service...</option>
            <option value="Residential Solar">Residential Solar</option>
            <option value="Commercial Solar">Commercial Solar</option>
            <option value="Hybrid Systems">Hybrid Systems</option>
            <option value="Battery Storage">Battery Storage</option>
            <option value="Solar Maintenance">Solar Maintenance</option>
            <option value="Product Enquiry">Product Enquiry</option>
            <option value="General Enquiry">General Enquiry</option>
          </select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">
            Message *
          </label>
          <Textarea
            placeholder="Tell us about your project, property, or any specific questions..."
            rows={5}
            {...register("message", { required: true })}
            className="w-full min-h-32 border-zinc-200 dark:border-zinc-800 rounded-xl resize-none"
          />
        </div>

        <div className="sm:col-span-2 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200"
          >
            {isSubmitting ? "Sending Message..." : "Send Message →"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;

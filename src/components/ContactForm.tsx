"use client"
import { Input, Textarea } from "@heroui/react";
import React from "react";

const ContactForm = () => {
  return (
    <form>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div className="w-full col-span-1">
          <Input
            type="text"
            variant="underlined"
            label="Email"
            size="lg"
            className="w-full"
          />
        </div>
        <div className="w-full col-span-1">
          <Input
            type="text"
            variant="underlined"
            label="Subject"
            size="lg"
            className="w-full"
          />
        </div>
        <div className="w-full col-span-1">
          <Input
            type="text"
            variant="underlined"
            label="Phone"
            size="lg"
            className="w-full"
          />
        </div>
        <div className="w-full col-span-1">
          <Input
            type="email"
            variant="underlined"
            label="Email"
            size="lg"
            className="w-full"
          />
        </div>
        <div className="w-full lg:col-span-2 col-span-1">
          <Textarea
            variant="underlined"
            label="Message"
            labelPlacement="outside"
            className="w-full"
            size="lg"
          />
        </div>
        <div className="mt-8">
          <button className="bg-primary text-white py-4 px-8">Send</button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;

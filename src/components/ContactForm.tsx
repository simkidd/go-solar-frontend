"use client";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import { MailIcon } from "lucide-react";
import React from "react";
import PhoneInput from "react-phone-number-input";

const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const ContactForm = () => {
  return (
    <Card>
      <CardBody className="py-8 px-6">
        <form onSubmit={onSubmit}>
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
            <div className="w-full col-span-1">
              <Input
                type="text"
                placeholder="Email"
                size="lg"
                labelPlacement="outside"
                className="w-full"
              />
            </div>
            <div className="w-full col-span-1">
              <Input
                type="text"
                placeholder="Subject"
                size="lg"
                className="w-full"
              />
            </div>
            <div className="w-full col-span-1">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                placeholder="Phone"
                value={""}
                onChange={() => {}}
                // error={
                //   input?.phonenumber
                //     ? isValidPhoneNumber(input?.phonenumber)
                //       ? undefined
                //       : "Invalid phone number"
                //     : "Phone number required"
                // }
                className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-[12px] h-[48px] px-3 text-sm focus:outline-none [&>input]:bg-transparent [&>input]:px-1 [&>input]:outline-0 [&>input]:h-full [&>input]:text-black dark:[&>input]:text-white"
              />
            </div>
            <div className="w-full col-span-1">
              <Input
                type="email"
                placeholder="Name"
                size="lg"
                className="w-full"
              />
            </div>
            <div className="w-full lg:col-span-2 col-span-1">
              <Textarea
                placeholder="Message"
                labelPlacement="outside"
                className="w-full"
                size="lg"
              />
            </div>
            <div className="mt-8">
              <Button color="primary" size="lg" className="px-10">
                Send
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ContactForm;

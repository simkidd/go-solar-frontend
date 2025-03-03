import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

const pageTitle = "Contact Us";

export const metadata: Metadata = {
  title: pageTitle,
};

const ContactUsPage = () => {
  return (
    <div className="w-full font-inter">
      <PageHeader name="Contact Us" heading="Contact Us" />
      <section className="w-full py-20">
        <div className="container mx-auto px-2">
          <div className="max-w-[1100px] mx-auto lg:px-2">
            <h3 className="text-4xl font-bold text-center mb-10">
              <span className="text-primary">.</span> Get in{" "}
              <span className="text-primary">Touch</span>
            </h3>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
              <div className="lg:px-4">
                <div className="col-span-1 bg-primary text-white rounded-xl w-full h-full p-10">
                  <h3 className="capitalize font-bold text-2xl">
                    Opening hours
                  </h3>
                  <p className="flex items-start">
                    Mondays - Fridays
                    <br /> 9:00AM - 5:00PM
                  </p>
                  <ul className="space-y-5 mt-8">
                    <li className="flex">
                      <Phone size={24} className=" mr-2 shrink-0" />
                      <a href="tel:+2347062762879" className="hover:underline">
                        0706 276 2879
                      </a>
                    </li>
                    <li className="flex ">
                      <Mail size={24} className=" mr-2 shrink-0" />
                      <a
                        href="mailto:gosolardotng@gmail.com"
                        className="hover:underline"
                      >
                        gosolardotng@gmail.com
                      </a>
                    </li>
                    <li className="flex ">
                      <MapPin size={24} className=" mr-2 shrink-0" />
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=gosolar+4+Eneka,+Igwuruta+Road,+Airport+road,+Port+Harcourt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        4 Eneka, Igwuruta Road, Airport road, Port Harcourt
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-2 lg:px-4">
                <ContactForm />
              </div>
            </div>

            <div className="py-20 pt-32 w-full">
              <div className="lg:px-4 mt-8 lg:mt-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15901.341669146188!2d7.0498806!3d4.883378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069d31b3b00a359%3A0x77fdb8b93997f0ec!2sGosolar.ng!5e0!3m2!1sen!2sng!4v1711888641200!5m2!1sen!2sng"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;

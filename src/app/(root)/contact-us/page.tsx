import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

const pageTitle = "Contact GoSolar Today | Renewable Energy Solutions Provider";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ContactUsPage = () => {
  return (
    <div className="w-full font-inter">
      <PageHeader name="Contact Us" />
      <section className="w-full py-20">
        <div className="container mx-auto px-2">
          <div className="max-w-[1100px] mx-auto lg:px-2">
            <div className="grid lg:grid-cols-3 grid-cols-1">
              <div className="lg:px-4">
                <div className="col-span-1 bg-primary w-full lg:h-96 h-full"></div>
              </div>
              <div className="lg:col-span-2 lg:px-4">
                <h3 className="text-4xl font-bold text-center mb-10">
                  <span className="text-primary">.</span> Get in{" "}
                  <span className="text-primary">Touch</span>
                </h3>
                <ContactForm />
              </div>
            </div>

            <div className="py-20 pt-32 grid lg:grid-cols-2 grid-cols-1">
              <div className="w-full lg:px-4">
                <div className="">
                  <h3 className="text-4xl font-bold mb-10 text-primary">
                    Get in Touch
                  </h3>
                  <div>
                    <ul className="space-y-2">
                      <li className="flex ">
                        <MapPin size={16} className="text-primary mr-2" />
                        Opp. Rosco Filling Station, <br />
                        Eneka/Igwuruta Road, <br />
                        Port Harcourt.
                      </li>
                      <li className="flex ">
                        <Phone size={16} className="text-primary mr-2" />
                        0706 276 2879
                      </li>
                      <li className="flex ">
                        <Mail size={16} className="text-primary mr-2" />
                        gosolardotng@gmail.com
                      </li>
                      <li className="flex items-start">
                        <CalendarDays size={16} className="text-primary mr-2" />
                        Mon - Friday
                        <br /> 9:00AM - 5:00PM
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

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

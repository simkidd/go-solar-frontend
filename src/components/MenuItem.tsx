import { Menu } from "@/data/menuData";
import Link from "next/link";
import React from "react";

const MenuItem: React.FC<{
  item: Menu;
  isActive: (value: string) => boolean;
}> = ({ item, isActive }) => {
  const { href, label, children } = item;
  return (
    <>
      <li className="h-full ">
        <div className="w-full h-full">
          <Link
            href={href}
            className={`h-full flex justify-center items-center border-b-2 border-b-transparent hover:text-primary transition-all duration-300 ease-in-out font-medium ${
              isActive(href) ? " text-primary" : ""
            }`}
          >
            {label}
          </Link>
        </div>
        {children && (
          <div className="dropdown light bg-white dark:bg-[#2a2b2f] shadow-md">
            {children.map(({ heading, submenu }, i) => (
              <div key={i}>
                <section className="w-full grid grid-cols-3">
                  <h4>{heading}</h4>
                  <ul className="py-2">
                    {submenu.map(({ href, label }, i) => (
                      <li key={i}>
                        <Link
                          className="block px-4 py-2 hover:bg-primary"
                          href={href}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ))}
          </div>
        )}
      </li>
    </>
  );
};

export default MenuItem;

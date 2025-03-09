import React from "react";
import Container from "./Container";
import { footerData } from "@/constants";

const Footer = () => {
  return (
    <div className="bg-white border-t border-black">
      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {footerData.map((section) => (
            <div key={section._id} className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.listItem[0].listData.map((item) => (
                  <li
                    key={item}
                    className="text-base capitalize hover:text-indigo-700 transition-colors duration-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Additional Non-linked Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {["Contact", "Shipping", "Returns"].map((item) => (
                <li
                  key={item}
                  className="text-base capitalize hover:text-indigo-700 transition-colors duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <li
                  key={item}
                  className="text-base capitalize hover:text-indigo-700 transition-colors duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-black text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Shopping. All rights reserved.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Footer;

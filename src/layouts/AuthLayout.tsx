import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Unlock } from "lucide-react";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen light bg-[#f1f1f1] dark:bg-[#2a2b2f] relative flex items-center justify-center flex-col font-inter">
      {/* <h3>GoSolar.ng</h3> */}
      <ThemeSwitcher />
      <div className="auth-content p-4 mx-auto">
        <div className="w-full light bg-white dark:bg-[#222327] shadow-lg">
          <div className="flex flex-col items-center py-8 px-6">
            <div className="mb-4 text-primary">
              <Unlock size={30} />
            </div>
            <div className="w-full ">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

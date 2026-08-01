import { CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

const pageTitle = "Registration Successful";

export const metadata: Metadata = {
  title: pageTitle,
};

const RegistrationSuccess = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-6 py-6">
      <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-4 border border-emerald-100 dark:border-emerald-900/50">
        <CheckCircle2 size={56} className="stroke-[1.5]" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Done!</h2>
        <p className="text-sm font-semibold text-[#08AA08]">Sign Up Successful</p>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
        An activation link has been sent to your registered email address. Please click the link to verify your account and complete login.
      </p>
    </div>
  );
};

export default RegistrationSuccess;

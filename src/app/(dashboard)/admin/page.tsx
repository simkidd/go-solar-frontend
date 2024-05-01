"use client";
import { useAuth } from "@/contexts/auth.context";
import { Chip } from "@nextui-org/react";
import { SquareGanttChart } from "lucide-react";
import Link from "next/link";

const OveriewPage = () => {
  const { currentUser } = useAuth();

  const getGreetingTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return "Good morning!";
    } else if (currentHour < 17) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  };

  return (
    <div className="w-full py-4">
      <div className="mb-4">
        <h3 className="text-2xl font-medium mb-1">Overview</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
        <div className="col-span-1 lg:col-span-3 w-full bg-white dark:bg-[#222327] shadow flex flex-col py-4">
          <div className="px-4 mb-4">
              <p>Welcome Back!</p>
              <p>{getGreetingTime()}</p>
          </div>
          <div className="flex gap-2 px-4">
            <div className="w-full">
              <p className="mb-2 font-medium">{currentUser?.firstname + " " + currentUser?.lastname}</p>
              <div>
                {currentUser?.isAdmin && (
                  <Chip color="primary" size="sm">
                    Admin
                  </Chip>
                )}
                {currentUser?.isSuperAdmin && (
                  <Chip color="default" size="sm">
                    Super
                  </Chip>
                )}
              </div>
            </div>
            <div className="w-full">
              <Link href="">
                <button className="">View Profile</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 w-full bg-white dark:bg-[#222327] shadow px-4 py-4 flex items-center">
          <div className="flex flex-col gap-2">
            <p>Orders</p>
            <p>1235</p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary bg-opacity-10 ms-auto">
            <SquareGanttChart size={32} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 w-full bg-white dark:bg-[#222327] shadow px-4 py-4 flex items-center">
          <div className="flex flex-col gap-2">
            <p>Orders</p>
            <p>1235</p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary bg-opacity-10 ms-auto">
            <SquareGanttChart size={32} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 w-full bg-white dark:bg-[#222327] shadow px-4 py-4 flex items-center">
          <div className="flex flex-col gap-2">
            <p>Orders</p>
            <p>1235</p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary bg-opacity-10 ms-auto">
            <SquareGanttChart size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OveriewPage;

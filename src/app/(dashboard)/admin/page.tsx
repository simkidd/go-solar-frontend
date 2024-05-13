"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useOrderStore } from "@/lib/stores/order.store";
import { useProductStore } from "@/lib/stores/product.store";
import { useUserStore } from "@/lib/stores/user.store";
import { Chip } from "@nextui-org/react";
import { SquareGanttChart } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@nextui-org/skeleton";

const OveriewPage = () => {
  const { user } = useAuthStore();
  const { users } = useUserStore();
  const { products } = useProductStore();
  const { orders } = useOrderStore();

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
              {!user ? (
                <>
                  <Skeleton className="w-4/5 rounded-lg mb-2">
                    <div className="h-4 w-4/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-4 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                </>
              ) : (
                <>
                  <p className="mb-2 font-medium">
                    {user?.firstname + " " + user?.lastname}
                  </p>
                  <div>
                    {user?.isAdmin && (
                      <Chip color="primary" size="sm">
                        Admin
                      </Chip>
                    )}
                    {user?.isSuperAdmin && (
                      <Chip color="default" size="sm">
                        Super
                      </Chip>
                    )}
                  </div>
                </>
              )}
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
            <p>Products</p>
            <p>{products.length}</p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary bg-opacity-10 ms-auto">
            <SquareGanttChart size={32} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 w-full bg-white dark:bg-[#222327] shadow px-4 py-4 flex items-center">
          <div className="flex flex-col gap-2">
            <p>Customers</p>
            <p>{users.length}</p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary bg-opacity-10 ms-auto">
            <SquareGanttChart size={32} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 w-full bg-white dark:bg-[#222327] shadow px-4 py-4 flex items-center">
          <div className="flex flex-col gap-2">
            <p>Orders</p>
            <p>{orders.length}</p>
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

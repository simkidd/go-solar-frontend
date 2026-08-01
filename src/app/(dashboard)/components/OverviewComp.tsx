"use client";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useOrderStore } from "@/lib/stores/order.store";
import { useProductStore } from "@/lib/stores/product.store";
import { useUserStore } from "@/lib/stores/user.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatCurrency } from "@/utils/helpers";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  revenuePerMonth: {
    [key: string]: number;
  };
  ordersPerMonth: {
    [key: string]: number;
  };
}

const OverviewComp = () => {
  const { user } = useAuthStore();
  const { users } = useUserStore();
  const { products } = useProductStore();
  const { orders } = useOrderStore();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/admin/dashboard-stats");
        setDashboardData(res.data.dashboardStats);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getChartData = () => {
    const { revenuePerMonth, ordersPerMonth } = dashboardData || {};
    if (!revenuePerMonth || !ordersPerMonth)
      return { labels: [], datasets: [] };

    let labels: string[] = [];
    let revenueData: number[] = [];
    let ordersData: number[] = [];

    if (selectedPeriod === "month") {
      labels = Object.keys(revenuePerMonth);
      revenueData = Object.values(revenuePerMonth);
      ordersData = Object.values(ordersPerMonth);
    } else if (selectedPeriod === "year") {
      labels = Object.keys(revenuePerMonth);
      revenueData = labels.map((month) => revenuePerMonth[month]);
      ordersData = labels.map((month) => ordersPerMonth[month]);
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Revenue (₦)",
          data: revenueData,
          backgroundColor: "rgba(8, 170, 8, 0.1)",
          borderColor: "#08AA08",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
        {
          label: "Orders",
          data: ordersData,
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          borderColor: "#f97316",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const chartData = getChartData();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
    },
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#222327] p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {user ? `${user.firstname} ${user.lastname}` : "Admin"} 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here is what's happening on your GoSolar store dashboard today.
          </p>
        </div>
        <div className="flex gap-2">
          {user?.isSuperAdmin && (
            <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 rounded-full px-3 py-1 text-xs font-semibold">
              Super Admin
            </span>
          )}
          {user?.isAdmin && !user.isSuperAdmin && (
            <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-semibold">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-[#222327] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Products
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {products.length}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#222327] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Registered Customers
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {users.length}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Customer base count
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#222327] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Orders
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {orders.length}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Completed and pending orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
        <Card className="col-span-1 lg:col-span-6 bg-white dark:bg-[#222327] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">
                Revenue & Sales Trends
              </CardTitle>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-500">Revenue:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <span className="text-base font-bold text-primary flex items-center">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(dashboardData?.totalRevenue || 0, "NGN").replace("NGN", "")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-500">Orders:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-12" />
                  ) : (
                    <span className="text-base font-bold text-zinc-950 dark:text-white">
                      {dashboardData?.totalOrders || 0}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {selectedPeriod === "month" ? "This Month" : "This Year"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => handlePeriodChange("month")}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePeriodChange("year")}>
                  This Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="w-full h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 bg-white dark:bg-[#222327] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-zinc-100 dark:border-zinc-800 w-full max-w-sm dark:bg-zinc-900/20"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewComp;

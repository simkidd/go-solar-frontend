"use client";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useOrderStore } from "@/lib/stores/order.store";
import { useProductStore } from "@/lib/stores/product.store";
import { useUserStore } from "@/lib/stores/user.store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
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
import { formatCurrency, formatDate } from "@/utils/helpers";
import Link from "next/link";
import useOrders from "@/hooks/useOrders";

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

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50";
    case "Delivered":
      return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50";
    case "Received":
      return "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/50";
    default:
      return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
  }
};

const OverviewComp = () => {
  const { user } = useAuthStore();
  const { users } = useUserStore();
  const { products } = useProductStore();
  const { orders } = useOrders();
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
          backgroundColor: "rgba(8, 170, 8, 0.05)",
          borderColor: "#08AA08",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#08AA08",
        },
        {
          label: "Orders",
          data: ordersData,
          backgroundColor: "rgba(249, 115, 22, 0.05)",
          borderColor: "#f97316",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#f97316",
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
          font: {
            family: "Inter",
            size: 11,
          },
        },
      },
      tooltip: {
        padding: 12,
        borderRadius: 8,
        titleFont: { family: "Inter", size: 12, weight: "bold" as const },
        bodyFont: { family: "Inter", size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.06)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          font: { family: "Inter", size: 11 },
        },
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.06)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          font: { family: "Inter", size: 11 },
        },
      },
    },
  };

  // Get most recent 5 orders
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [orders]);

  // Identify low stock items (less than 5 units)
  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantityInStock <= 5 && !p.isDeleted).length;
  }, [products]);

  return (
    <div className="space-y-6 pb-8 font-inter">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1a1b1e] p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-6 -mt-6"></div>
        <div className="relative z-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {user ? `${user.firstname} ${user.lastname}` : "Admin"} 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
            Here's what is happening at the GoSolar store today.
          </p>
        </div>
        <div className="flex gap-2 relative z-10">
          {user?.isSuperAdmin && (
            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 font-bold px-3 py-1 text-xs">
              Super Admin
            </Badge>
          )}
          {user?.isAdmin && !user.isSuperAdmin && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 text-xs">
              Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Products
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {products.length}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-[10px] py-0.5">
                {products.filter(p => p.isPublished).length} Published
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Registered Customers
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {users.length}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-zinc-500 font-medium">Customer database</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Orders
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {orders.length}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-[10px] py-0.5">
                {orders.filter(o => o.trackingStatus === "Processing").length} Processing
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Left Side (Charts, Lists) & Right Side (Calendar, Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Revenue & Sales Trends
                </CardTitle>
                <div className="mt-3 flex items-center gap-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Revenue</p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-24 mt-1" />
                    ) : (
                      <p className="text-lg font-black text-primary mt-0.5 flex items-center">
                        <DollarSign className="h-4.5 w-4.5 -ml-1 text-primary" />
                        {formatCurrency(dashboardData?.totalRevenue || 0, "NGN").replace("NGN", "")}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Completed Orders</p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-12 mt-1" />
                    ) : (
                      <p className="text-lg font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {dashboardData?.totalOrders || 0}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg">
                    {selectedPeriod === "month" ? "This Month" : "This Year"}
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
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

          {/* Recent Orders Table */}
          <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Manage and overview your store's latest sales.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/90 text-xs font-bold gap-1 rounded-lg">
                <Link href="/dashboard/orders">
                  View All Orders
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400">
                  No orders placed yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full text-sm">
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/10">
                      <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
                        <TableHead className="font-semibold text-zinc-500 h-10 px-4">Order ID</TableHead>
                        <TableHead className="font-semibold text-zinc-500 h-10">Customer</TableHead>
                        <TableHead className="font-semibold text-zinc-500 h-10">Date</TableHead>
                        <TableHead className="font-semibold text-zinc-500 h-10 text-right">Amount</TableHead>
                        <TableHead className="font-semibold text-zinc-500 h-10 text-center">Status</TableHead>
                        <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
                          <TableCell className="font-mono text-xs text-zinc-500 py-3.5 px-4">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </TableCell>
                          <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                            {order.user ? `${order.user.firstname} ${order.user.lastname}` : "Guest Customer"}
                          </TableCell>
                          <TableCell className="text-zinc-500 text-xs">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(order.totalPricePaid, "NGN")}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={`font-semibold text-[10px] px-2.5 py-0.5 rounded-full select-none ${getStatusBadgeClass(order.trackingStatus)}`}>
                              {order.trackingStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-4">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                              <Link href={`/dashboard/orders?id=${order._id}`}>
                                <ExternalLink className="h-4 w-4 text-zinc-400 hover:text-primary transition-colors" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Calendar Card */}
          <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-zinc-100 dark:border-zinc-800 w-full max-w-sm dark:bg-zinc-900/20 shadow-none"
              />
            </CardContent>
          </Card>

          {/* Quick Notifications / Low Stock Warnings */}
          <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl h-fit">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">
                Store Alerts
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Critical updates and inventory alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Stock Warning */}
              {lowStockCount > 0 ? (
                <div className="flex gap-3 items-start p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl text-red-800 dark:text-red-300">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold">Inventory Shortage</p>
                    <p className="text-[11px] text-red-600/90 dark:text-red-300/80 mt-1 font-medium">
                      There are {lowStockCount} items with less than 5 units left in stock. Reorder stock soon.
                    </p>
                    <Button asChild size="sm" variant="link" className="text-red-700 dark:text-red-400 font-bold p-0 h-auto text-[11px] mt-1 hover:underline">
                      <Link href="/dashboard/products">Resolve stock</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-center p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-emerald-800 dark:text-emerald-300">
                  <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-semibold">All products in healthy stock!</p>
                </div>
              )}

              {/* Quick Summary Info */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg">
                  <span className="text-zinc-500">Total Orders:</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg">
                  <span className="text-zinc-500">Solar Bundles:</span>
                  <Link href="/dashboard/packages" className="text-primary hover:underline font-bold">
                    6 Active Packages
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg">
                  <span className="text-zinc-500">Sizing & Quote Leads:</span>
                  <Link href="/dashboard/quotes" className="text-amber-600 hover:underline font-bold">
                    4 Active Leads
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg">
                  <span className="text-zinc-500">Total Users:</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{users.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg">
                  <span className="text-zinc-500">Pending Orders:</span>
                  <span className="text-amber-600 font-bold">
                    {orders.filter((o) => o.trackingStatus === "Processing").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewComp;

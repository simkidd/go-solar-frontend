"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { Order, TrackingStatus } from "@/interfaces/order.interface";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button, Spinner } from "@nextui-org/react";
import { Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
} from "react-data-table-component";
import { HiDocument } from "react-icons/hi2";
import { customStyles } from "./UI/tableStyle";

createTheme(
  "light",
  {
    text: {
      primary: "inherit",
      // secondary: '',
    },
    background: {
      default: "transparent",
    },
    // context: {
    // 	background: '#cb4b16',
    // 	text: '#FFFFFF',
    // },
    // divider: {
    // 	default: '#073642',
    // },
    // button: {
    // 	default: '#2aa198',
    // 	hover: 'rgba(0,0,0,.08)',
    // 	focus: 'rgba(255,255,255,.12)',
    // 	disabled: 'rgba(255, 255, 255, .34)',
    // },
    // sortFocus: {
    // 	default: '#2aa198',
    // },
  }
  // "dark"
);

const columns: TableColumn<Order>[] = [
  {
    name: "Order ID",
    cell: (row) => (
      <div>
        <Link href={`/admin/orders/${row?._id}`}>
          {row?.trackingId?.tracking_id}
        </Link>
      </div>
    ),
    width: "100px",
  },
  {
    name: "Billing Name",
    cell: (row) => (
      <div>{row?.user?.firstname + " " + row?.user?.lastname}</div>
    ),
    minWidth: "300px",
  },
  {
    name: "Date",
    cell: (row) => <div>{formatDate(row?.createdAt)}</div>,
  },
  {
    name: "Total",
    cell: (row) => <div>{formatCurrency(row?.totalPricePaid, "NGN")}</div>,
    minWidth: "150px",
  },
  {
    name: "Tracking Status",
    cell: ({ trackingStatus }) => (
      <span
        className={`px-4 py-1 rounded-full bg-opacity-10 ${trackingStatusChip(
          trackingStatus
        )}`}
      >
        {trackingStatus}
      </span>
    ),
    width: "150px",
  },
];

const OrdersListTable = () => {
  const { orders, loading } = useOrderStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [trackingFilter, setTrackingFilter] = useState(
    searchParams.get("status") || ""
  );

  const filteredOrders = useMemo(() => {
    let selectedOrders = [...orders];

    if (searchTerm) {
      selectedOrders = selectedOrders.filter(
        (order) =>
          order?.user?.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order?.user?.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order?.trackingId?.tracking_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (trackingFilter) {
      selectedOrders = selectedOrders.filter(
        (order) => order?.trackingStatus === trackingFilter
      );
    }

    return selectedOrders;
  }, [orders, searchTerm, trackingFilter]);

  const handleSearch = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
        setSearchTerm(value);
      } else {
        params.delete("q");
        setSearchTerm("");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  const handleTrackingFilter = useCallback((status: TrackingStatus | "") => {
    const params = new URLSearchParams(searchParams);

    if (status === "") {
      setTrackingFilter("");
      params.delete("status");
    } else {
      setTrackingFilter(status);
      params.set("status", status);
    }

    replace(`${pathname}?${params.toString()}`);
  }, []);

  const isActive = (status: TrackingStatus | "") => {
    return trackingFilter === status ? "border-b-primary" : "";
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-col-reverse md:flex-row px-4 py-2 gap-1">
        <div className="ms-auto">
          <Button
            size="sm"
            variant="solid"
            color="primary"
            type="submit"
            className="rounded-md"
            startContent={<HiDocument size={16} />}
          >
            Export CSV
          </Button>
        </div>
      </div>
      <div className="flex items-center py-4 px-4 flex-wrap justify-start gap-4">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent border focus:outline-none px-2 py-1 w-full max-w-md text-sm rounded-md shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("q")?.toString()}
        />

        <select
          className="bg-transparent border focus:outline-none px-2 py-1 text-sm rounded-md shadow-sm w-full lg:max-w-max"
          value={trackingFilter}
          onChange={(e) =>
            handleTrackingFilter(e.target.value as TrackingStatus)
          }
        >
          <option value="" className="bg-white dark:bg-[#222327]">
            All Orders
          </option>
          <option
            value={TrackingStatus.Processing}
            className="bg-white dark:bg-[#222327]"
          >
            Processing
          </option>
          <option
            value={TrackingStatus.Delivered}
            className="bg-white dark:bg-[#222327]"
          >
            Delivered
          </option>
          <option
            value={TrackingStatus.Received}
            className="bg-white dark:bg-[#222327]"
          >
            Received
          </option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={filteredOrders}
        progressPending={loading}
        progressComponent={
          <div className="py-8">
            <Spinner />
          </div>
        }
        pagination
        selectableRows
        // actions={<button className="">Export PDF</button>}
        // fixedHeader
        selectableRowsHighlight
        highlightOnHover
        // subHeader
        customStyles={customStyles}
        theme="light"
      />
    </div>
  );
};

export default OrdersListTable;

export const trackingStatusChip = (status: TrackingStatus) => {
  switch (status) {
    case TrackingStatus.Processing:
      return "text-yellow-500 bg-yellow-500";
    case TrackingStatus.Delivered:
      return "text-blue-500 bg-blue-500";
    case TrackingStatus.Received:
      return "text-green-500 bg-green-500";
    default:
      return "";
  }
};

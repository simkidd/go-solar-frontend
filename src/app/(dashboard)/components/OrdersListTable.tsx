"use client";
import { useOrderStore } from "@/lib/stores/order.store";
import { Spinner } from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
} from "react-data-table-component";
import { Order } from "@/interfaces/order.interface";
import { axiosInstance } from "@/lib/axios";
import { customStyles } from "./UI/tableStyle";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

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
    cell: (row) => <div>{row?.trackingStatus}</div>,
    width: "150px",
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="w-full flex items-center justify-center">
        <button>
          <Trash size={16} />
        </button>
      </div>
    ),
    width: "80px",
  },
];

const OrdersListTable = () => {
  const { orders, setOrders } = useOrderStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/users/orders/user-orders");

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    return selectedOrders;
  }, [orders, searchTerm]);

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

  return (
    <div>
      <div className="flex items-center py-4 px-4">
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

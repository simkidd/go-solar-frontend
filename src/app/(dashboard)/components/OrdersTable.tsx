"use client";
import { Order, TrackingStatus } from "@/interfaces/order.interface";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/helpers";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  EllipsisVertical,
  Eye,
  SearchIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

const columns = [
  { name: "Order ID", uid: "orderId", minWidth: "200px" },
  {
    name: "Billing Name",
    uid: "billingName",
    minWidth: "200px",
    sortable: true,
  },
  { name: "Date", uid: "dateOrdered", minWidth: "300px" },
  { name: "Total", uid: "total", minWidth: "150px" },
  {
    name: "Tracking Status",
    uid: "trackingStatus",
    minWidth: "150px",
    sortable: true,
  },
  {
    name: "Actions",
    uid: "actions",
  },
];

export const getChipColor = (status: TrackingStatus) => {
  switch (status) {
    case TrackingStatus.Processing:
      return "warning";
    case TrackingStatus.Delivered:
      return "success";
    case TrackingStatus.Received:
      return "primary";
    default:
      return "default";
  }
};

const OrdersTable = () => {
  const { orders, loading } = useOrderStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((col) => col.uid))
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All"
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order?.user?.firstname
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order?.user?.lastname
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order?.trackingId?.tracking_id
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filteredOrders = filteredOrders.filter(
        (order) => order?.trackingStatus === statusFilter
      );
    }

    return filteredOrders;
  }, [orders, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    return sorted;
  }, [sortDescriptor, items]);

  const renderCell = useCallback((order: Order, columnKey: React.Key) => {
    switch (columnKey) {
      case "orderId":
        return order?.trackingId?.tracking_id;
      case "billingName":
        return (
          <div>{order?.user?.firstname + " " + order?.user?.lastname}</div>
        );
      case "dateOrdered":
        return formatDate(order?.createdAt);
      case "total":
        return <div>{formatCurrency(order?.totalPricePaid, "NGN")}</div>;
      case "trackingStatus":
        return (
          <Chip
            color={getChipColor(order?.trackingStatus)}
            size="sm"
            variant="flat"
          >
            {order?.trackingStatus}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <EllipsisVertical className="text-default-300" size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  startContent={<Eye size={16} />}
                  onPress={() => router.push(`/admin/orders/${order?._id}`)}
                >
                  View
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
        setFilterValue(value);
        setPage(1);
      } else {
        params.delete("q");
        setFilterValue("");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onStatusFilterChange = useCallback(
    (keys: Selection) => {
      const selectedStatus = Array.from(keys).join(", ");
      const params = new URLSearchParams(searchParams);
      if (selectedStatus) {
        params.set("status", selectedStatus);
        setStatusFilter(selectedStatus);
      } else {
        params.delete("status");
        setPage(1);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const onResetFilters = useCallback(() => {
    setFilterValue("");
    setStatusFilter("All");
    setPage(1);
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  const topContent = useMemo(() => {
    const hasFilters = filterValue || statusFilter !== "All";

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            classNames={{
              input: ["bg-transparent"],
              innerWrapper: "bg-transparent ",
              inputWrapper: [
                "border-1",
                "bg-white",
                "dark:bg-[#222327]",
                "hover:bg-default-200/70",
                "focus-within:!bg-default-200/50",
                "dark:hover:bg-default/70",
                "dark:focus-within:!bg-default/60",
              ],
            }}
            variant="bordered"
            placeholder="Search..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

          <div className="flex gap-3">
            {hasFilters && (
              <Button variant="flat" color="danger" onPress={onResetFilters}>
                Reset
              </Button>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {statusFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Role Filter"
                onSelectionChange={onStatusFilterChange}
                selectionMode="single"
              >
                <DropdownItem key="All">All</DropdownItem>
                <DropdownItem key={TrackingStatus.Processing}>
                  Processing
                </DropdownItem>
                <DropdownItem key={TrackingStatus.Delivered}>
                  Delivered
                </DropdownItem>
                <DropdownItem key={TrackingStatus.Received}>
                  Recieved
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {orders.length} orders
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    orders.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          initialPage={1}
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            wrapper: "bg-red-500",
          }}
        />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div> */}
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["min-h-fit", "bg-white", "dark:bg-[#222327]"],
      th: ["dark:bg-transparent"],
      td: ["text-sm"],
    }),
    []
  );

  return (
    <div>
      <Table
        isCompact
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No orders found"}
          items={sortedItems}
          isLoading={loading}
          loadingContent={
            <Card className="dark:bg-[#222327]">
              <CardBody className="p-6">
                <Spinner size="lg" />
              </CardBody>
            </Card>
          }
        >
          {(item) => (
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;

import { Product } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { formatCurrency, formatDate } from "@/utils/helpers";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import { ChevronDownIcon, EllipsisVertical, Eye, RefreshCcw, SearchIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

const columns = [
  {
    name: "Product",
    uid: "name",
    minWidth: 400,
    sortable: true,
  },
  {
    name: "Price",
    uid: "price",
    minWidth: 150,
    sortable: true,
  },
  {
    name: "Discount",
    uid: "discount",
    minWidth: 150,
    sortable: true,
  },
  {
    name: "Quantity",
    uid: "quantity",
  },
  {
    name: "Offer",
    uid: "offer",
  },
  {
    name: "Brand",
    uid: "brand",
  },
  {
    name: "Status",
    uid: "status",
    sortable: true,
  },
  {
    name: "Date added",
    uid: "dateAdded",
    minWidth: 150,
    sortable: true,
  },
  {
    name: "Actions",
    uid: "actions",
    minWidth: 80,
  },
];

const CategoryProductsTable: React.FC<{ products: Product[] }> = ({
  products,
}) => {
  const { loading, fetchProducts } = useProductStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((col) => col.uid))
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [publishFilter, setPublishFilter] = useState(
    searchParams.get("published") || "All"
  );

  const router = useRouter();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product?.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (publishFilter !== "All") {
      filteredProducts = filteredProducts.filter((product) =>
        publishFilter === "published"
          ? product.isPublished
          : !product.isPublished
      );
    }

    return filteredProducts;
  }, [products, filterValue, publishFilter]);

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

  const renderCell = useCallback((product: Product, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="grid grid-cols-[55px_auto] gap-2 w-full py-2">
            <div className="w-10 h-10">
              <Image
                src={product?.images[0].url}
                alt={product?.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-wrap">{product?.name}</span>
          </div>
        );
      case "price":
        return <div>{formatCurrency(product?.price, "NGN")}</div>;
      case "discount":
        return (
          <div>
            {product?.currentOffer?.isActive &&
              product?.currentOffer?.percentageOff && (
                <Chip color="success" variant="flat" size="sm">
                  {product?.currentOffer?.percentageOff}% Off
                </Chip>
              )}
          </div>
        );
      case "quantity":
        return <div>{product?.quantityInStock}</div>;
      case "offer":
        return <div>{product?.currentOffer?.name}</div>;
      case "brand":
        return <div>{product?.brand}</div>;
      case "status":
        return (
          <Chip
            color={product.isPublished ? "success" : "default"}
            variant="flat"
            size="sm"
          >
            {product.isPublished ? "Published" : "Draft"}
          </Chip>
        );
      case "dateAdded":
        return <div>{formatDate(product?.createdAt)}</div>;
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
                  onPress={() => router.push(`/admin/products/${product?._id}`)}
                >
                  View details
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

  const onPublishFilterChange = useCallback(
    (keys: Selection) => {
      const selectedStatus = Array.from(keys).join(", ");
      const params = new URLSearchParams(searchParams);
      if (selectedStatus) {
        params.set("status", selectedStatus);
        setPublishFilter(selectedStatus);
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
    setPublishFilter("All");
    setPage(1);
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  const topContent = useMemo(() => {
    const hasFilters = filterValue || publishFilter !== "All";

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end lg:flex-row flex-col">
          <Input
            isClearable
            className="w-full lg:max-w-[44%]"
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
          <div className="flex items-center gap-3">
            {hasFilters && (
              <Button variant="flat" color="danger" onPress={onResetFilters}>
                Reset
              </Button>
            )}

            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {publishFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Published"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={publishFilter}
                onSelectionChange={onPublishFilterChange}
              >
                <DropdownItem key="All">All</DropdownItem>
                <DropdownItem key="published">Published</DropdownItem>
                <DropdownItem key="draft">Draft</DropdownItem>
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
            Total {products.length} products
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
              <option value="20">20</option>
              <option value="30">30</option>
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
    products.length,
    hasSearchFilter,
    publishFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center md:flex-row flex-col gap-4">
        <div className="flex gap-4 items-center">
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span>
        </div>

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
            wrapper: "bg-white dark:bg-[#222327]",
            item: "bg-transparent dark:text-white",
            prev: "bg-white dark:bg-[#222327]",
            next: "bg-white dark:bg-[#222327]",
            cursor: "",
          }}
        />
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
    <div className="w-full">
      <div className="w-full flex justify-end mb-4">
        <Button
          variant="solid"
          color="warning"
          onPress={fetchProducts}
          startContent={<RefreshCcw size={16} />}
          size="sm"
        >
          Refresh
        </Button>
      </div>

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
              minWidth={column.minWidth}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No products found"}
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

export default CategoryProductsTable;

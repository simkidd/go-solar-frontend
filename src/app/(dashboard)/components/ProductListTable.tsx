"use client";
import { Product } from "@/interfaces/product.interface";
import { formatCurrency, formatDate } from "@/utils/helpers";
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Edit, Search, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const ProductListTable: React.FC<{ products: Product[] }> = ({ products }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const onSearchChange = useDebouncedCallback((value?: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    if (value) {
      params.set("q", value);
      setSearch(value);
      setPage(1);
    } else {
      params.delete("q");
      if (page < 2) {
        params.delete("page");
      }
      setSearch("");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const filteredProducts = useMemo(() => {
    let selectedProducts = [...products];

    if (search) {
      selectedProducts = selectedProducts.filter(
        (product) =>
          product?.name.toLowerCase().includes(search.toLowerCase()) ||
          product?.brand.toLowerCase().includes(search.toLowerCase()) ||
          product?.category?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return selectedProducts;
  }, [products, search]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredProducts.slice(start, end);
  }, [page, filteredProducts, rowsPerPage]);

  const renderCell = useCallback((row: Product, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="grid grid-cols-[55px_auto] gap-2 w-[400px]">
            <div className="w-[55px] h-[55px]">
              <Image
                src={row?.images[0].url}
                alt={row?.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <Link href={`/admin/products/${row?._id}`}>
              <span className="text-wrap">{row?.name}</span>
            </Link>
          </div>
        );
      case "price":
        return <div>{formatCurrency(row?.price, "NGN")}</div>;
      case "quantityInStock":
        return <div>{row?.quantityInStock}</div>;
      case "brand":
        return <div>{row?.brand}</div>;
      case "category":
        return <div>{row?.category?.name}</div>;
      case "isPublished":
        return (
          <div>
            {row?.isPublished ? (
              <span>Published</span>
            ) : (
              <span>Unpublished</span>
            )}
          </div>
        );
      case "createdAt":
        return <div className="w-[150px]">{formatDate(row?.createdAt)}</div>;
      case "actions":
        return (
          <div className="flex items-center space-x-2">
            <button>
              <Edit size={16} />
            </button>
            <button>
              <Trash size={16} />
            </button>
          </div>
        );
      default:
        return;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<Search size={18} className="text-default-300" />}
            value={search}
            variant="bordered"
            onClear={() => setSearch("")}
            onValueChange={onSearchChange}
            defaultValue={searchParams.get("q")?.toString()}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {filteredProducts.length} products
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small cursor-pointer"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [search, products.length, onSearchChange, onRowsPerPageChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={Boolean(search)}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [items.length, page, pages, search]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: [
        "bg-transparent",
        "text-default-500",
        "border-b",
        "border-divider",
        // "data-[key='name']:w-[400px]",
        // "data-[key='createdAt']:w-[150px]",
        // "data-[key='actions']:w-[50px]",
      ],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
        "p-4",
      ],
    }),
    []
  );

  return (
    <div className="w-full p-4 overflow-x-auto">
      <Table
        isCompact
        removeWrapper
        topContent={topContent}
        bottomContent={bottomContent}
        classNames={classNames}
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        isHeaderSticky
        layout="auto"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} loadingContent={<p>Loading...</p>}>
          {(item) => (
            <TableRow key={item._id}>
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

export default ProductListTable;

export const columns = [
  { name: "Product", key: "name" },
  { name: "Price", key: "price" },
  { name: "Quantity", key: "quantityInStock" },
  { name: "Brand", key: "brand" },
  { name: "Category", key: "category" },
  { name: "Published", key: "isPublished" },
  { name: "Date added", key: "createdAt" },
  { name: "Actions", key: "actions" },
];

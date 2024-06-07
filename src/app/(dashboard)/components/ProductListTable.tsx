"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
} from "react-data-table-component";
import { customStyles } from "./UI/tableStyle";
import { Product } from "@/interfaces/product.interface";
import { Trash } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useProductStore } from "@/lib/stores/product.store";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AppModal from "../../../components/AppModal";

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

const columns: TableColumn<Product>[] = [
  {
    name: "Product",
    selector: (row) => row?.name,
    cell: (row) => (
      <div className="grid grid-cols-[55px_auto] gap-2 w-full py-2">
        <div className="w-10 h-10">
          <Image
            src={row?.images[0].url}
            alt={row?.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <Link href={`/admin/products/${row?._id}`}>
          <span className="text-wrap">{row?.name}</span>
        </Link>
      </div>
    ),
    minWidth: "400px",
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) => row?.price,
    cell: (row) => <div>{formatCurrency(row?.price, "NGN")}</div>,
    minWidth: "150px",
    sortable: true,
  },
  {
    name: "Quantity",
    cell: (row) => <div>{row?.quantityInStock}</div>,
  },
  {
    name: "Category",
    cell: (row) => <div>{row?.category?.name}</div>,
  },
  {
    name: "Brand",
    cell: (row) => <div>{row?.brand}</div>,
  },
  {
    name: "Published",
    selector: (row) => row?.isPublished,
    cell: (row) => (
      <div>
        {row?.isPublished ? (
          <span className="px-4 py-1 rounded-full bg-opacity-10 text-green-500 bg-green-500">
            Yes
          </span>
        ) : (
          <span className="px-4 py-1 rounded-full bg-opacity-10 text-red-500 bg-red-500">
            No
          </span>
        )}
      </div>
    ),
    sortable: true,
  },
  {
    name: "Date added",
    selector: (row) => row?.createdAt,
    cell: (row) => <div>{formatDate(row?.createdAt)}</div>,
    minWidth: "150px",
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => {
      const { loading, deleteProduct } = useProductStore();
      const router = useRouter();
      const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

      const handleDelete = async () => {
        if (row) {
          await deleteProduct(row?._id);
          router.refresh();
          onClose();
        }
      };

      return (
        <div className="w-full flex items-center justify-center">
          <Button
            isIconOnly
            color="danger"
            variant="light"
            size="sm"
            onPress={onOpen}
          >
            <Trash size={16} />
          </Button>
          <AppModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Confirmation"
            isDismissable={false}
            hideCloseButton
          >
            <div className="flex flex-col">
              <p>
                Are you sure you want to delete <b>{row?.name}</b>?
              </p>
              <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
                <Button
                  variant="light"
                  color="default"
                  className="rounded-md"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="danger"
                  type="submit"
                  className="rounded-md "
                  isDisabled={loading}
                  isLoading={loading}
                  onPress={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </AppModal>
        </div>
      );
    },
    width: "80px",
  },
];

const ProductListTable = () => {
  const { products, loading, categories } = useProductStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedPublished, setSelectedPublished] = useState(
    searchParams.get("published") || ""
  );

  const filteredProducts = useMemo(() => {
    let selectedProducts = [...products];

    if (searchTerm) {
      selectedProducts = selectedProducts.filter((product) =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      selectedProducts = selectedProducts.filter(
        (product) => product?.category?.name === selectedCategory
      );
    }

    if (selectedPublished) {
      const isPublished = selectedPublished === "yes";
      selectedProducts = selectedProducts.filter(
        (product) => product?.isPublished === isPublished
      );
    }
    return selectedProducts;
  }, [products, searchTerm, selectedCategory, selectedPublished]);

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

  const handleFilterChange = useCallback(
    (filterName: string, value?: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(filterName, value);
        if (filterName === "category") setSelectedCategory(value);
        if (filterName === "published") setSelectedPublished(value);
      } else {
        params.delete(filterName);
        if (filterName === "category") setSelectedCategory("");
        if (filterName === "published") setSelectedPublished("");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  return (
    <div>
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
          value={selectedCategory}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="" className="bg-white dark:bg-[#222327]">
            All Categories
          </option>
          {categories.map((category) => (
            <option
              key={category._id}
              value={category.name}
              className="bg-white dark:bg-[#222327]"
            >
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="bg-transparent border focus:outline-none px-2 py-1 text-sm rounded-md shadow-sm w-full lg:max-w-max"
          value={selectedPublished}
          onChange={(e) => handleFilterChange("published", e.target.value)}
        >
          <option value="" className="bg-white dark:bg-[#222327]">
            All
          </option>
          <option value="yes" className="bg-white dark:bg-[#222327]">
            Published
          </option>
          <option value="no" className="bg-white dark:bg-[#222327]">
            Unpublished
          </option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={filteredProducts}
        progressPending={loading}
        progressComponent={
          <div className="py-8">
            <Spinner />
          </div>
        }
        pagination
        selectableRows
        // actions={<button className="">Export PDF</button>}
        // fixedHeader={true}
        // fixedHeaderScrollHeight="60vh"
        selectableRowsHighlight
        highlightOnHover
        // subHeader
        customStyles={customStyles}
        theme="light"
      />
    </div>
  );
};

export default ProductListTable;

"use client";
import AppModal from "@/components/AppModal";
import { Category } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { formatDate } from "@/utils/helpers";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Table,
} from "@heroui/react";
import {
  ChevronDownIcon,
  EllipsisVertical,
  Eye,
  PencilLine,
  RefreshCcw,
  SearchIcon,
  Trash,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import UpdateCategoryForm from "./UpdateCategoryForm";
import useCategories from "@/hooks/useCategories";

const columns = [
  { name: "Name", uid: "name", minWidth: "200px", sortable: true },
  { name: "Description", uid: "description", minWidth: "300px" },
  // { name: "Products", uid: "products", minWidth: "150px" },
  { name: "Date added", uid: "dateAdded", minWidth: "150px", sortable: true },
  { name: "Actions", uid: "actions", width: "80px" },
];

const CategoryTable = () => {
  const {
    loading,
    deleteCategory,
    products,
    fetchCategories,
    fetchProducts,
  } = useProductStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((col) => col.uid))
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onOpenChange: onUpdateOpenChange,
    onClose: onUpdateClose,
  } = useDisclosure();
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const hasSearchFilter = Boolean(filterValue);

  const { categories, isLoading } = useCategories();

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCat = [...categories];

    if (hasSearchFilter) {
      filteredCat = filteredCat.filter((cat) =>
        cat?.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCat;
  }, [categories, filterValue, hasSearchFilter]);

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

  const catProducts = useCallback(
    (category: Category) =>
      category
        ? products.filter((product) => product?.category?._id === category?._id)
        : [],
    [products]
  );

  const renderCell = useCallback((cat: Category, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return cat?.name;
      case "description":
        return (
          <div className="text-ellipsis line-clamp-2">{cat?.description}</div>
        );
      // case "products":
      //   return <div>{catProducts(cat).length}</div>;
      case "dateAdded":
        return formatDate(cat?.createdAt);
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
                  key={"see_products"}
                  startContent={<Eye size={16} />}
                  onPress={() => router.push(`/admin/categories/${cat?.slug}`)}
                >
                  See products
                </DropdownItem>
                <DropdownItem
                  key={"update"}
                  onPress={() => {
                    setSelectedCat(cat);
                    onUpdateOpen();
                  }}
                  startContent={<PencilLine size={16} />}
                >
                  Update
                </DropdownItem>
                <DropdownItem
                  key={"delete"}
                  onPress={() => {
                    setSelectedCat(cat);
                    onOpen();
                  }}
                  startContent={<Trash size={16} />}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  const handleDelete = () => {
    if (selectedCat) {
      deleteCategory(selectedCat?._id);
      router.refresh();
      onClose();
    }
  };

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

  const topContent = useMemo(() => {
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

          <div className="flex gap-3">
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
            Total {categories.length} categories
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
    categories.length,
    onClear,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center md:flex-row flex-col gap-4">
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
            wrapper: "bg-white dark:bg-[#222327]",
            item: "bg-transparent dark:text-white",
            prev: "bg-white dark:bg-[#222327]",
            next: "bg-white dark:bg-[#222327]",
            cursor: "",
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
  }, [selectedKeys, filteredItems.length, page, pages]);

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
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Confirmation"
        isDismissable={false}
        hideCloseButton
      >
        <div className="flex flex-col">
          <p>
            Are you sure you want to delete <b>{selectedCat?.name}</b>?
          </p>
          <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
            <Button variant="light" color="default" onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              type="submit"
              isDisabled={loading}
              isLoading={loading}
              onPress={handleDelete}
              endContent={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </AppModal>

      {/* Update Offer Modal */}
      <AppModal
        isOpen={isUpdateOpen}
        onOpenChange={onUpdateOpenChange}
        title="Update Offer"
        isDismissable={false}
        hideCloseButton
      >
        <UpdateCategoryForm
          onClose={onUpdateClose}
          category={selectedCat as Category}
        />
      </AppModal>

      <div className="w-full flex justify-end mb-4">
        <Button
          variant="solid"
          color="warning"
          onPress={() => {
            fetchCategories();
            fetchProducts();
          }}
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
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No category found"}
          items={sortedItems}
          isLoading={isLoading}
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

export default CategoryTable;

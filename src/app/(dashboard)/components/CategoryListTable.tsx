"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import AppModal from "@/components/AppModal";
import { Category } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { formatDate } from "@/utils/helpers";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { Edit, Trash } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
} from "react-data-table-component";
import { customStyles } from "./UI/tableStyle";
import UpdateCategoryForm from "./UpdateCategoryForm";

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

const columns: TableColumn<Category>[] = [
  {
    name: "Name",
    cell: (row) => <div>{row?.name}</div>,
    width: "150px",
  },
  {
    name: "Description",
    cell: (row) => <div>{row?.description}</div>,
    minWidth: "300px",
  },
  {
    name: "Products",
    cell: (row) => {
      const { products } = useProductStore();

      const categoryProducts = products.filter(
        (product) => product?.category?._id === row?._id
      );
      return <div>{categoryProducts.length}</div>;
    },
  },
  {
    name: "Date",
    cell: (row) => <div>{formatDate(row?.createdAt)}</div>,
  },
  {
    name: "Actions",
    cell: (row) => {
      const { loading, deleteCategory } = useProductStore();
      const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onOpenChange: onUpdateOpenChange,
        onClose: onUpdateClose,
      } = useDisclosure();
      const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteOpenChange,
        onClose: onDeleteClose,
      } = useDisclosure();

      const handleDelete = () => {
        deleteCategory(row?._id);
        onDeleteClose();
      };

      return (
        <div className="w-full flex items-center justify-center">
          <Button
            isIconOnly
            color="primary"
            variant="light"
            size="sm"
            onPress={onUpdateOpen}
          >
            <Edit size={16} />
          </Button>
          <Button
            isIconOnly
            color="danger"
            variant="light"
            size="sm"
            onPress={onDeleteOpen}
          >
            <Trash size={16} />
          </Button>

          <AppModal
            isOpen={isUpdateOpen}
            onOpenChange={onUpdateOpenChange}
            title="Update Category"
            isDismissable={false}
            hideCloseButton
          >
            <UpdateCategoryForm category={row} onClose={onUpdateClose} />
          </AppModal>
          <AppModal
            isOpen={isDeleteOpen}
            onOpenChange={onDeleteOpenChange}
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
                  onPress={onDeleteClose}
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
            </div>{" "}
          </AppModal>
        </div>
      );
    },
    width: "80px",
  },
];

const CategoryListTable = () => {
  const { categories, loading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filteredCategories = useMemo(() => {
    let selectedCategories = [...categories];

    if (searchTerm) {
      selectedCategories = selectedCategories.filter((cate) =>
        cate?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return selectedCategories;
  }, [categories, searchTerm]);

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
        data={filteredCategories}
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

export default CategoryListTable;

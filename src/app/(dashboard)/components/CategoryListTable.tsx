"use client";
import { Category } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useProductStore } from "@/lib/stores/product.store";
import { formatDate } from "@/utils/helpers";
import { Button, Spinner } from "@nextui-org/react";
import { Edit, Trash } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
} from "react-data-table-component";
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
    name: "Date",
    cell: (row) => <div>{formatDate(row?.createdAt)}</div>,
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="w-full flex items-center justify-center">
        <Button isIconOnly color="primary" variant="light" size="sm">
          <Edit size={16} />
        </Button>
        <Button isIconOnly color="danger" variant="light" size="sm">
          <Trash size={16} />
        </Button>
      </div>
    ),
    width: "80px",
  },
];

const CategoryListTable = () => {
  const { categories, setCategories } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    </div>
  );
};

export default CategoryListTable;

"use client";
import { User } from "@/interfaces/auth.interface";
import { axiosInstance } from "@/lib/axios";
import { formatDate } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
  defaultThemes,
} from "react-data-table-component";
import { useDebouncedCallback } from "use-debounce";

createTheme(
  "light",
  {
    text: {
    	primary: 'inherit',
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
  },
  // "dark"
);

const customStyles = {
  rows: {
    style: {
      // minHeight: '40px', // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      fontWeight: "bold",
      // background: "#ffc77d",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
      // "&:not(:last-of-type)": {
      //   borderRightStyle: "solid",
      //   borderRightWidth: "1px",
      //   borderRightColor: defaultThemes.default.divider.default,
      // },
    },
  },
};

const columns: TableColumn<User>[] = [
  {
    name: "Name",
    cell: (row) => (
      <div>
        <Link href={`/admin/users/${row?._id}`}>
          {row?.firstname + " " + row?.lastname}
        </Link>
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "Email address",
    selector: (row) => row?.email,
    minWidth: "300px",
  },
  {
    name: "Phone number",
    selector: (row) => row?.phoneNumber,
    minWidth: "150px",
  },
  {
    name: "Role",
    selector: (row) => row?.isAdmin,
    width: "80px",
    cell: (row) => (
      <div>{row?.isAdmin ? <span>Admin</span> : <span>User</span>}</div>
    ),
    sortable: true,
  },
  {
    name: "Privilege",
    selector: (row) => row?.isSuperAdmin,
    width: "120px",
    cell: (row) => (
      <div>
        {row?.isSuperAdmin ? <span>Super Admin</span> : <span>User</span>}
      </div>
    ),
  },
  {
    name: "Verified",
    selector: (row) => row?.is_verified,
    width: "120px",
    cell: (row) => (
      <div>
        {row?.is_verified ? <span>Verified</span> : <span>Not Verified</span>}
      </div>
    ),
    sortable: true,
  },
  {
    name: "Date Joined",
    selector: (row) => formatDate(row?.createdAt),
    minWidth: "150px",
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex items-center space-x-2">
        <button>
          <Edit size={16} />
        </button>
        <button>
          <Trash size={16} />
        </button>
      </div>
    ),
    width: "80px",
  },
];

const UsersListTable = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/admin/users");

        setUsers(data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let selectedUsers = [...users];

    if (searchTerm) {
      selectedUsers = selectedUsers.filter(
        (user) =>
          user?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return selectedUsers;
  }, [users, searchTerm]);

  const handleSearch = useCallback((value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
      setSearchTerm(value);
    } else {
      params.delete("q");
      setSearchTerm("");
    }
    replace(`${pathname}?${params.toString()}`);
  }, []);

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
        data={filteredUsers}
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

export default UsersListTable;

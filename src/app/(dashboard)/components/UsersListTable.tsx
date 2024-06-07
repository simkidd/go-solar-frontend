"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { User } from "@/interfaces/auth.interface";
import { axiosInstance } from "@/lib/axios";
import { useUserStore } from "@/lib/stores/user.store";
import { formatDate } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, {
  TableColumn,
  createTheme,
} from "react-data-table-component";

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
      <div
        className={`px-2 py-1 rounded-full bg-opacity-10 ${verifiedChip(row?.is_verified)}`}
      >
        {row?.is_verified ? "Verified" : "Not Verified"}
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
  const { users, setUsers } = useUserStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");

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
          user?.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      selectedUsers = selectedUsers.filter(
        (user) =>
          (roleFilter === "admin" && user?.isAdmin) ||
          (roleFilter === "superAdmin" && user?.isSuperAdmin) ||
          (roleFilter === "user" && !user?.isAdmin && !user?.isSuperAdmin)
      );
    }
    return selectedUsers;
  }, [users, searchTerm, roleFilter]);

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

  const handleRoleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedRole = event.target.value;
      setRoleFilter(selectedRole);
      const params = new URLSearchParams(searchParams);
      if (selectedRole) {
        params.set("role", selectedRole);
      } else {
        params.delete("role");
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
          value={roleFilter}
          onChange={handleRoleFilterChange}
        >
          <option value="" className="bg-white dark:bg-[#222327]">
            All
          </option>
          <option value="admin" className="bg-white dark:bg-[#222327]">
            Admin
          </option>
          <option value="superAdmin" className="bg-white dark:bg-[#222327]">
            Super Admin
          </option>
          <option value="user" className="bg-white dark:bg-[#222327]">
            User
          </option>
        </select>
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

export const verifiedChip = (isVerified: boolean) => {
  return isVerified ? "text-green-500 bg-green-500" : "text-red-500 bg-red-500";
};

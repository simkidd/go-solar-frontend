"use client";
import { User } from "@/interfaces/auth.interface";
import { formatDate } from "@/utils/helpers";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import DataTable, {
  TableColumn,
  defaultThemes,
} from "react-data-table-component";

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
      background: "#ffc77d",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
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
    width: "75px",
  },
  {
    name: "Email address",
    selector: (row) => row?.email,
    // width: "75px",
  },
  {
    name: "Phone number",
    selector: (row) => row?.phoneNumber,
    width: "75px",
  },
  {
    name: "Role",
    selector: (row) => row?.isAdmin,
    width: "120px",
    cell: (row) => (
      <div>{row?.isAdmin ? <span>Admin</span> : <span>User</span>}</div>
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
  },
  {
    name: "Date Joined",
    selector: (row) => formatDate(row?.createdAt),
    maxWidth: "150px",
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
  },
];

const UsersListTable = () => {
  return (
    <div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default UsersListTable;

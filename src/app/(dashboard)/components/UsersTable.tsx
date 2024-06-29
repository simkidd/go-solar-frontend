"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  Chip,
  SortDescriptor,
  Spinner,
  Card,
  CardBody,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  EllipsisVertical,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { useUserStore } from "@/lib/stores/user.store";
import Link from "next/link";
import { User } from "@/interfaces/auth.interface";
import { formatDate } from "@/utils/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Define columns based on provided fields
const columns = [
  { name: "Name", uid: "name", minWidth: "200px", sortable: true },
  { name: "Email address", uid: "email", minWidth: "300px" },
  { name: "Phone number", uid: "phone", minWidth: "150px" },
  { name: "Role", uid: "role", width: "80px", sortable: true },
  { name: "Privilege", uid: "privilege", width: "120px" },
  { name: "Verified", uid: "verified", width: "120px", sortable: true },
  { name: "Date Joined", uid: "dateJoined", minWidth: "150px" },
  { name: "Actions", uid: "actions", width: "80px" },
];

const UsersTable = () => {
  const { users, setUsers } = useUserStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((col) => col.uid))
  );
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "All"
  );
  const router = useRouter();

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

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user?.firstname.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.lastname.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.phoneNumber.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (roleFilter !== "All") {
      filteredUsers = filteredUsers.filter((user) => {
        if (roleFilter === "user") return !user.isAdmin && !user.isSuperAdmin;
        if (roleFilter === "admin") return user.isAdmin && !user.isSuperAdmin;
        if (roleFilter === "superAdmin") return user.isSuperAdmin;
      });
    }

    return filteredUsers;
  }, [users, filterValue, roleFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a] ?? "";
      const second = b[sortDescriptor.column as keyof typeof b] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    return sorted;
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div>
            <Link href={`/admin/users/${user?._id}`}>
              {user?.firstname + " " + user?.lastname}
            </Link>
          </div>
        );
      case "email":
        return user?.email;
      case "phone":
        return user?.phoneNumber;
      case "role":
        return (
          <Chip
            color={user?.isAdmin ? "success" : "default"}
            size="sm"
            variant="flat"
          >
            {user?.isAdmin ? "Admin" : "User"}
          </Chip>
        );
      case "privilege":
        return (
          <Chip
            color={user?.isSuperAdmin ? "warning" : "default"}
            size="sm"
            variant="flat"
          >
            {user?.isSuperAdmin ? "Super Admin" : "User"}
          </Chip>
        );
      case "verified":
        return (
          <Chip
            color={user?.is_verified ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {user?.is_verified ? "Verified" : "Not Verified"}
          </Chip>
        );
      case "dateJoined":
        return formatDate(user?.createdAt);
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
                  onPress={() => router.push(`/admin/users/${user?._id}`)}
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

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

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

  const onRoleFilterChange = useCallback(
    (keys: Selection) => {
      const selectedRole = Array.from(keys).join(", ");
      const params = new URLSearchParams(searchParams);
      if (selectedRole) {
        params.set("role", selectedRole);
        setRoleFilter(selectedRole);
      } else {
        params.delete("role");
        setPage(1);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const onResetFilters = useCallback(() => {
    setFilterValue("");
    setRoleFilter("All");
    setPage(1);
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  const topContent = useMemo(() => {
    const hasFilters = filterValue || roleFilter !== "All";

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
                  {roleFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Role Filter"
                onSelectionChange={onRoleFilterChange}
                selectionMode="single"
              >
                <DropdownItem key="All">All</DropdownItem>
                <DropdownItem key="user">User</DropdownItem>
                <DropdownItem key="admin">Admin</DropdownItem>
                <DropdownItem key="superAdmin">Super Admin</DropdownItem>
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
            Total {users.length} users
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
    users.length,
    hasSearchFilter,
    roleFilter,
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
    <div className="w-full">
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
          emptyContent={"No users found"}
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

export default UsersTable;

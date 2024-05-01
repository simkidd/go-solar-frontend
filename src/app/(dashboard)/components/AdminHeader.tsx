"use client";
import React from "react";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";
import { Menu, Bell } from "lucide-react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAuth } from "@/contexts/auth.context";

const AdminHeader = () => {
  const { currentUser, logout, setShowSidebar } = useAuth();

  return (
    <div className="h-14 md:h-16 w-full flex bg-white dark:bg-[#222327] shadow-md sticky top-0 right-0 left-0 z-40">
      <div className="w-full px-4 flex items-center justify-between">
        <button className="md:hidden" onClick={() => setShowSidebar(true)}>
          <Menu />
        </button>
        <div className="ms-auto flex items-center space-x-4">
          <Button variant="flat" size="sm" isIconOnly>
            <Bell className="h-[1.2rem] w-[1.2rem] dark:text-white" />
          </Button>
          <ThemeSwitcher />
          <div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  src=""
                  size="md"
                  showFallback
                  fallback={
                    <p className="font-bold text-lg">
                      {currentUser?.firstname[0]}
                    </p>
                  }
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                disabledKeys={["profile"]}
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">
                    {currentUser?.firstname + " " + currentUser?.lastname}
                  </p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={() => logout()}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

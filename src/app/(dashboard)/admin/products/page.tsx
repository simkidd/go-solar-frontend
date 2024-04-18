import { Pencil, Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductsListPage = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Products</h3>
        <div>
          <Link href="/admin/products/create">
            <button className="bg-primary text-white px-4 py-2 text-sm flex items-center">
              <Plus className="mr-2" size={16} />
              Create New
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] shadow">
        <div className="flex items-center py-4 px-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border focus:outline-none px-2 py-1 w-full max-w-md"
          />
        </div>
        <hr />
        <div className="w-full p-4 overflow-x-auto">
          {/* <h4 className="text-center font-bold" v-if="pending">Loading...</h4> */}
          <table className="table-cell text-sm relative w-full">
            <thead>
              <tr>
                <th className="px-2 py-3">
                  <label htmlFor="">
                    <input type="checkbox" name="" id="" />
                  </label>
                </th>
                <th className="px-2 py-3">Product</th>
                <th className="px-2 py-3">SKU</th>
                <th className="px-2 py-3">Stock</th>
                <th className="px-2 py-3">Price</th>
                <th className="px-2 py-3">Sales</th>
                <th className="px-2 py-3">Date added</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-4">
                  <label htmlFor="">
                    <input type="checkbox" className="accent-current" />
                  </label>
                </th>
                <td>
                  <div className="min-w-[366px] py-3 px-2 flex gap-2">
                    <div className="size-14 overflow-hidden rounded">
                      <Image
                        src=""
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Link href="">A4TECH BH300 Bluetooth Wireless Headset</Link>
                  </div>
                </td>
                <td className="min-w-[80px] p-2">CSJ0158</td>
                <td className="min-w-[80px] p-2">12</td>
                <td className="min-w-[80px] p-2">250000</td>
                <td className="min-w-[80px] p-2">256</td>
                <td className="min-w-[80px] p-2">12/24/2023 01:05 PM</td>
                <td className="min-w-[80px] p-2">
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-primary ">
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-primary ">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsListPage;

"use client";
import { Offer, OfferType, Product } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { formatCurrency } from "@/utils/helpers";
import {
  Card,
  CardBody,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const OfferProducts: React.FC<{
  offer: Offer;
}> = ({ offer }) => {
  const { products } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      const productsWithOffer = products.filter(
        (product) => product?.currentOffer?._id === offer._id
      );
      setFilteredProducts(productsWithOffer);
      setLoading(false);
    }
  }, [products, offer]);

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
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">{offer?.name}</h1>
          <p className="">{offer?.description}</p>

          <div>
            {offer?.type === OfferType.PercentageOff && (
              <Chip color="success" variant="flat" size="sm">
                {offer?.percentageOff}% Off
              </Chip>
            )}
            {offer?.type === OfferType.PriceSlash && (
              <Chip color="warning" variant="flat" size="sm">
                {formatCurrency(offer?.priceSlash, "NGN")}
              </Chip>
            )}
          </div>
        </div>

      </div>

      {loading ? (
        <div className="py-4 flex justify-center">
          <Card className="dark:bg-[#222327]">
            <CardBody className="p-6">
              <Spinner size="lg" />
            </CardBody>
          </Card>
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <Table
          aria-label="Products with offer"
          isCompact
          isHeaderSticky
          classNames={classNames}
        >
          <TableHeader>
            <TableColumn>Product</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Discount</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product: Product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="grid grid-cols-[55px_auto] gap-2 w-full py-2">
                    <div className="w-10 h-10">
                      <Image
                        src={product?.images[0]?.url}
                        alt={product?.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-wrap">{product?.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(product?.price, "NGN")}</TableCell>
                <TableCell>
                  {product?.currentOffer?.percentageOff ? (
                    <Chip
                      color="success"
                      variant="flat"
                      size="sm"
                    >{`${product?.currentOffer?.percentageOff}% off`}</Chip>
                  ) : product?.currentOffer?.priceSlash ? (
                    <Chip color="warning" variant="flat" size="sm">
                      {formatCurrency(product?.currentOffer?.priceSlash, "NGN")}
                    </Chip>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No products found for this offer.</p>
      )}
    </div>
  );
};

export default OfferProducts;

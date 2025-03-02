"use client";
import AppModal from "@/components/AppModal";
import { Offer, OfferType } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, PencilLine, RefreshCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UpdateOfferForm from "./UpdateOfferForm";

export const getOfferChipColor = (active: boolean) => {
  switch (active) {
    case true:
      return "success";
    case false:
      return "default";
    default:
      return "default";
  }
};

const OffersComp = () => {
  const { loading, offers, deleteOffer, fetchOffers } = useProductStore();
  const router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onOpenChange: onUpdateOpenChange,
    onClose: onUpdateClose,
  } = useDisclosure();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleDelete = () => {
    if (selectedOffer) {
      deleteOffer(selectedOffer?._id);
      onDeleteClose();
      router.refresh();
    }
  };

  return (
    <div className="w-full">
      {/* delete offer modal */}
      <AppModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        title="Confirmation"
        isDismissable={false}
        hideCloseButton
      >
        <div className="flex flex-col">
          <p>
            Are you sure you want to delete <b>{selectedOffer?.name}</b>?
          </p>
          <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
            <Button variant="light" color="default" onPress={onDeleteClose}>
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
        size="xl"
        isDismissable={false}
        hideCloseButton
      >
        <UpdateOfferForm
          onClose={onUpdateClose}
          existingOffer={selectedOffer as Offer}
        />
      </AppModal>
      <div className="w-full flex justify-end mb-4">
        <Button
          variant="solid"
          color="warning"
          onPress={fetchOffers}
          startContent={<RefreshCcw size={16} />}
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-4 flex justify-center">
          <Card className="dark:bg-[#222327]">
            <CardBody className="p-6">
              <Spinner size="lg" />
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card key={offer?._id} className="dark:bg-[#222327]">
              <CardHeader className="w-full flex items-start justify-between">
                <h3 className="text-lg font-bold dark:text-white">
                  {offer?.name}
                </h3>

                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <EllipsisVertical
                        className="text-default-500"
                        size={16}
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key={"update"}
                      startContent={<PencilLine size={16} />}
                      onPress={() => {
                        setSelectedOffer(offer);
                        onUpdateOpen();
                      }}
                    >
                      Update
                    </DropdownItem>
                    <DropdownItem
                      key={"delete"}
                      startContent={<Trash2 size={16} />}
                      onPress={() => {
                        setSelectedOffer(offer);
                        onDeleteOpen();
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </CardHeader>
              <CardBody>
                <p className="dark:text-white">{offer?.description}</p>
                {offer?.type === OfferType.PriceSlash && (
                  <p className="text-gray-700">
                    Price Slash: ₦{String(offer?.priceSlash)}
                  </p>
                )}
                {offer?.type === OfferType.PercentageOff && (
                  <p className="text-gray-700">
                    Percentage Off: {String(offer?.percentageOff)}%
                  </p>
                )}
              </CardBody>
              <CardFooter className="w-full flex items-center justify-between">
                <Link href={`/admin/sales-offers/${offer?._id}`}>
                  <Button variant="solid" color="primary">
                    See Details
                  </Button>
                </Link>

                <Chip
                  color={getOfferChipColor(offer?.isActive)}
                  size="sm"
                  variant="flat"
                >
                  {offer?.isActive ? "Active" : "Inactive"}
                </Chip>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersComp;

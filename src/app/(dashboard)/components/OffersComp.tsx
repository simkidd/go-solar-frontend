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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { EllipsisVertical, PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UpdateOfferForm from "./UpdateOfferForm";

const OffersComp = () => {
  const { loading, offers, deleteOffer } = useProductStore();
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

      {loading ? (
        <div className="py-4 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card key={offer?._id} className="rounded-none shadow-none">
              <CardHeader className="w-full flex items-start justify-between">
                <h3 className="text-lg font-bold">{offer?.name}</h3>

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
                      startContent={<PencilLine size={16} />}
                      onPress={() => {
                        setSelectedOffer(offer);
                        onUpdateOpen();
                      }}
                    >
                      Update
                    </DropdownItem>
                    <DropdownItem
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
                <p>{offer?.description}</p>
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
              <CardFooter>
                <Link href={`/admin/sales-offers/${offer?._id}`}>
                  <Button variant="solid" color="primary">
                    See Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersComp;

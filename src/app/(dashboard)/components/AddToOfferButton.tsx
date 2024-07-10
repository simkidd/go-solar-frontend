import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";

const AddToOfferButton = () => {
  return (
    <Button
      variant="solid"
      color="primary"
      type="submit"
      className="rounded-md "
      startContent={<Plus size={16} />}
    >
      Add To Offer
    </Button>
  );
};

export default AddToOfferButton;

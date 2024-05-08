import ConfirmationComp from "../components/ConfirmationComp";

const ConfirmOrderPage = () => {
  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div className="relative light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-lg p-8 max-w-[500px]">
          <ConfirmationComp />
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;

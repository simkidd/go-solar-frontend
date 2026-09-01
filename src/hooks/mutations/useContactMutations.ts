import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  service?: string;
  message: string;
}

export const useCreateContactMutation = (options?: {
  onSuccess?: (data: any) => void;
  showToast?: boolean;
}) => {
  const showToast = options?.showToast ?? false;

  return useMutation({
    mutationFn: async (input: ContactFormValues) => {
      const { data } = await axiosInstance.post("/contact", input);
      return data;
    },
    onSuccess: (data) => {
      if (showToast) {
        toast.success(
          data?.message || "Thank you! Your message has been sent to our team."
        );
      }
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send your message. Please try again or call us directly.";
      toast.error(message);
    },
  });
};

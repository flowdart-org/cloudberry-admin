import { ApiResponse } from "@/types/common";

export const ErrorResponse = (error: unknown): ApiResponse<void> => {
    if (error instanceof Error) {
      console.error("Error sending OTP:", error.message);
      return {
        success: false,
        message: error.message || "An error occurred while sending OTP.",
      };
    } else {
      console.error("Unexpected error while sending OTP:", error);
      return {
        success: false,
        message: "Unexpected error while sending OTP.",
      };
    }
}
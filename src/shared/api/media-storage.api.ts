import { LocalImageBlob } from "@features/product/components/sidebar-image-upload.component";
import { Image } from "@shared/interfaces/image.interface";
import { apiClient } from "./client.api";

export const uploadImage = async (
  shopId: string,
  { file, alt }: LocalImageBlob
): Promise<Image> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt", alt);
  const response = await apiClient.post(
    `/api/v1/shop/${shopId}/media-storage/image/upload`,
    formData
  );
  return response.data;
};

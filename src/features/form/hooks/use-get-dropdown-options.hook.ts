import { useQuery } from "@tanstack/react-query";
import {
  FormApi,
  DropdownOption,
  GetDropdownOptionsPayload,
} from "@shared/api/form.api";
import { useShop } from "@shared/hooks/shop.hook";

export const useGetDropdownOptions = (payload: GetDropdownOptionsPayload) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      "form",
      "dropdown",
      payload.entityType,
      payload.valueField,
      payload.labelField,
      payload.query,
    ],
    queryFn: async () => {
      return FormApi.getDropdownOptions(activeShop._id, payload);
    },
  });
};

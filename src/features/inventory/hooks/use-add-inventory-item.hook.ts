import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { AddInventory } from "../interface/inventory.interface";
import { InventoryApi } from "@shared/api/inventory.api";

export const useAddInventoryItem = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: ({ newInventoryItem }: { newInventoryItem: AddInventory }) => {
      return InventoryApi.createInventoryItem(activeShop._id, newInventoryItem);
    },
    onSuccess: (addedInventory) => {
      queryClient.setQueryData(
        [activeShop._id, "inventory", addedInventory._id],
        addedInventory,
      );
      queryClient.invalidateQueries({
        queryKey: [
          activeShop._id,
          "inventory",
          "paginated",
          addedInventory.product,
        ],
      });
      addAlert(`inventory item successfully added 🥳`, AlertSeverity.SUCCESS);
    },
  });
};

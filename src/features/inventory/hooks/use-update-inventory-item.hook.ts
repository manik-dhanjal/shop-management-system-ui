import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { AddInventory } from "../interface/inventory.interface";
import { InventoryApi } from "@shared/api/inventory.api";

export const useUpdateInventoryItem = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: ({
      inventoryId,
      newInventoryItem,
    }: {
      inventoryId: string;
      newInventoryItem: AddInventory;
    }) => {
      return InventoryApi.updateInventoryItem(
        activeShop._id,
        inventoryId,
        newInventoryItem,
      );
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
          { filter: { product: addedInventory.product } },
        ],
      });
      addAlert(`inventory item successfully updated 🥳`, AlertSeverity.SUCCESS);
    },
  });
};

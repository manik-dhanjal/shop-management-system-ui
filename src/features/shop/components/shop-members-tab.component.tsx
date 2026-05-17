import { useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { IoAdd, IoTrash } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";
import { useShopMembers } from "@features/shop/hooks/use-shop-members.hook";
import { useUpdateMemberRoles } from "@features/shop/hooks/use-update-member-role.hook";
import { useRemoveMember } from "@features/shop/hooks/use-remove-member.hook";
import { UserRole, UserRoleLabel } from "@shared/enums/user-role.enum";
import { InviteMemberModal } from "./invite-member-modal.component";

export const ShopMembersTab: React.FC<{
  shopId: string;
  isAdmin: boolean;
}> = ({ shopId, isAdmin }) => {
  const { data: members = [], isLoading } = useShopMembers(shopId);
  const { mutate: updateRoles, isPending: roleSaving } =
    useUpdateMemberRoles(shopId);
  const { mutate: removeMember } = useRemoveMember(shopId);
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress size={20} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Members ({members.length})</h3>
        {isAdmin && (
          <Button
            size="small"
            variant="contained"
            startIcon={<IoAdd />}
            onClick={() => setInviting(true)}
          >
            Invite member
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          No members yet.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-gray-400 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Roles</th>
              {isAdmin && <th className="p-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {members.map((m) => {
              const roles = (m.shopsMeta?.[0]?.roles ?? []) as UserRole[];
              return (
                <tr key={m._id}>
                  <td className="p-2">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="p-2 text-gray-600 dark:text-gray-300">
                    {m.email}
                  </td>
                  <td className="p-2">
                    {isAdmin ? (
                      <Select
                        multiple
                        size="small"
                        disabled={roleSaving}
                        value={roles}
                        onChange={(e) =>
                          updateRoles({
                            userId: m._id,
                            roles: e.target.value as UserRole[],
                          })
                        }
                        renderValue={(selected) =>
                          (selected as UserRole[])
                            .map((r) => UserRoleLabel[r])
                            .join(", ")
                        }
                        sx={{ minWidth: 180 }}
                      >
                        {Object.values(UserRole).map((r) => (
                          <MenuItem key={r} value={r}>
                            {UserRoleLabel[r]}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <span className="text-xs">
                        {roles.map((r) => UserRoleLabel[r]).join(", ")}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="p-2 text-center">
                      <IconButton
                        size="small"
                        aria-label="Remove"
                        onClick={() => setRemoving(m._id)}
                      >
                        <IoTrash className="text-red-600 text-base" />
                      </IconButton>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {inviting && (
        <InviteMemberModal
          shopId={shopId}
          onClose={() => setInviting(false)}
        />
      )}

      {removing && (
        <Modal title="Remove member" onClose={() => setRemoving(null)}>
          <div className="space-y-3 text-sm">
            <p>Remove this user's access to the shop?</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setRemoving(null)} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  removeMember(removing);
                  setRemoving(null);
                }}
                color="error"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

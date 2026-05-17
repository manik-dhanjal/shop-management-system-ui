import { useState } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import Modal from "@shared/components/hoc/modal.component";
import { UserRole, UserRoleLabel } from "@shared/enums/user-role.enum";
import { useInviteMember } from "@features/shop/hooks/use-invite-member.hook";

export const InviteMemberModal: React.FC<{
  shopId: string;
  onClose: () => void;
}> = ({ shopId, onClose }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roles, setRoles] = useState<UserRole[]>([UserRole.EMPLOYEE]);
  const { mutateAsync, isPending } = useInviteMember(shopId);

  const submit = async () => {
    if (!email.trim() || roles.length === 0) return;
    await mutateAsync({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      roles,
    });
    onClose();
  };

  return (
    <Modal title="Invite member" onClose={onClose}>
      <div className="space-y-3">
        <TextField
          label="Email"
          fullWidth
          size="small"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="First name"
            size="small"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last name"
            size="small"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500 mb-1">Roles</div>
          <Select
            multiple
            fullWidth
            size="small"
            value={roles}
            onChange={(e) => setRoles(e.target.value as UserRole[])}
            renderValue={(selected) =>
              (selected as UserRole[]).map((r) => UserRoleLabel[r]).join(", ")
            }
          >
            {Object.values(UserRole).map((r) => (
              <MenuItem key={r} value={r}>
                {UserRoleLabel[r]}
              </MenuItem>
            ))}
          </Select>
          <div className="text-xs text-gray-500 mt-1">
            Existing users get linked instantly. New emails create a pending
            user that can complete signup with the standard flow.
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submit}
            disabled={isPending || !email.trim() || roles.length === 0}
          >
            {isPending ? "Inviting…" : "Invite"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

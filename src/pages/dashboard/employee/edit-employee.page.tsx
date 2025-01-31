import { omit as _omit, omit } from "lodash";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import UserForm, {
  UserFormTypes,
} from "@features/user/components/user-form.component";
import { AddUser } from "@features/user/interface/user.interface";
import { useGetEmployee } from "@features/employee/hooks/use-get-employee.hook";
import { useUpdateEmployee } from "@features/employee/hooks/use-update-employee.hook";

export const EditEmployeePage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  if (!employeeId) {
    navigate("/404");
    return;
  }
  const { mutate } = useUpdateEmployee();
  const existingEmployee = useGetEmployee(employeeId);
  const handleSave = (user: UserFormTypes) => {
    const formattedUser: Partial<AddUser> = {
      ...omit(user, "address", "country", "pincode", "city", "state"),
      location: {
        address: user.address,
        country: user.country,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode,
      },
      profileImage: user.profileImage?._id,
    };
    mutate({ employeeId, employeeChanges: formattedUser });
  };
  if (existingEmployee.isLoading)
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <CircularProgress />
        <div>Loading product details...</div>
      </div>
    );
  if (!existingEmployee.data || existingEmployee.isError)
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <div>Unable to load product details</div>
      </div>
    );

  return (
    <UserForm
      isLoading={existingEmployee.isPending}
      onSubmit={handleSave}
      initialUserData={existingEmployee.data}
    />
  );
};

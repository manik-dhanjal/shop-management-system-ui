import { useAddEmployee } from "@features/employee/hooks/useAddEmployee.hook";
import UserForm, {
  UserFormTypes,
} from "@features/user/components/user-form.component";
import { AddUser } from "@features/user/interface/user.interface";
import { omit } from "lodash";

const AddEmployeePage = () => {
  const { mutate, isPending } = useAddEmployee();
  const handleSave = (user: UserFormTypes) => {
    const formattedUser: AddUser = {
      ...omit(user, "address", "country", "pincode", "city", "state"),
      location: {
        address: user.address,
        country: user.country,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode,
      },
      shopsMeta: [],
      profileImage: user.profileImage?._id,
    };
    mutate(formattedUser);
  };
  return (
    <div>
      <UserForm onSubmit={handleSave} isLoading={isPending} />
    </div>
  );
};

export default AddEmployeePage;

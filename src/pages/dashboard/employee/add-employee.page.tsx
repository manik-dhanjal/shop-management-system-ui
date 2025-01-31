import { useAddEmployee } from "@features/employee/hooks/useAddEmployee.hook";
import UserForm from "@features/user/components/user-form.component";

const AddEmployeePage = () => {
  const { mutate, isPending } = useAddEmployee();

  return (
    <div>
      <UserForm
        onSubmit={(user) =>
          mutate({
            ...user,
            shopsMeta: [],
            profileImage: user.profileImage?._id,
          })
        }
        isLoading={isPending}
      />
    </div>
  );
};

export default AddEmployeePage;

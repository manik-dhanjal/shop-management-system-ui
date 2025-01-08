import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@mui/material";
import { TextFieldControlled } from "@shared/components/form/text-field-controlled.component";
import { PhoneFieldControlled } from "@shared/components/form/phone-field-controlled.component";
import * as yup from "yup";
import { CountrySelectControlled } from "@shared/components/form/country-select-controlled.component";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";

interface UserFormTypes {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

const INITIAL_FORM_VALUES: UserFormTypes = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "India",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

const UserForm: React.FC = () => {
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        firstName: yup
          .string()
          .required("First Name is required")
          .matches(/^[a-zA-Z]+$/, "First Name should only contain letters"),
        lastName: yup
          .string()
          .required("Last Name is required")
          .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters"),
        phone: yup.string().required("Phone number is required"),
        email: yup
          .string()
          .required("Email is required")
          .email("Email is not valid"),
        country: yup.string().required("Country is required"),
        address: yup.string().required("Address is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        pinCode: yup
          .string()
          .required("Pin Code is required")
          .matches(/^\d{6}$/, "Pin Code should be exactly 6 digits"),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { control, handleSubmit } = useForm<UserFormTypes>({
    resolver,
    defaultValues: INITIAL_FORM_VALUES,
  });

  const onSubmit: SubmitHandler<UserFormTypes> = async (data) => {
    console.log(data);
  };

  return (
    <div className="flex gap-10 justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-10 items-start"
      >
        {/* Left Side of Form , profile will be uploaded here*/}
        <div className="flex flex-col gap-4 w-[360px]  dark:bg-gray-800 bg-white  rounded-xl ">
          <div className="px-6 py-4">
            <h2 className="text-md dark:text-gray-100 text-gray-900">
              Profile I
            </h2>
          </div>
          <hr className=" dark:border-gray-600" />
          <div className="p-6">//image will be uploaded here</div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Right Side of Form */}
          <div className="w-max-[600px] dark:bg-gray-800 bg-white  rounded-xl">
            <div className="px-6 py-4">
              <h2 className="text-md dark:text-gray-100 text-gray-900">
                Personal Details
              </h2>
            </div>

            <hr className=" dark:border-gray-600" />
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 w-full p-6 ">
              <TextFieldControlled
                name="firstName"
                control={control}
                label="First Name"
                className="w-full"
                placeholder="Enter your first name"
              />

              <TextFieldControlled
                name="lastName"
                control={control}
                label="Last Name"
                className="w-full"
                placeholder="Enter your last name"
              />

              <PhoneFieldControlled
                name="phone"
                control={control}
                label="Phone"
                defaultCountry="IN"
                className="w-full"
                placeholder="Enter your phone number"
              />
              <TextFieldControlled
                name="email"
                control={control}
                label="Email"
                type="email"
                className="w-full"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Right Side of Form */}
          <div className="w-max-[600px] dark:bg-gray-800 bg-white  rounded-xl">
            <div className="px-6 py-4">
              <h2 className="text-md dark:text-gray-100 text-gray-900">
                Address
              </h2>
            </div>

            <hr className=" dark:border-gray-600" />
            <div className="flex gap-4 justify-stretch p-6 pt-6">
              <div className="grid grid-cols-2 gap-y-8 gap-x-6 w-full">
                <TextFieldControlled
                  name="address"
                  control={control}
                  label="Address"
                  className="w-full col-span-2"
                  placeholder="Enter your address"
                />

                <TextFieldControlled
                  name="city"
                  control={control}
                  label="City"
                  className="w-full"
                  placeholder="Enter your city"
                />
                <TextFieldControlled
                  name="state"
                  control={control}
                  label="State"
                  className="w-full"
                  placeholder="Enter your state"
                />

                <CountrySelectControlled
                  name="country"
                  control={control}
                  label="Country"
                  defaultCountry="India"
                  className="w-full"
                />
                <TextFieldControlled
                  name="pinCode"
                  control={control}
                  label="Pincode"
                  className="w-full"
                  placeholder="Enter your pincode"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 pb-6 px-6">
              <Button variant="contained" size="large" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

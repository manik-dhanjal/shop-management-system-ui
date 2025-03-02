import { useForm, SubmitHandler } from "react-hook-form";

export interface OrderFormTypes {
  // customer: string,
  items: OrderItemFormTypes[];
  description?: string;
  gstTotal: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  // transactionId?: string;
}

export interface OrderItemFormTypes {
  product: string;
  quantity: number;
  measuringUnit: string;
  currency: string;
  price: number;
  discount?: number;
  gstRate: number;
}

interface OrderFormProps {
  onSubmit: SubmitHandler<OrderFormTypes>;
  isLoading: boolean;
}

export const INITIAL_FORM_VALUES: OrderFormTypes = {
  items: [],
  description: "",
  gstTotal: 0,
  totalAmount: 0,
  paymentMethod: "",
  paymentStatus: "",
};

// const UserForm: React.FC<UserFormProps> = ({
//   onSubmit,
//   isLoading,
//   initialUserData,
// }: UserFormProps) => {
//   const validationSchema = useMemo(
//     () =>
//       yup.object().shape({
//         firstName: yup
//           .string()
//           .required("First Name is required")
//           .matches(/^[a-zA-Z]+$/, "First Name should only contain letters"),
//         lastName: yup
//           .string()
//           .required("Last Name is required")
//           .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters"),
//         phone: yup.string().required("Phone number is required"),
//         email: yup
//           .string()
//           .required("Email is required")
//           .email("Email is not valid"),
//         country: yup.string().required("Country is required"),
//         address: yup.string().required("Address is required"),
//         city: yup.string().required("City is required"),
//         state: yup.string().required("State is required"),
//         pinCode: yup
//           .string()
//           .required("Pin Code is required")
//           .matches(/^\d{6}$/, "Pin Code should be exactly 6 digits"),
//       }),
//     []
//   );
//   const [profileImage, setProfileImage] = useState<Image | null>(
//     initialUserData?.profileImage || null
//   );
//   const resolver = useYupValidationResolver(validationSchema);
//   const { control, handleSubmit } = useForm<UserFormTypes>({
//     resolver,
//     defaultValues: initialUserData
//       ? {
//           firstName: initialUserData.firstName,
//           lastName: initialUserData.lastName,
//           phone: initialUserData.phone,
//           email: initialUserData.email,
//           country: initialUserData.location?.country,
//           address: initialUserData.location?.address,
//           city: initialUserData.location?.city,
//           state: initialUserData.location?.state,
//           pinCode: initialUserData.location?.pinCode,
//         }
//       : INITIAL_FORM_VALUES,
//   });

//   const onFormSubmit = (data: UserFormTypes) => {
//     if (profileImage) {
//       onSubmit({ ...data, profileImage });
//     } else {
//       onSubmit({ ...data });
//     }
//   };

//   return (
//     <div className="flex gap-10 justify-center">
//       <form
//         onSubmit={handleSubmit(onFormSubmit)}
//         className="flex gap-10 items-start"
//       >
//         {/* Left Side of Form , profile will be uploaded here*/}
//         <div className="flex flex-col w-[360px]  dark:bg-gray-800 bg-white  rounded-xl ">
//           <div className="px-6 py-4">
//             <h2 className="text-md dark:text-gray-100 text-gray-900">
//               Profile Image
//             </h2>
//           </div>
//           <hr className=" dark:border-gray-600" />
//           <div className="p-6">
//             <UserImageUpload
//               image={profileImage}
//               onChange={(img) => setProfileImage(img)}
//             />
//           </div>
//         </div>

//         <div className="flex flex-col gap-10">
//           {/* Right Side of Form */}
//           <div className="w-max-[600px] dark:bg-gray-800 bg-white  rounded-xl">
//             <div className="px-6 py-4">
//               <h2 className="text-md dark:text-gray-100 text-gray-900">
//                 Personal Details
//               </h2>
//             </div>

//             <hr className=" dark:border-gray-600" />
//             <div className="grid grid-cols-2 gap-y-8 gap-x-6 w-full p-6 ">
//               <TextFieldControlled
//                 name="firstName"
//                 control={control}
//                 label="First Name"
//                 className="w-full"
//                 placeholder="Enter your first name"
//               />

//               <TextFieldControlled
//                 name="lastName"
//                 control={control}
//                 label="Last Name"
//                 className="w-full"
//                 placeholder="Enter your last name"
//               />

//               <PhoneFieldControlled
//                 name="phone"
//                 control={control}
//                 label="Phone"
//                 defaultCountry="IN"
//                 className="w-full"
//                 placeholder="Enter your phone number"
//               />
//               <TextFieldControlled
//                 name="email"
//                 control={control}
//                 label="Email"
//                 className="w-full"
//                 placeholder="Enter your email"
//               />
//             </div>
//           </div>

//           {/* Right Side of Form */}
//           <div className="w-max-[600px] dark:bg-gray-800 bg-white  rounded-xl">
//             <div className="px-6 py-4">
//               <h2 className="text-md dark:text-gray-100 text-gray-900">
//                 Address
//               </h2>
//             </div>

//             <hr className=" dark:border-gray-600" />
//             <div className="flex gap-4 justify-stretch p-6 pt-6">
//               <div className="grid grid-cols-2 gap-y-8 gap-x-6 w-full">
//                 <TextFieldControlled
//                   name="address"
//                   control={control}
//                   label="Address"
//                   className="w-full col-span-2"
//                   placeholder="Enter your address"
//                 />

//                 <TextFieldControlled
//                   name="city"
//                   control={control}
//                   label="City"
//                   className="w-full"
//                   placeholder="Enter your city"
//                 />
//                 <TextFieldControlled
//                   name="state"
//                   control={control}
//                   label="State"
//                   className="w-full"
//                   placeholder="Enter your state"
//                 />

//                 <CountrySelectControlled
//                   name="country"
//                   control={control}
//                   label="Country"
//                   defaultCountry="India"
//                   className="w-full"
//                 />
//                 <TextFieldControlled
//                   name="pinCode"
//                   control={control}
//                   label="Pincode"
//                   className="w-full"
//                   placeholder="Enter your pincode"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 pb-6 px-6">
//               <Button
//                 variant="contained"
//                 size="large"
//                 type="submit"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Submitting..." : "Submit"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UserForm;

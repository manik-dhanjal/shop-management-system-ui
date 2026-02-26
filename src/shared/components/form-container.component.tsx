export const FormContainer: React.FC<{
  children: React.ReactNode;
  title: string;
  childClassName?: string;
  titleClassName?: string;
  className?: string;
}> = ({
  children,
  title,
  childClassName,
  titleClassName,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={`dark:bg-gray-800 bg-white  rounded-xl ${className || ""}`}
      {...otherProps}
    >
      <div className="px-4 py-2">
        <h2
          className={`text-sm dark:text-gray-100 text-gray-900 ${titleClassName || ""}`}
        >
          {title}
        </h2>
      </div>

      <hr className=" dark:border-gray-600" />
      <div className={`w-full p-4 ${childClassName || ""}`}>{children}</div>
    </div>
  );
};

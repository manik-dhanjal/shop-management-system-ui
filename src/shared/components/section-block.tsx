import { ReactNode } from "react";

interface SectionBlockProps {
  children: ReactNode;
  title: string | JSX.Element;
  className?: string;
}

/**
 * FormSectionLayout component
 *
 * A layout component for form sections with a title and a styled container.
 *
 * @param {ReactNode} children - The content to be displayed within the form section.
 * @param {string} title - The title of the form section.
 * @returns {JSX.Element} The rendered FormSectionLayout component.
 */
const SectionBlock = ({
  children,
  title,
  className,
  ...props
}: SectionBlockProps): JSX.Element => {
  return (
    <div
      className={`dark:bg-gray-800 bg-white rounded-xl ${className}`}
      {...props}
    >
      <div className="px-6 py-3 text-sm dark:text-gray-300 text-gray-900">
        {title}
      </div>

      <hr className="dark:border-gray-600" />
      <div className="w-full p-6">{children}</div>
    </div>
  );
};

export default SectionBlock;

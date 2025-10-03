export interface CategoryCardProps {
  name: string;
  description: string;
}

export const CategoryCard = ({ name, description }: CategoryCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 min-w-[220px]">
      <h3 className="text-md dark:text-white mb-1">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

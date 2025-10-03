import { ChangeEvent, useState } from "react";
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import SectionBlock from "../section-block";

export interface KeywordInputType {
  label: string;
  value: string[];
  name: string;
  onChange: (name: string, value: string[]) => void;
  className?: string;
}
const KeywordInput = ({
  value,
  name,
  onChange,
  label,
  className,
}: KeywordInputType) => {
  const [currentValue, setCurrentValue] = useState<string>("");
  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentValue) {
        onChange(name, [...value, currentValue]);
        setCurrentValue("");
      }
    }
  };
  const handleRemove = (targetItem: string, targetIndex: number) => {
    const filterValue = value.filter(
      (item, index) => targetItem !== item || index !== targetIndex
    );
    onChange(name, filterValue);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  return (
    <SectionBlock title={label} className={className}>
      <div className=" flex flex-wrap gap-3 max-w-full">
        {value.map((item, index) => (
          <span
            key={item + index}
            className="text-md shadow-sm text-gray-700 dark:text-gray-500 rounded-lg dark:border-gray-600 border-gray-300 overflow-hidden px-2 outline-none inline-flex justify-center items-center border"
          >
            <div className="max-w-[300px] truncate py-1 pr-1 text-gray-700 dark:text-gray-300">
              {item}
            </div>
            <RxCross2
              className="text-xl ml-1.2 text-gray-400 dark:text-gray-500 cursor-pointer"
              onClick={() => handleRemove(item, index)}
            />
          </span>
        ))}
        <div className="relative inline-block w-32 h-[34px]">
          <input
            type="text"
            value={currentValue}
            onChange={handleInputChange}
            onKeyDown={handleAdd}
            className={`absolute border text-gray-700 dark:text-gray-300 dark:border-gray-600  border-gray-300 rounded-lg overflow-hidden px-2 py-1 outline-none inline ${
              currentValue
                ? "opacity-100 w-32 cursor-text"
                : "w-12  opacity-0 cursor-pointer"
            } focus:w-32 focus:opacity-100 peer focus:cursor-text transition-all duration-500 bg-transparent shadow-sm z-10`}
            placeholder="Type Here ..."
          />
          <div
            className={` rounded-lg overflow-hidden absolute top-0 z-0 duration-150 ${
              currentValue && "opacity-0"
            } transition-all shadow-sm border dark:border-gray-600 border-gray-300 p-1 peer-focus:opacity-0`}
          >
            <GoPlus className="text-gray-500 dark:text-gray-400 text-2xl " />
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default KeywordInput;

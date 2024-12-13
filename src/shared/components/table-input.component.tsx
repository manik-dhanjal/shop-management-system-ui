import React, { useEffect, useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { cloneDeep as _cloneDeep } from "lodash";

export interface TableRecordType {
  name: string;
  value: string;
}
export interface TableInputType {
  label: string;
  value: TableRecordType[];
  name: string;
  header: TableRecordType;
  onChange: (name: string, value: TableRecordType[]) => void;
  className?: string;
}
const INITIAL_INPUT_PAIR: TableRecordType = {
  name: "",
  value: "",
};
const TableInput = ({
  label,
  value,
  name,
  onChange,
  header,
  className,
}: TableInputType) => {
  useEffect(() => {
    console.log("rerendered");
  });
  const [newRecord, setNewRecord] =
    useState<TableRecordType>(INITIAL_INPUT_PAIR);
  const handleNewRecordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewRecord({
      ...newRecord,
      [e.target.name]: e.target.value,
    });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    if (value.length <= index) return;

    console.log(e.target.name, index, value);
    const clonedValue = _cloneDeep(value) as TableRecordType[];
    clonedValue[index][e.target.name as "name" | "value"] = _cloneDeep(
      e.target.value
    );
    console.log(clonedValue);

    const filteredValue = clonedValue.filter(
      (record) => record.name || record.value
    );
    onChange(name, filteredValue);
  };
  const handleAddNewRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isRecordPairEmpty(newRecord)) return;
    const updatedValue = [...value, newRecord];
    onChange(name, updatedValue);
    setNewRecord(INITIAL_INPUT_PAIR);
  };
  const handleItemPairDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    itemIndex: number
  ) => {
    e.preventDefault();
    console.log(4);
    const updatedValue = value.filter((_, index) => index !== itemIndex);
    onChange(name, updatedValue);
  };
  return (
    <div className={`${className} w-full`}>
      <div className="text-slate-500 mb-3">{label}</div>
      <div className="shadow-sm rounded-lg">
        <div className="flex w-full border rounded-t-lg dark:border-gray-700/60 border-b-0 bg-white dark:bg-gray-800">
          <div className="flex-1 py-3 px-4 text-gray-500">{header.name}</div>
          <div className="flex-1 py-3 px-4 border-l dark:border-gray-700/60 text-gray-700 dark:text-gray-500">
            {header.value}
          </div>
          <div className="w-24 border-l flex justify-center items-center  dark:border-gray-700/60 text-gray-500 overflow-hidden">
            Actions
          </div>
        </div>
        {value.map((item, index) => (
          <div
            className="flex w-full border-x  border-t border-slate-200 dark:border-gray-700/60 border-b-0"
            key={item.name + index}
          >
            <input
              name="name"
              className="flex-1 py-3 px-4 border border-y-0 border-r-0 border-l-gray-50 dark:border-gray-700/60 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none"
              placeholder="Enter Property Name.."
              onChange={(e) => handleInputChange(e, index)}
              value={item.name}
              type="text"
              key={"name" + item.name + index}
              autoFocus
            />
            <input
              name="value"
              className="flex-1 py-3 px-4 border-y-0 border-r-0 border-slate-200 dark:border-gray-700/60 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-l outline-none "
              placeholder={`Enter Property ${header.value}...`}
              onChange={(e) => handleInputChange(e, index)}
              value={item.value}
              type="text"
              key={"value" + item.name + index}
            ></input>
            <button
              className="w-24 border-l border-slate-200 dark:border-gray-700/60 bg-white dark:bg-gray-800 flex justify-center items-center"
              onClick={(e) => handleItemPairDelete(e, index)}
              type="button"
            >
              <IoClose className="text-2xl text-red-700" />
            </button>
          </div>
        ))}

        <div className="flex w-full border border-slate-200 bg-white dark:bg-gray-800 dark:border-gray-700/60 rounded-b-lg">
          <input
            className="flex-1 py-3 px-4 outline-none border-none text-gray-700 dark:text-gray-300 bg-transparent"
            name="name"
            placeholder={`Enter ${header.name} Here...`}
            onChange={handleNewRecordChange}
            value={newRecord.name}
          ></input>

          <input
            className="flex-1 py-3 px-4 border  border-y-0 border-r-0 border-l border-slate-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 bg-transparent outline-none"
            name="value"
            placeholder={`Enter ${header.value} Here...`}
            onChange={handleNewRecordChange}
            value={newRecord.value}
          ></input>
          <button
            className="w-24 border-l flex justify-center items-center border-slate-200 dark:border-gray-700/60"
            onClick={handleAddNewRecord}
            type="submit"
            disabled={isRecordPairEmpty(newRecord)}
          >
            <IoAdd
              className={`text-2xl ${
                isRecordPairEmpty(newRecord)
                  ? "text-gray-500"
                  : "text-green-700"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const isRecordPairEmpty = (inputPair: TableRecordType | null): boolean => {
  if (!inputPair) return true;
  if (!inputPair.name || inputPair.name === "") return true;
  if (!inputPair.value || inputPair.value === "") return true;
  return false;
};
export default TableInput;

import { TextField } from "@mui/material";
import SectionBlock from "@shared/components/section-block";

const OrderTaxes = () => {
  return (
    <SectionBlock title="Tax Summary:" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 ">
          <div className="text-sm">SGST: </div>
          <div className="flex gap-3">
            <TextField
              size="small"
              className="w-[90px]"
              prefix="#"
              placeholder="18%"
              disabled
            />
            <TextField
              size="small"
              className="w-[90px]"
              prefix="#"
              placeholder="100$"
              disabled
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">CGST: </div>
          <div className="flex gap-3">
            <TextField
              size="small"
              className="w-[90px]"
              prefix="#"
              placeholder="18%"
              disabled
            />
            <TextField
              size="small"
              className="w-[90px]"
              prefix="#"
              placeholder="100$"
              disabled
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">IGST: </div>
          <div className="flex gap-3">
            <TextField
              size="small"
              className="max-w-[90px]"
              prefix="#"
              placeholder="18%"
              disabled
            />
            <TextField
              size="small"
              className="max-w-[90px]"
              prefix="#"
              placeholder="100$"
              disabled
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 ">
          <div className="font-bold">Total GST: </div>
          <div className="flex items-center">
            <div className=" text-gray-900 dark:text-gray-100 w-[90px]">
              18%
            </div>
            <div className=" text-gray-900 dark:text-gray-100 w-[90px]">
              12.21$
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">Cess: </div>
          <div className="flex gap-3">
            <TextField
              size="small"
              className="max-w-[90px]"
              prefix="#"
              placeholder="0%"
            />
            <TextField
              size="small"
              className="max-w-[90px]"
              prefix="#"
              placeholder="0$"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 ">
          <div className="font-bold">Total Taxes: </div>
          <div className="flex items-center">
            <div className=" text-gray-900 dark:text-gray-100 w-[90px]">
              18%
            </div>
            <div className=" text-gray-900 dark:text-gray-100 w-[90px]">
              12.21$
            </div>
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default OrderTaxes;

import { Control, useWatch } from "react-hook-form";
import TextFieldControlled from "@shared/components/form/text-field-controlled.component";
import DateFieldControlled from "@shared/components/form/date-field-controlled.component";
import SelectFieldControlled from "@shared/components/form/select-field-controlled.component";
import { PaymentMethod } from "@shared/enums/payment-method.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";
import { useEffect } from "react";

interface PaymentDetailsCardProps {
  control: Control<any>;
  /** When the user marks status = Completed, auto-fill amountPaid with this. */
  finalAmount: number;
  setValue: (name: string, value: unknown) => void;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  control,
  finalAmount,
  setValue,
}) => {
  const status = useWatch({ control, name: "payment.status" });
  const amountPaid = useWatch({ control, name: "payment.amountPaid" });

  // If user picks Paid, default the amountPaid to the live final amount.
  useEffect(() => {
    if (
      status === PaymentStatus.COMPLETED &&
      (!amountPaid || amountPaid === 0)
    ) {
      setValue("payment.amountPaid", finalAmount);
    }
    if (status === PaymentStatus.PENDING) {
      setValue("payment.amountPaid", 0);
    }
  }, [status, finalAmount, amountPaid, setValue]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectFieldControlled
        label="Payment Method"
        name="payment.paymentMethod"
        control={control}
        options={Object.values(PaymentMethod)}
      />

      <SelectFieldControlled
        label="Status"
        name="payment.status"
        control={control}
        options={Object.values(PaymentStatus)}
      />

      <TextFieldControlled
        label="Amount Paid"
        name="payment.amountPaid"
        control={control}
        type="number"
        placeholder="0.00"
        slotProps={{
          htmlInput: {
            min: 0,
            className:
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0",
          },
        }}
      />

      <DateFieldControlled
        label="Payment Date"
        name="payment.paymentDate"
        control={control}
      />

      <TextFieldControlled
        label="Transaction ID"
        name="payment.transactionId"
        control={control}
        className="col-span-2"
        placeholder="e.g. UPI/TXN ref"
      />

      <TextFieldControlled
        label="Notes"
        name="payment.notes"
        control={control}
        className="col-span-2"
        multiline
        rows={2}
      />
    </div>
  );
};

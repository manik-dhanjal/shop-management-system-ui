import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useGetOrderPopulated } from "@features/order/hooks/use-get-order-populated.hook";
import { useShop } from "@shared/hooks/shop.hook";
import { amountInWords } from "@features/order/utils/pricing.util";
import { TaxType } from "@shared/enums/tax-type.enum";

const money = (n: number) =>
  `₹${(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PrintOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { activeShop } = useShop();
  const { data: order, isLoading } = useGetOrderPopulated(orderId || "");

  useEffect(() => {
    if (!orderId) navigate("/404");
  }, [orderId, navigate]);

  if (isLoading || !order) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center py-16">
        <CircularProgress />
        <div>Loading invoice…</div>
      </div>
    );
  }

  const customer: any = order.customer;
  const items: any[] = order.items as any[];
  const taxes = order.billing.taxes || [];
  const hasIgst = taxes.some((t) => t.type === TaxType.IGST);

  return (
    <div className="text-gray-900 print:p-0 max-w-5xl mx-auto">
      <div className="print:hidden mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard/order/all")}
          className="text-sm text-gray-600 dark:text-gray-100 hover:underline"
        >
          ← Back to orders
        </button>
        <button
          onClick={() => window.print()}
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          Print Invoice
        </button>
      </div>

      <div className="border border-gray-200 p-8 rounded-lg print:border-0 print:p-0 bg-white">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {activeShop?.name || "Invoice"}
            </h1>
            {activeShop?.location && (
              <div className="text-sm text-gray-600 mt-1">
                {activeShop.location.address}, {activeShop.location.city},{" "}
                {activeShop.location.state} {activeShop.location.pinCode}
              </div>
            )}
            {(activeShop as any)?.gstDetails?.gstin && (
              <div className="text-sm text-gray-600">
                GSTIN: {(activeShop as any).gstDetails.gstin}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm uppercase tracking-wider text-gray-500">
              {order.invoiceType}
            </div>
            <div className="font-mono text-lg font-semibold">
              {order.invoiceId}
            </div>
            <div className="text-sm text-gray-600">
              {new Date(
                (order as any).orderDate || order.createdAt,
              ).toLocaleDateString("en-IN")}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <div className="text-xs uppercase text-gray-500 mb-2">Bill To</div>
            <div className="font-semibold">{customer?.name}</div>
            <div className="text-sm text-gray-600">{customer?.phone}</div>
            {customer?.email && (
              <div className="text-sm text-gray-600">{customer.email}</div>
            )}
            {customer?.gstin && (
              <div className="text-sm text-gray-600">
                GSTIN: {customer.gstin}
              </div>
            )}
            {customer?.billingAddress && (
              <div className="text-sm text-gray-600 mt-1">
                {customer.billingAddress.address},{" "}
                {customer.billingAddress.city}, {customer.billingAddress.state}{" "}
                {customer.billingAddress.pinCode}
              </div>
            )}
          </div>
          {customer?.shippingAddress && (
            <div>
              <div className="text-xs uppercase text-gray-500 mb-2">
                Ship To
              </div>
              <div className="text-sm text-gray-600">
                {customer.shippingAddress.address},{" "}
                {customer.shippingAddress.city},{" "}
                {customer.shippingAddress.state}{" "}
                {customer.shippingAddress.pinCode}
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <table className="w-full text-sm border-t border-b border-gray-200 mb-6">
          <thead>
            <tr className="text-xs uppercase text-gray-500">
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-left">HSN</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Discount</th>
              <th className="py-2 text-right">Taxable</th>
              {hasIgst ? (
                <th className="py-2 text-right">IGST</th>
              ) : (
                <>
                  <th className="py-2 text-right">CGST</th>
                  <th className="py-2 text-right">SGST</th>
                </>
              )}
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => {
              const cgst = it.taxes?.find((t: any) => t.type === TaxType.CGST);
              const sgst = it.taxes?.find((t: any) => t.type === TaxType.SGST);
              const igst = it.taxes?.find((t: any) => t.type === TaxType.IGST);
              return (
                <tr key={idx} className="border-t border-gray-100 align-top">
                  <td className="py-2">{idx + 1}</td>
                  <td className="py-2">
                    <div className="font-medium">{it.product?.name}</div>
                    <div className="text-xs text-gray-500">
                      {it.product?.sku}
                    </div>
                  </td>
                  <td className="py-2">{it.product?.hsn}</td>
                  <td className="py-2 text-right">
                    {it.quantity} {it.product?.measuringUnit}
                  </td>
                  <td className="py-2 text-right">
                    {money(it.product?.sellPrice || 0)}
                  </td>
                  <td className="py-2 text-right">{money(it.discount || 0)}</td>
                  <td className="py-2 text-right">{money(it.taxableValue)}</td>
                  {hasIgst ? (
                    <td className="py-2 text-right">
                      {money(igst?.amount || 0)}{" "}
                      <span className="text-xs text-gray-500">
                        ({igst?.rate || 0}%)
                      </span>
                    </td>
                  ) : (
                    <>
                      <td className="py-2 text-right">
                        {money(cgst?.amount || 0)}{" "}
                        <span className="text-xs text-gray-500">
                          ({cgst?.rate || 0}%)
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        {money(sgst?.amount || 0)}{" "}
                        <span className="text-xs text-gray-500">
                          ({sgst?.rate || 0}%)
                        </span>
                      </td>
                    </>
                  )}
                  <td className="py-2 text-right font-medium">
                    {money(it.totalPrice)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-72 text-sm space-y-1">
            <Row label="Sub Total" value={money(order.billing.subTotal)} />
            <Row
              label="Total Discount"
              value={money(order.billing.discounts)}
            />
            {taxes.map((t) => (
              <Row
                key={`${t.type}-${t.rate}`}
                label={`${t.type} ${t.rate}%`}
                value={money(t.amount)}
              />
            ))}
            <Row label="Round Off" value={money(order.billing.roundOff)} />
            <div className="border-t my-2" />
            <Row
              label="Grand Total"
              value={money(order.billing.finalAmount)}
              emphasis
            />
          </div>
        </div>

        <div className="text-xs italic text-gray-600 mb-6 border-t pt-3">
          Amount in words: {amountInWords(order.billing.finalAmount)}
        </div>

        {/* Payment + notes */}
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Payment</div>
            <div>
              {order.payment.paymentMethod} — {order.payment.status}
            </div>
            <div className="text-gray-600">
              Paid: {money(order.payment.amountPaid)} on{" "}
              {new Date(order.payment.paymentDate).toLocaleDateString("en-IN")}
            </div>
            {order.payment.transactionId && (
              <div className="text-gray-600">
                Txn: {order.payment.transactionId}
              </div>
            )}
          </div>
          {order.description && (
            <div>
              <div className="text-xs uppercase text-gray-500 mb-1">Notes</div>
              <div className="text-gray-600 whitespace-pre-wrap">
                {order.description}
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 mt-10 border-t pt-4">
          This is a computer-generated invoice.
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  emphasis?: boolean;
}> = ({ label, value, emphasis }) => (
  <div
    className={`flex justify-between ${
      emphasis ? "font-semibold text-base" : "text-gray-600"
    }`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default PrintOrderPage;

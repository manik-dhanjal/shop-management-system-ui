import { Box, Chip, Divider, Paper, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ShopGstDetails } from "@features/shop/interface/shop.interface";

interface Props {
  gstDetails: ShopGstDetails;
}

export function GstVerifyPanel({ gstDetails }: Props) {
  const verified = !!gstDetails.verifiedAt;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        {verified ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : (
          <ErrorOutlineIcon color="warning" fontSize="small" />
        )}
        <Typography variant="subtitle2" fontWeight={600}>
          {verified ? "Verified from GST Portal" : "Not yet verified"}
        </Typography>
        {verified && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
            Last verified:{" "}
            {new Date(gstDetails.verifiedAt!).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        )}
      </Box>

      {!verified && (
        <Typography variant="body2" color="text.secondary">
          Verify your GSTIN via OTP to auto-fill and lock the fields below.
        </Typography>
      )}

      {verified && (
        <>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <InfoRow label="Legal Name" value={gstDetails.legalName} />
            <InfoRow label="Trade Name" value={gstDetails.tradeName} />
            <InfoRow label="PAN" value={gstDetails.panCardNumber} />
            <InfoRow
              label="Status"
              value={
                gstDetails.status && (
                  <Chip
                    size="small"
                    label={gstDetails.status}
                    color={gstDetails.status === "Active" ? "success" : "warning"}
                  />
                )
              }
            />
            <InfoRow label="Constitution" value={gstDetails.constitutionOfBusiness} />
            <InfoRow label="State" value={gstDetails.state} />
            <InfoRow
              label="Reg. Date"
              value={
                gstDetails.registrationDate
                  ? new Date(gstDetails.registrationDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : undefined
              }
            />
            <InfoRow
              label="e-Invoice"
              value={
                gstDetails.einvoiceApplicable != null
                  ? gstDetails.einvoiceApplicable
                    ? "Applicable"
                    : "Not Applicable"
                  : undefined
              }
            />
          </Box>
          {gstDetails.address && (
            <Box sx={{ mt: 1 }}>
              <InfoRow label="Address" value={gstDetails.address} />
            </Box>
          )}
          {gstDetails.natureOfBusiness?.length && (
            <Box sx={{ mt: 1 }}>
              <InfoRow
                label="Nature of Business"
                value={gstDetails.natureOfBusiness.join(", ")}
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | React.ReactNode;
}) {
  if (!value) return null;
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {typeof value === "string" ? (
        <Typography variant="body2">{value}</Typography>
      ) : (
        <Box sx={{ mt: 0.25 }}>{value}</Box>
      )}
    </Box>
  );
}

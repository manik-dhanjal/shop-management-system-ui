import { Control, Controller } from "react-hook-form";
import { useEffect, useMemo, useState, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetPaginatedSuppliers } from "@features/shop/hooks/use-get-paginated-suppliers.hook";

export type SupplierOption = {
  label: string;
  value: string;
};

interface SupplierDropdownControlledProps {
  control: Control<any>;
  name: string;
  label: string;
  className?: string;
  size?: "small" | "medium";
}

const MAX_OPTIONS_TO_LOAD = 10;
export const SupplierDropdownControlled = ({
  control,
  name,
  label,
  className,
  size = "small",
}: SupplierDropdownControlledProps) => {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<SupplierOption[]>([]);

  const paginatedSupplier = useGetPaginatedSuppliers(MAX_OPTIONS_TO_LOAD, page);

  const isLoading = paginatedSupplier.isPending;
  const hasMore = !!paginatedSupplier.data?.pagination.nextPage;

  /**
   * Append suppliers on page change
   */
  useEffect(() => {
    if (!paginatedSupplier.data) return;

    const newOptions = paginatedSupplier.data.docs.map((s) => ({
      label: s.name,
      value: s._id,
    }));

    setOptions((prev) => {
      const map = new Map(prev.map((o) => [o.value, o]));
      newOptions.forEach((o) => map.set(o.value, o));
      return Array.from(map.values());
    });
  }, [paginatedSupplier.data]);

  /**
   * Scroll handler for dropdown
   */
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const listboxNode = event.currentTarget;
      const nearBottom =
        listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 20;

      if (nearBottom && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading],
  );

  return (
    <>
      {/* <CircularProgress size={18} />{" "} */}
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field, fieldState }) => {
          const selectedOption = useMemo(() => {
            if (!field.value) return null;
            return options.find((o) => o.value === field.value) ?? null;
          }, [field.value, options]);

          return (
            <Autocomplete
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                "& .MuiAutocomplete-popupIndicator": {
                  borderRadius: "8px",
                },
              }}
              size={size}
              className={className}
              options={options}
              loading={isLoading}
              value={selectedOption}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(a, b) => a.value === b.value}
              onChange={(_, option) => field.onChange(option?.value ?? null)}
              ListboxProps={{
                onScroll: handleScroll,
              }}
              renderOption={(props, option) => {
                const { key, ...rest } = props as any;
                return (
                  <Box key={key} component="li" {...rest}>
                    {option.label}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  inputRef={field.ref}
                  error={fieldState.invalid || paginatedSupplier.isError}
                  helperText={
                    fieldState.error?.message ||
                    paginatedSupplier.error?.message
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderGroup={(params) => <>{params.children}</>}
            />
          );
        }}
      />
    </>
  );
};

export default SupplierDropdownControlled;

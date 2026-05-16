import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { IoCube, IoPencil, IoTrash, IoSearch } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";
import { Pagination } from "@shared/components/pagination.component";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";
import { usePaginatedProducts } from "@features/product/hooks/use-get-paginated-products.hook";
import { useDeleteProduct } from "@features/product/hooks/use-delete-product.hook";
import { useProductStats } from "@features/product/hooks/use-product-stats.hook";
import { Product } from "@features/product/interfaces/product.interface";

const MAX_PRODUCTS_ON_SINGLE_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const money = (n: number | undefined) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const AllProductPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState("");
  const [brandFilter, setBrandFilter] = useState<string | "">("");
  const [hsnFilter, setHsnFilter] = useState<string | "">("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const searchPending = searchInput !== debouncedSearch;

  const filter = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (brandFilter) f.brand = brandFilter;
    if (hsnFilter) f.hsn = hsnFilter;
    if (debouncedSearch) {
      f.$or = [
        { name: { $regex: debouncedSearch, $options: "i" } },
        { sku: { $regex: debouncedSearch, $options: "i" } },
        { brand: { $regex: debouncedSearch, $options: "i" } },
      ];
    }
    return Object.keys(f).length ? f : undefined;
  }, [brandFilter, hsnFilter, debouncedSearch]);

  const paginatedProducts = usePaginatedProducts(
    MAX_PRODUCTS_ON_SINGLE_PAGE,
    currentPage,
    filter as any,
  );
  const { mutate: deleteProduct } = useDeleteProduct();
  const { data: stats, isLoading: statsLoading } = useProductStats();

  const data = paginatedProducts.data;
  const rows = data?.docs ?? [];

  const brandOptions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((product) => product.brand).filter(Boolean)),
      ).sort(),
    [rows],
  );

  const hsnOptions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((product) => product.hsn).filter(Boolean)),
      ).sort(),
    [rows],
  );

  const totalStock = useMemo(
    () => rows.reduce((sum, product) => sum + (product.stock ?? 0), 0),
    [rows],
  );

  const outOfStockCount = useMemo(
    () => rows.filter((product) => !product.stock).length,
    [rows],
  );

  const totalInventoryValue = useMemo(
    () =>
      rows.reduce(
        (sum, product) =>
          sum + (product.stock ?? 0) * (product.purchasePrice ?? 0),
        0,
      ),
    [rows],
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProductDelete = async (productId: string) => {
    deleteProduct(productId);
    setProductToDelete(null);
  };

  const handleProductEdit = (productId: string) => {
    navigate(`/dashboard/product/${productId}/edit`);
  };

  if (paginatedProducts.isError) {
    return <div className="p-6 text-red-600">Failed to load products</div>;
  }

  if (!data) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        No products found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Products
        </h1>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/product/add")}
        >
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Products"
          value={stats?.totalProducts ?? data.pagination.totalRecords}
          loading={statsLoading}
        />
        <KpiCard
          label="Total Stock"
          value={stats?.totalStock ?? totalStock}
          loading={statsLoading}
        />
        <KpiCard
          label="Out of Stock"
          value={stats?.outOfStockCount ?? outOfStockCount}
          loading={statsLoading}
        />
        <KpiCard
          label="Stock Value"
          value={
            stats
              ? money(stats.totalInventoryValue)
              : money(totalInventoryValue)
          }
          loading={statsLoading}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex flex-wrap gap-3 items-center">
        <TextField
          size="small"
          placeholder="Search name / SKU / brand"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearch className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: searchPending ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : null,
            },
          }}
          className="min-w-[280px] flex-1"
          sx={{ minWidth: 280, flex: 1 }}
        />
        <TextField
          select
          size="small"
          label="Brand"
          value={brandFilter}
          onChange={(e) => {
            setBrandFilter(e.target.value as string | "");
            setCurrentPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          className="min-w-[180px]"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {brandOptions.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="HSN"
          value={hsnFilter}
          onChange={(e) => {
            setHsnFilter(e.target.value as string | "");
            setCurrentPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          className="min-w-[180px]"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {hsnOptions.map((hsn) => (
            <MenuItem key={hsn} value={hsn}>
              {hsn}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 relative">
        {paginatedProducts.isFetching && !paginatedProducts.isLoading && (
          <LinearProgress
            className="absolute top-0 left-0 right-0 rounded-t-xl"
            sx={{ height: 2 }}
          />
        )}

        {paginatedProducts.isLoading ? (
          <div className="flex justify-center py-16">
            <CircularProgress />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-center">Brand</th>
                  <th className="p-2 text-center">SKU</th>
                  <th className="p-2 text-center">HSN</th>
                  <th className="p-2 text-right">Purchase Price</th>
                  <th className="p-2 text-right">Sell Price</th>
                  <th className="p-2 text-center">Stock</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {rows.map((product) => (
                  <tr key={product._id}>
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
                          {product.images.length === 0 ? (
                            <IoCube className="text-xl text-gray-300 dark:text-gray-500" />
                          ) : (
                            <img
                              className="object-cover w-full h-full"
                              src={product.images[0].url}
                              width="40"
                              height="40"
                              alt={product.images[0].alt}
                            />
                          )}
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center text-gray-800 dark:text-gray-100">
                      {product.brand}
                    </td>
                    <td className="p-2 text-center text-gray-800 dark:text-gray-100">
                      {product.sku}
                    </td>
                    <td className="p-2 text-center text-gray-800 dark:text-gray-100">
                      {product.hsn || "—"}
                    </td>
                    <td className="p-2 text-right text-green-600">
                      {money(product.purchasePrice)}
                    </td>
                    <td className="p-2 text-right text-green-600">
                      {money(product.sellPrice)}
                    </td>
                    <td className="p-2 text-center">
                      {product.stock ? (
                        <span>
                          {product.stock} {product.measuringUnit}
                        </span>
                      ) : (
                        <span className="text-gray-400">Out of stock</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-4 text-lg">
                        <button onClick={() => handleProductEdit(product._id)}>
                          <IoPencil />
                        </button>
                        <button onClick={() => setProductToDelete(product)}>
                          <IoTrash className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.pagination.totalPages > 1 && (
              <Pagination
                activePage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onChange={handlePageChange}
                maxPageToShow={5}
              />
            )}
          </div>
        )}
      </div>

      {productToDelete && (
        <Modal title="Delete Product" onClose={() => setProductToDelete(null)}>
          <div className="space-y-3 text-sm">
            <p>
              Are you sure you want to delete <b>{productToDelete.name}</b>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setProductToDelete(null)} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={() => handleProductDelete(productToDelete._id)}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const KpiCard: React.FC<{
  label: string;
  value?: string | number;
  loading?: boolean;
}> = ({ label, value, loading }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
    <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
      {label}
    </div>
    {loading ? (
      <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
    ) : (
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-1">
        {value ?? "—"}
      </div>
    )}
  </div>
);

export default AllProductPage;

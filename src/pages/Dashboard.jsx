import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import Navbar from "../components/Navbar";
import ProductTable from "../components/ProductTable";
import { generateProductPDF } from "../utils/pdfGenerator";

const CATEGORY_OPTIONS = [
  "All",
  "Curtains",
  "Sofa Cover",
  "Bedsheet",
  "Pillow Cover",
  "Tracks",
  "Accessories",
];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Combined Search + Category Filtering
  const filtered = products.filter((p) => {
    const matchSearch = p.productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  // Clear selected when filters change
  useEffect(() => {
    setSelected([]);
  }, [search, selectedCategory]);

  const handleGeneratePDF = async () => {
    if (!selected.length) return;

    setPdfGenerating(true);
    try {
      await generateProductPDF(selected);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setPdfGenerating(false);
    }
  };

  const clearSelection = () => {
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Product Dashboard
              </h1>
              <p className="text-slate-600">
                Search, filter by category, select and generate PDF
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {products.length}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Products</p>
                  <p className="text-xl font-bold text-slate-800">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Category Filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideIn">
          {/* Search */}
          <div className="relative group md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 shadow-sm cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={handleGeneratePDF}
              disabled={!selected.length || pdfGenerating}
              className="flex items-center space-x-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {pdfGenerating ? "Generating PDF..." : `Generate PDF (${selected.length})`}
            </button>

            {selected.length > 0 && (
              <button
                onClick={clearSelection}
                className="px-5 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300"
              >
                Clear Selection
              </button>
            )}
          </div>

          {search || selectedCategory !== "All" ? (
            <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg">
              Showing <span className="font-bold">{filtered.length}</span>{" "}
              product{filtered.length !== 1 ? "s" : ""}
            </div>
          ) : null}
        </div>

        {/* Loading / Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-pulse">
            <p className="text-slate-700 text-lg font-medium">Loading products...</p>
          </div>
        ) : (
          <ProductTable
            products={filtered}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </main>
    </div>
  );
}

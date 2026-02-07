import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import Navbar from "../components/Navbar";
import ProductTable from "../components/ProductTable";
import { generateProductPDF } from "../utils/pdfGenerator";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
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

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const handleGeneratePDF = async () => {
    if (selected.length === 0) return;
    
    setPdfGenerating(true);
    try {
      await generateProductPDF(selected);
      // Success animation
      const btn = document.querySelector('.pdf-btn');
      if (btn) {
        btn.classList.add('success-animation');
        setTimeout(() => btn.classList.remove('success-animation'), 2000);
      }
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
        {/* Header Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Product Dashboard
              </h1>
              <p className="text-slate-600">
                Select products to generate detailed PDF reports
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{products.length}</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Products</p>
                    <p className="text-xl font-bold text-slate-800">Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-8 space-y-6 animate-slideIn">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 shadow-sm hover:shadow-md bg-white text-slate-800 placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGeneratePDF}
                disabled={!selected.length || pdfGenerating}
                className="pdf-btn flex items-center justify-center space-x-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {pdfGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Generate PDF ({selected.length})</span>
                  </>
                )}
              </button>
              
              {selected.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="flex items-center space-x-2 px-5 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear Selection</span>
                </button>
              )}
            </div>
            
            {search && (
              <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg">
                Found <span className="font-bold">{filtered.length}</span> matching product{filtered.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-pulse">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 animate-pulse"></div>
            </div>
            <p className="text-slate-700 text-lg font-medium">Loading products...</p>
            <p className="text-slate-500 mt-2">Please wait a moment</p>
          </div>
        ) : (
          <ProductTable
            products={filtered}
            selected={selected}
            setSelected={setSelected}
          />
        )}

        {/* Footer Tips */}
      
      </main>
    </div>
  );
}
import { useState } from "react";

export default function ProductTable({ products, selected, setSelected }) {
  const [selectAll, setSelectAll] = useState(false);

  const toggle = (p) => {
    setSelected((prev) =>
      prev.find((x) => x._id === p._id)
        ? prev.filter((x) => x._id !== p._id)
        : [...prev, p]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected([...products]);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-fadeIn">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Products <span className="text-slate-500">({products.length})</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll && products.length > 0}
                onChange={handleSelectAll}
                className="hidden"
              />
              <label
                htmlFor="selectAll"
                className={`flex items-center cursor-pointer transition-all duration-200 ${
                  selectAll ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 transition-all duration-200 ${
                  selectAll 
                    ? "bg-blue-500 border-blue-500" 
                    : "border-slate-300 hover:border-blue-400"
                }`}>
                  {selectAll && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">Select All</span>
              </label>
            </div>
            <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Selected: <span className="font-bold">{selected.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table - Responsive */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>Select</span>
                </div>
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                Product Name
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                Size
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                Unit
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                Rate
              </th>
              
            </tr>
          </thead>
          
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-medium">No products found</p>
                    <p className="text-slate-400">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p, index) => {
                const isSelected = selected.find(x => x._id === p._id);
                return (
                  <tr 
                    key={p._id} 
                    className={`border-b border-slate-100 transition-all duration-300 hover:bg-blue-50 transform hover:scale-[1.002] ${
                      isSelected ? 'bg-blue-50' : ''
                    } animate-slideIn`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <div 
                          onClick={() => toggle(p)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500' 
                              : 'border-slate-300 hover:border-blue-400'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        
                        <div>
                          <p className="font-medium text-slate-800">{p.productName}</p>
                         
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200">
                        {p.size}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-slate-700 font-medium">{p.perUnit}</span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ₹{parseFloat(p.rate).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500">INR</span>
                      </div>
                    </td>
                    
                   
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
     
    </div>
  );
}
import React, { useState } from "react";
import { Plus, X } from "react-feather";

const PagesPanel = ({
  pages,
  activePage,
  onChangePage,
  onAddPage,
  onRemovePage,
}) => {
  const [newPageName, setNewPageName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      onAddPage(newPageName);
      setNewPageName("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="border-b border-black-200 bg-amber-50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm text-gray-800">Pages</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-amber-600 hover:text-amber-800 p-1 rounded-full hover:bg-amber-100 transition"
        >
          <Plus size={18} />
        </button>
      </div>

      {showAddForm && (
        <div className="flex mb-3 gap-1">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            className="flex-1 p-2 border border-black-300 rounded text-sm focus:ring-2 focus:ring-amber-600 focus:border-black-600 transition"
            onKeyDown={(e) => e.key === "Enter" && handleAddPage()}
          />
          <button
            onClick={handleAddPage}
            className="bg-amber-600 text-white px-3 rounded text-sm hover:bg-amber-700 transition"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => onChangePage(page.id)}
            className={`
              flex items-center justify-between p-2 rounded cursor-pointer
              ${
                page.id === activePage
                  ? "bg-amber-100 text-amber-700"
                  : "hover:bg-amber-50"
              }
            `}
          >
            <span className="truncate text-sm text-gray-800">{page.title}</span>
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePage(page.id);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PagesPanel);

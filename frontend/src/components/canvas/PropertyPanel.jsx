import React, { useEffect } from "react";
import { Lock, Unlock, Eye, EyeOff } from "react-feather";

const PropertyPanel = ({ selectedElement, onChange }) => {
  // Add this useEffect to log changes for debugging
  useEffect(() => {
    console.log("Selected element updated:", selectedElement);
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="w-64 bg-white border-l p-4 flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          Select an element to edit properties
        </p>
      </div>
    );
  }

  const handleChange = (key, value) => {
    const updatedElement = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        [key]: value,
      },
    };
    onChange(updatedElement); // Make sure this is being called
  };

  const handleStyleChange = (key, value) => {
    const updatedElement = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        style: {
          ...selectedElement.data?.style,
          [key]: value,
        },
      },
    };
    onChange(updatedElement);
  };
  const handleArrayChange = (key, index, value) => {
    const newArray = [...selectedElement.data[key]];
    newArray[index] = value;
    handleChange(key, newArray);
  };

  const handleAddArrayItem = (key, defaultValue) => {
    handleChange(key, [...(selectedElement.data[key] || []), defaultValue]);
  };

  const handleRemoveArrayItem = (key, index) => {
    const newArray = [...selectedElement.data[key]];
    newArray.splice(index, 1);
    handleChange(key, newArray);
  };

  const toggleVisibility = () => {
    handleChange("visible", !selectedElement.data.visible);
  };

  const toggleLock = () => {
    const locked = !selectedElement.data.locked;
    handleChange("locked", locked);
    onChange({
      ...selectedElement,
      draggable: !locked,
      data: {
        ...selectedElement.data,
        locked,
      },
    });
  };

  const renderCommonProperties = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Element Properties</h4>
        <div className="flex gap-2">
          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            title={selectedElement.data.visible === false ? "Show" : "Hide"}
          >
            {selectedElement.data.visible === false ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
          <button
            onClick={toggleLock}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            title={selectedElement.data.locked ? "Unlock" : "Lock"}
          >
            {selectedElement.data.locked ? (
              <Lock size={16} />
            ) : (
              <Unlock size={16} />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={selectedElement.data.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />
      </div>

      {["rectangle", "circle", "button", "header", "loginForm"].includes(
        selectedElement.type
      ) && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={selectedElement.data?.style?.fill || "#ffffff"}
            onChange={(e) => handleStyleChange("fill", e.target.value)}
            className="w-full h-8"
          />
        </div>
      )}
    </div>
  );

  const renderTypeSpecificProperties = () => {
    switch (selectedElement.type) {
      case "text":
        return (
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={selectedElement.data.text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
              className="w-full p-2 border rounded text-sm"
              rows={3}
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <input
                  type="number"
                  value={selectedElement.data?.style?.fontSize || 16}
                  onChange={(e) =>
                    handleStyleChange("fontSize", parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={selectedElement.data?.style?.color || "#000000"}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={selectedElement.data.src || ""}
              onChange={(e) => handleChange("src", e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        );

      case "header":
        return (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="text"
                value={selectedElement.data.logo || ""}
                onChange={(e) => handleChange("logo", e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="/logo.png"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Navigation Items
              </label>
              <div className="space-y-2">
                {selectedElement.data.navItems?.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("navItems", index, e.target.value)
                      }
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <button
                      onClick={() => handleRemoveArrayItem("navItems", index)}
                      className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayItem("navItems", "New Item")}
                  className="text-blue-500 text-xs hover:bg-blue-50 p-1 rounded"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>
        );

      case "loginForm":
        return (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={selectedElement.data.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedElement.data.showLogo || false}
                onChange={(e) => handleChange("showLogo", e.target.checked)}
                className="mr-2"
                id="showLogo"
              />
              <label htmlFor="showLogo" className="text-xs text-gray-700">
                Show Logo
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={selectedElement.data.buttonText || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Button Color
              </label>
              <input
                type="color"
                value={selectedElement.data.buttonColor || "#3b82f6"}
                onChange={(e) => handleChange("buttonColor", e.target.value)}
                className="w-full h-8"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Form Fields
              </label>
              <div className="space-y-2">
                {selectedElement.data.fields?.map((field, index) => (
                  <div key={index} className="border p-2 rounded">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium">{field.label}</span>
                      <button
                        onClick={() => {
                          const newFields = [...selectedElement.data.fields];
                          newFields.splice(index, 1);
                          handleChange("fields", newFields);
                        }}
                        className="text-red-500 text-xs hover:bg-red-50 p-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...selectedElement.data.fields];
                        newFields[index].label = e.target.value;
                        handleChange("fields", newFields);
                      }}
                      placeholder="Label"
                      className="w-full p-1 border rounded text-xs mb-1"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newFields = [...selectedElement.data.fields];
                        newFields[index].type = e.target.value;
                        handleChange("fields", newFields);
                      }}
                      className="w-full p-1 border rounded text-xs mb-1"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="password">Password</option>
                      <option value="number">Number</option>
                    </select>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => {
                        const newFields = [...selectedElement.data.fields];
                        newFields[index].placeholder = e.target.value;
                        handleChange("fields", newFields);
                      }}
                      placeholder="Placeholder"
                      className="w-full p-1 border rounded text-xs"
                    />
                  </div>
                ))}
                <button
                  onClick={() =>
                    handleAddArrayItem("fields", {
                      label: "New Field",
                      type: "text",
                      placeholder: "",
                    })
                  }
                  className="text-blue-500 text-xs hover:bg-blue-50 p-1 rounded"
                >
                  + Add Field
                </button>
              </div>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={selectedElement.data.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={selectedElement.data?.style?.textColor || "#ffffff"}
                onChange={(e) => handleStyleChange("textColor", e.target.value)}
                className="w-full h-8"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                value={selectedElement.data?.style?.width || 100}
                onChange={(e) =>
                  handleStyleChange("width", parseInt(e.target.value))
                }
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                value={selectedElement.data?.style?.height || 100}
                onChange={(e) =>
                  handleStyleChange("height", parseInt(e.target.value))
                }
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-30 bg-amber-100 border-l-1 border-black-300 p-4 overflow-y-auto">
  <h3 className="font-medium text-sm mb-3 flex items-center text-gray-800 border-b border-amber-200 pb-2">
    <span className="capitalize">{selectedElement.type}</span>
    <span className="ml-auto text-xs text-gray-500">
      ID: {selectedElement.id.slice(0, 4)}
    </span>
  </h3>

  {renderCommonProperties()}
  {renderTypeSpecificProperties()}
</div>
  );
};

export default React.memo(PropertyPanel);

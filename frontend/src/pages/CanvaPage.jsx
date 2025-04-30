import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ArrowLeft, Grid, Layers, Settings } from "react-feather";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import CanvasComponent from "../components/canvas/CanvasComponent";
import useCanvasData from "../hooks/useCanvasData";
import UsersPanel from "../components/canvas/UsersPanel";
import PagesPanel from "../components/canvas/PagesPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import LayoutPresets from "../components/canvas/LayoutPresets";
import LayersPanel from "../components/canvas/LayersPanel";

const CanvaPage = () => {
  const { canvaId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [activeRightPanel, setActiveRightPanel] = useState("pages");

  const {
    pages,
    activePage,
    setActivePage,
    nodes,
    edges,
    loading,
    error,
    collaborators,
    saveChanges,
    addPage,
    removePage,
  } = useCanvasData(canvaId, user?.email);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const handleAddPreset = (type) => {
    // This would be connected to your canvas component's add node functionality
    console.log("Adding preset:", type);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gray-50">
      <header
  className="
    flex items-center justify-between p-4
    bg-gradient-to-br from-amber-900 via-amber-700 to-amber-500
    shadow-lg
  "
>
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-white hover:text-amber-200 transition-colors"
  >
    <ArrowLeft className="mr-2" />
    Back
  </button>

  <h1 className="text-xl font-semibold text-white">
    Primer Parcial Software
  </h1>

  <UsersPanel collaborators={collaborators} currentUser={user.email} />
</header>
        <div className="flex flex-1 overflow-hidden">
          <CanvasComponent
            canvaId={canvaId}
            initialNodes={nodes}
            initialEdges={edges}
            onSave={saveChanges}
          />

          <div className="w-80 bg-white border-l flex flex-col">
            <div className="flex border-b">
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeRightPanel === "pages"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveRightPanel("pages")}
              >
                <Grid size={16} className="inline mr-1" />
                Pages
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeRightPanel === "layers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveRightPanel("layers")}
              >
                <Layers size={16} className="inline mr-1" />
                Layers
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeRightPanel === "presets"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveRightPanel("presets")}
              >
                <Settings size={16} className="inline mr-1" />
                Presets
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeRightPanel === "pages" && (
                <PagesPanel
                  pages={pages}
                  activePage={activePage}
                  onChangePage={setActivePage}
                  onAddPage={addPage}
                  onRemovePage={removePage}
                />
              )}
              {activeRightPanel === "layers" && (
                <LayersPanel
                  nodes={nodes}
                  selectedElement={null} // You'll need to connect this to your canvas state
                  onSelect={(id) => console.log("Select", id)} // Implement selection
                  onReorder={(from, to) => console.log("Reorder", from, to)} // Implement reordering
                />
              )}
              {activeRightPanel === "presets" && (
                <LayoutPresets onAddPreset={handleAddPreset} />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CanvaPage;

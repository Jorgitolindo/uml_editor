import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase-confing/Firebase";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import CanvaList from "../components/canva/CanvaList";
import CanvaModals from "../components/canva/BoardModals";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import { ChartBarIcon, PlusIcon } from "@heroicons/react/24/outline";

const CanvaListPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [canvas, setCanvas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCanva, setCurrentCanva] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ description: "", email: "" });

  // Obtener tableros del usuario
  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const canvasQuery = query(
          collection(db, "canvas"),
          where("participants", "array-contains", user.email)
        );

        const snapshot = await getDocs(canvasQuery);
        const canvasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isHost: doc.data().ownerId === user.uid,
        }));

        setCanvas(canvasData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching canvas:", err);
        setError("Error al cargar los tableros");
        setLoading(false);
      }
    };

    // Verificar autenticación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchCanvas();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Crear nuevo tablero
  const refreshCanvas = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const canvasQuery = query(
        collection(db, "canvas"),
        where("participants", "array-contains", user.email)
      );

      const snapshot = await getDocs(canvasQuery);
      const canvasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isHost: doc.data().ownerId === user.uid,
      }));

      setCanvas(canvasData);
    } catch (err) {
      console.error("Error refreshing canvas:", err);
      setError("Error al actualizar los tableros");
    }
  }, [auth]);

  // En handleCreateCanva, después de crear:
  const handleCreateCanva = async () => {
    setIsSubmitting(true);
    try {
      const newCanva = {
        description: formData.description,
        ownerId: user.uid,
        ownerName: user.displayName || user.email.split("@")[0],
        participants: [user.email],
        pages: [
          // 👈 crea al menos una página inicial
          {
            id: "main",
            title: "Principal",
            nodes: [],
            edges: [],
          },
        ],
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      await addDoc(collection(db, "canvas"), newCanva);
      await refreshCanvas(); // Forzar actualización

      Swal.fire({
        icon: "success",
        title: "¡Tablero creado!",
        text: `"${formData.description}" fue creado exitosamente`,
        timer: 2000,
        background: "#fff",
        confirmButtonColor: "#2563eb",
      });

      closeModals();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar tablero
  const handleUpdateCanva = async () => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "canvas", currentCanva.id), {
        description: formData.description,
        lastUpdated: new Date(),
      });

      setCanvas((prev) =>
        prev.map((b) =>
          b.id === currentCanva.id
            ? { ...b, description: formData.description }
            : b
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Cambios guardados!",
        text: "El tablero fue actualizado correctamente",
        timer: 1500,
        background: "#fff",
        confirmButtonColor: "#2563eb",
      });

      closeModals();
    } catch (error) {
      console.error("Error updating canva:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "No se pudo modificar el tablero",
        background: "#fff",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar tablero
  const handleDeleteCanva = async (canvaId) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar tablero?",
        text: "¡Esta acción no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#fff",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "canvas", canvaId));
        setCanvas((prev) => prev.filter((b) => b.id !== canvaId));

        Swal.fire({
          title: "¡Eliminado!",
          text: "El tablero fue eliminado.",
          icon: "success",
          background: "#fff",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Error deleting canva:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message || "No se pudo eliminar el tablero",
        background: "#fff",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // Invitar usuario
  const handleInviteUser = async () => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "canvas", currentCanva.id), {
        participants: arrayUnion(formData.email),
        lastUpdated: new Date(),
      });

      Swal.fire({
        title: "¡Invitación exitosa!",
        text: "El usuario fue agregado al tablero",
        icon: "success",
        background: "#fff",
        confirmButtonColor: "#2563eb",
      });

      closeModals();
    } catch (error) {
      console.error("Error al invitar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al invitar",
        text: error.message || "No se pudo invitar al tablero",
        background: "#fff",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar modales
  const closeModals = () => {
    setModalType(null);
    setCurrentCanva(null);
    setFormData({ description: "", email: "" });
  };

  // Copiar enlace del tablero
  const handleCopyLink = () => {
    navigator.clipcanva.writeText(
      `${window.location.origin}/canvas/${currentCanva?.id}`
    );
    Swal.fire({
      icon: "success",
      title: "Enlace copiado",
      showConfirmButton: false,
      timer: 1500,
      background: "#fff",
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-[calc(100vh)] bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8 text-blue-600" />
              <span>Mis Tableros</span>
            </h1>
            <p className="text-gray-500 mt-1">
              {canvas.length} {canvas.length === 1 ? "tablero" : "tableros"}{" "}
              encontrados
            </p>
          </div>

          <button
            onClick={() => setModalType("create")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm sm:text-base font-semibold">
              Nuevo Tablero
            </span>
          </button>
        </div>

        <CanvaList
          canvas={canvas}
          onEdit={(canva) => {
            setCurrentCanva(canva);
            setFormData({ description: canva.description });
            setModalType("edit");
          }}
          onDelete={handleDeleteCanva}
          onInvite={(canva) => {
            setCurrentCanva(canva);
            setModalType("invite");
          }}
        />

        <CanvaModals
          modalType={modalType}
          closeModals={closeModals}
          formData={formData}
          setFormData={setFormData}
          currentCanva={currentCanva}
          handleSubmit={{
            create: handleCreateCanva,
            edit: handleUpdateCanva,
            invite: handleInviteUser,
          }}
          handleCopyLink={handleCopyLink}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CanvaListPage;

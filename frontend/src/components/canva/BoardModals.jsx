import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { QRCodeCanvas } from 'qrcode.react';
import PropTypes from 'prop-types';

const CanvaModals = ({
  modalType,
  closeModals,
  formData,
  setFormData,
  currentCanva,
  handleSubmit,
  handleCopyLink,
  isSubmitting,
}) => {
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = (e, type) => {
    e.preventDefault();
    if (type === 'invite' && !isValidEmail(formData.email)) return;
    handleSubmit[type]();
  };

  return (
    <Dialog
      open={modalType !== null}
      onClose={closeModals}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Fondo con blur */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-lg mx-auto rounded-3xl bg-white shadow-2xl overflow-hidden">

          {/* Encabezado */}
          <div className="relative bg-gradient-to-r from-amber-800 to-amber-600 p-6">
            <DialogTitle className="text-2xl font-bold text-center text-white">
              {modalType === 'create' && 'Nuevo Tablero'}
              {modalType === 'edit'   && 'Editar Tablero'}
              {modalType === 'invite' && 'Invitar Colaboradores'}
            </DialogTitle>
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar modal"
              title="Cerrar modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-8 space-y-6">
            {modalType !== 'invite' ? (
              <form onSubmit={(e) => handleFormSubmit(e, modalType)}>
                <label
                  htmlFor="canva-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre del tablero
                </label>
                <input
                  id="canva-name"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition"
                  placeholder="Ej: Diagrama de clases del proyecto"
                  required
                  minLength={3}
                  maxLength={50}
                  autoFocus
                />

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      flex items-center gap-2 px-5 py-2 rounded-xl text-white transition
                      ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-900 hover:to-amber-700 shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962
                             0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <CheckIcon className="w-5 h-5" />
                    )}
                    {modalType === 'create' ? (isSubmitting ? 'Creando…':'Crear') : (isSubmitting ? 'Guardando…':'Guardar')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <QRCodeCanvas
                    value={`${window.location.origin}/canvas/${currentCanva?.id}`}
                    size={180}
                    level="H"
                    includeMargin
                    fgColor="#1e40af"
                  />
                </div>

                <button
                  onClick={handleCopyLink}
                  className="
                    w-full flex items-center justify-center gap-2 px-5 py-3
                    bg-gradient-to-r from-amber-800 to-amber-600
                    hover:from-amber-900 hover:to-amber-700
                    text-white rounded-xl shadow-md hover:shadow-lg
                    transition
                  "
                >
                  <LinkIcon className="w-5 h-5" />
                  Copiar enlace del tablero
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">O</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleFormSubmit(e, 'invite')}>
                  <label
                    htmlFor="invite-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Invitar por correo electrónico
                  </label>
                  <div className="mt-2 flex gap-3">
                    <input
                      id="invite-email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`
                        flex-1 px-4 py-3 border rounded-xl transition
                        ${formData.email && !isValidEmail(formData.email)
                          ? 'border-red-500'
                          : 'border-gray-300'
                        }
                        focus:ring-2 focus:ring-amber-600 focus:border-amber-600
                      `}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValidEmail(formData.email)}
                      className={`
                        px-5 py-3 rounded-xl text-white flex items-center gap-2
                        transition
                        ${isSubmitting || !isValidEmail(formData.email)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-900 hover:to-amber-700 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      <PlusIcon className="w-5 h-5" />
                      Invitar
                    </button>
                  </div>
                  {!isValidEmail(formData.email) && formData.email && (
                    <p className="mt-1 text-xs text-red-500">
                      Ingresa un email válido
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

CanvaModals.propTypes = {
  modalType: PropTypes.oneOf(['create', 'edit', 'invite', null]),
  closeModals: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    description: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  currentCanva: PropTypes.object,
  handleSubmit: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    invite: PropTypes.func,
  }).isRequired,
  handleCopyLink: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default CanvaModals;

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
  // Validar email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Manejar envío de formulario
  const handleFormSubmit = (e, type) => {
    e.preventDefault();
    if (type === 'invite' && !isValidEmail(formData.email)) {
      return;
    }
    handleSubmit[type]();
  };

  return (
    <Dialog
      open={modalType !== null}
      onClose={closeModals}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Fondo del modal con blur */}
      <div className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm" aria-modal="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Encabezado del Modal con gradiente */}
          <div className="bg-gradient-to-r from-amber-800 to-amber-600 p-5 rounded-t-lg">
  <div className="flex justify-between items-center">
    <DialogTitle className="text-xl font-bold text-white">
      {modalType === 'create' && 'Nuevo Tablero'}
      {modalType === 'edit'   && 'Editar Tablero'}
      {modalType === 'invite' && 'Invitar Colaboradores'}
    </DialogTitle>
    <button
      onClick={closeModals}
      className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
      aria-label="Cerrar modal"
      title="Cerrar modal"
    >
      <XMarkIcon className="w-6 h-6" />
    </button>
  </div>
</div>

          {/* Contenido del Modal */}
          <div className="p-6">
            {modalType !== 'invite' ? (
              <form onSubmit={(e) => handleFormSubmit(e, modalType)}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="canva-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del tablero
                    </label>
                    <input
                      id="canva-name"
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        description: e.target.value,
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-green-500 transition-all"
                      placeholder="Ej: Diagrama de clases del proyecto"
                      required
                      minLength="3"
                      maxLength="50"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-all ${isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 shadow-md'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {modalType === 'create' ? 'Creando...' : 'Guardando...'}
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-5 h-5" />
                          {modalType === 'create' ? 'Crear' : 'Guardar'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-center">
                  <QRCodeCanvas
                    value={`${window.location.origin}/canvas/${currentCanva?.id}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#1e40af"
                  />
                </div>

                <div className="space-y-4">
                <button
  onClick={handleCopyLink}
  className="
    w-full flex items-center justify-center gap-2
    px-4 py-3
    bg-gradient-to-r from-amber-800 to-amber-600
    hover:from-amber-900 hover:to-amber-700
    text-white
    rounded-lg
    shadow-md hover:shadow-lg
    transition-all duration-200
  "
>
  <LinkIcon className="w-5 h-5" />
  Copiar enlace del tablero
</button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-modal="true">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">O</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700">
                      Invitar por correo electrónico
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="invite-email"
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`flex-1 px-4 py-3 border ${formData.email && !isValidEmail(formData.email)
                            ? 'border-red-500'
                            : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-green-500 transition-all`}
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleFormSubmit(e, 'invite')}
                        disabled={isSubmitting || !isValidEmail(formData.email)}
                        className={`px-4 py-3 rounded-lg text-white flex items-center gap-2 transition-all ${isSubmitting || !isValidEmail(formData.email)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 shadow-md'
                          }`}
                      >
                        <PlusIcon className="w-5 h-5" />
                        Invitar
                      </button>
                    </div>
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="text-red-500 text-xs mt-1">Ingresa un email válido</p>
                    )}
                  </div>
                </div>
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

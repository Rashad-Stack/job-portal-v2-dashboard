import Button from "../button/Button";

const AlertDialog = ({ isOpen, onClose, title, message, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-opacity-50 z-50 mt-10">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <Button label={cancelLabel} variant="secondary" onClick={onClose} />
          <Button label={confirmLabel} variant="danger" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
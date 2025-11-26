'use client';

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const confirmButtonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400',
    warning: 'bg-orange-600 hover:bg-orange-700 focus-visible:outline-orange-600 dark:bg-orange-500 dark:hover:bg-orange-400',
    success: 'bg-green-600 hover:bg-green-700 focus-visible:outline-green-600 dark:bg-green-500 dark:hover:bg-green-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-gray-300 bg-transparent px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-3 text-base font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${confirmButtonStyles[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

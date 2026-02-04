'use client';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, title }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-[90%] sm:max-w-sm rounded-2xl p-5 sm:p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Delete Chat?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            You are about to delete <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{title}"</span>. This action cannot be undone.
          </p>
        </div>
        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
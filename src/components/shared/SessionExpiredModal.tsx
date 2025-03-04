'use client';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onSignIn: () => void;
  onDismiss: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onSignIn,
  onDismiss,
}: SessionExpiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Session Expired</h2>
        <p className="mb-4">Your session has expired. Please sign in again.</p>
        <div className="flex gap-4">
          <button
            onClick={onSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={onDismiss}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
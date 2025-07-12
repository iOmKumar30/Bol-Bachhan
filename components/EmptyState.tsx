const EmptyState = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-10 sm:px-6 lg:px-8 bg-white">
      <div className="flex justify-center items-center flex-1">
        <div className="flex flex-col text-center items-center max-w-md">
          <h3 className="text-lg font-semibold text-orange-600">
            Start a conversation
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Select a chat to start messaging.
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-4">
        🔒 End to end encrypted
      </div>
    </div>
  );
};

export default EmptyState;

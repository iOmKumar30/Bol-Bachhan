"use client";

const ConvoSkeleton = () => {
  return (
    <div className="w-full flex items-center space-x-4 p-3 rounded-xl bg-white animate-pulse shadow-sm">
      {/* Avatar Skeleton */}
      <div className="h-10 w-10 rounded-full bg-gray-400" />

      {/* Text Skeleton */}
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/5 bg-gray-300 rounded" />
        <div className="h-2 w-4/5 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default ConvoSkeleton;

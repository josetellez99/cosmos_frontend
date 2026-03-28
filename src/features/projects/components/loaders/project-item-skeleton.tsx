export const ProjectItemSkeleton = () => (
  <div className="p-5 rounded-[28px] border border-gray-100 bg-white animate-pulse flex flex-col gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-200" />
      <div className="flex-1 min-w-0">
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-10 bg-gray-200 rounded-md" />
    </div>
    <div className="h-0.5 w-full bg-gray-200 rounded-full" />
  </div>
)

function BlogSkeleton() {
  return (
    <div className="animate-pulse flex flex-col w-full md:flex-row justify-between gap-6 md:gap-16 p-4">
      <div className="border-2 rounded w-full md:w-[70%] p-5 space-y-4">
        <div className="h-10 bg-gray-300 rounded w-3/4"></div> {/* Title */}
        
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div> {/* Avatar */}
          <div className="flex flex-col space-y-1">
            <div className="h-4 bg-gray-300 rounded w-24"></div> {/* Author name */}
            <div className="h-3 bg-gray-300 rounded w-16"></div> {/* Date */}
          </div>
        </div>

        <div className="h-64 bg-gray-300 rounded"></div> {/* Featured image */}

        <div className="h-6 bg-gray-300 rounded w-24"></div> {/* Badge */}

        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>

      <div className="border-2 rounded w-full md:w-[30%] p-4 h-fit space-y-4">
        <div className="h-8 bg-gray-300 rounded w-32"></div> {/* Related Blogs header */}
        <div className="h-6 bg-gray-300 rounded"></div> {/* Related blog items */}
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
export default BlogSkeleton;
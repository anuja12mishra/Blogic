import { Skeleton } from "@/components/ui/skeleton";

function BlogSkeleton() {
    return (
        <div className='max-w-7xl mx-auto px-4 py-8'>
            <div className='flex flex-col lg:flex-row gap-12'>
                {/* Main Content Area */}
                <article className='flex-1 space-y-8'>
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Blog Title */}
                    <div className="space-y-4">
                        <Skeleton className="h-10 md:h-12 lg:h-16 w-full" />
                        <Skeleton className="h-10 md:h-12 lg:h-16 w-3/4" />
                    </div>

                    {/* Meta Info: Author & Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-border/50">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-6 w-12" />
                                <Skeleton className="h-6 w-12" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    </div>

                    {/* Liked By */}
                    <div className="flex items-center gap-3 -mt-4 mb-2 px-2">
                        <Skeleton className="h-6 w-48" />
                    </div>

                    {/* Featured Image */}
                    <Skeleton className="relative aspect-video rounded-2xl shadow-xl" />

                    {/* Blog Content */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>

                    {/* Discussion Section */}
                    <section className='mt-16 pt-12 border-t border-border/50 space-y-6'>
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </div>
                    </section>
                </article>

                {/* Sidebar: Related Blogs */}
                <aside className='w-full lg:w-[320px] shrink-0'>
                    <div className="sticky top-28 space-y-8">
                        <div>
                            <div className="mb-6">
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="h-20 w-24 shrink-0 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default BlogSkeleton;
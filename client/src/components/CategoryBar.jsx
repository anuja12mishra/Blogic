import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import { RouteIndex, RouteBlogByCategory } from '@/helpers/RouteName';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryBar = () => {
  const { pathname } = useLocation();
  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
    { method: 'GET', credentials: 'include' }
  );

  const categories = categoriesData?.categories || [];

  // Don't show on admin/auth pages if needed, but for now we show it everywhere as requested
  // for /blog or index pages.
  const isBlogRelatedPage = pathname === '/' || pathname.startsWith('/blog') || pathname.startsWith('/category');

  if (!isBlogRelatedPage) return null;

  return (
    <div className="w-full bg-background/80 backdrop-blur-md sticky top-20 z-10 border-b border-border/50 py-2">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap no-scrollbar scroll-smooth py-2">
          <Link 
            to={RouteIndex}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
              pathname === '/' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            All Posts
          </Link>
          
          {categoriesLoading ? (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full bg-muted shrink-0 flex items-center justify-center" />
            ))
          ) : (
            categories.map((category) => {
              const isActive = pathname.includes(`/category/${category.slug}`);
              return (
                <Link
                  key={category._id}
                  to={RouteBlogByCategory(category.slug)}
                  className={`flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 border border-transparent shrink-0 ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-secondary text-secondary-foreground hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })
          )}
          {/* Spacer for scroll-padding-right */}
          <div className="min-w-[40px] h-1" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;

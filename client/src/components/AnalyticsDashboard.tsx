import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import Loading from '@/components/Loading';
import { Eye, Heart, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RouteSingleBlogDetails } from '@/helpers/RouteName';

interface BlogAnalytics {
    _id: string;
    title: string;
    slug: string;
    views: number;
    likeCount: number;
    category: {
        slug: string;
    };
    categorySlug?: string; // Some API responses might use this
}

interface AnalyticsData {
    analytics: {
        totalViews: number;
        totalLikes: number;
        topViewedBlogs: BlogAnalytics[];
        topLikedBlogs: BlogAnalytics[];
    };
}

interface AnalyticsDashboardProps {
    userId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId }) => {
    const { data, loading, error } = useFetch<AnalyticsData>(
        `${getEnv('VITE_API_URL')}/api/user/analytics/${userId}`,
        { method: 'GET', credentials: 'include' }
    );

    if (loading) return <div className="flex justify-center p-8"><Loading /></div>;
    if (error) return <div className="text-destructive p-4 text-center">Error loading analytics</div>;

    const analytics = data?.analytics;

    if (!analytics) return null;

    const maxViews = analytics.topViewedBlogs.length > 0 ? (analytics.topViewedBlogs[0].views || 1) : 1;
    const maxLikes = analytics.topLikedBlogs.length > 0 ? (analytics.topLikedBlogs[0].likeCount || 1) : 1;

    return (
        <div className="space-y-8 mt-12 bg-background/50 p-6 rounded-3xl border border-border/50">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground/90">Your Engagement Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden group border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                    <CardContent className="pt-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Total Audience Reach</p>
                                <h3 className="text-4xl font-black tabular-nums">{analytics.totalViews.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground font-medium">Lifetime blog views</p>
                            </div>
                            <div className="p-4 bg-primary/20 rounded-2xl shadow-inner backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                                <Eye className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden group border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-pink-500/5 to-transparent" />
                    <CardContent className="pt-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-pink-500 uppercase tracking-[0.2em]">Community Love</p>
                                <h3 className="text-4xl font-black tabular-nums">{analytics.totalLikes.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground font-medium">Total blog reactions</p>
                            </div>
                            <div className="p-4 bg-pink-500/20 rounded-2xl shadow-inner backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                                <Heart className="w-8 h-8 text-pink-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <Card className="border border-border/40 shadow-sm bg-card/30 backdrop-blur-md rounded-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            Most Popular Stories
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        {analytics.topViewedBlogs.length > 0 ? (
                            analytics.topViewedBlogs.map((blog, index) => (
                                <div key={blog._id} className="group flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <Link 
                                            to={RouteSingleBlogDetails(blog.category?.slug || 'uncategorized', blog.slug, blog._id)} 
                                            className="font-bold text-foreground/80 hover:text-primary transition-colors line-clamp-1 leading-tight"
                                        >
                                            <span className="text-muted-foreground/50 mr-2">0{index + 1}</span>
                                            {blog.title}
                                        </Link>
                                        <span className="flex items-center justify-center text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full tabular-nums">
                                            {blog.views} <span className="text-[10px] uppercase ml-1 opacity-70">reads</span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${(blog.views / maxViews) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <TrendingUp className="w-12 h-12 text-muted/20 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground font-medium italic">Your stories are waiting for their first readers.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border border-border/40 shadow-sm bg-card/30 backdrop-blur-md rounded-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-pink-500/10 rounded-lg">
                                <Award className="w-5 h-5 text-pink-500" />
                            </div>
                            Fan Favorites
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        {analytics.topLikedBlogs.length > 0 ? (
                            analytics.topLikedBlogs.map((blog, index) => (
                                <div key={blog._id} className="group flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <Link 
                                            to={RouteSingleBlogDetails(blog.categorySlug || 'uncategorized', blog.slug, blog._id)} 
                                            className="font-bold text-foreground/80 hover:text-pink-500 transition-colors line-clamp-1 leading-tight"
                                        >
                                            <span className="text-muted-foreground/50 mr-2">0{index + 1}</span>
                                            {blog.title}
                                        </Link>
                                        <span className="text-xs font-black text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full tabular-nums">
                                            {blog.likeCount} <span className="text-[10px] uppercase ml-1 opacity-70">likes</span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-pink-500 to-pink-500/60 transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${(blog.likeCount / maxLikes) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <Award className="w-12 h-12 text-muted/20 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground font-medium italic">Engagement is just a blog post away!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

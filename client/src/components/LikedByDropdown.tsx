import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const getTimeAgo = (timestamp: string) => {
    const now = moment();
    const created = moment(timestamp);
    const minutes = now.diff(created, 'minutes');
    const hours = now.diff(created, 'hours');
    const days = now.diff(created, 'days');

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
};

interface Like {
    _id: string;
    createdAt: string;
    authorId: {
        _id: string;
        name: string;
        avatar: string;
    };
}

interface AllLikeData {
    like: Like[];
}

interface LikedByDropdownProps {
    props: string; // blogId
}

const LikedByDropdown: React.FC<LikedByDropdownProps> = ({ props: blogId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: AllLikeData, loading } = useFetch<AllLikeData>(
        `${getEnv('VITE_API_URL')}/api/like/get-like-by-blog/${blogId}`,
        { method: 'GET', credentials: 'include' },
        [blogId]
    );

    const likeData = AllLikeData?.like || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading || likeData.length === 0) return null;

    const displayLikes = likeData.slice(0, 3);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2.5 hover:opacity-80 transition-all cursor-pointer"
            >
                <div className="flex -space-x-3 overflow-hidden">
                    {displayLikes.map((like, i) => (
                        <Avatar 
                            key={like._id} 
                            className={cn(
                                "size-7 border-2 border-background ring-1 ring-border/20 transition-transform group-hover:translate-x-1",
                                i === 0 ? "z-30" : i === 1 ? "z-20" : "z-10"
                            )}
                        >
                            <AvatarImage referrerPolicy="no-referrer" src={like.authorId?.avatar} className="object-cover" />
                            <AvatarFallback className="text-[10px] font-bold bg-purple-100 text-purple-700">
                                {like.authorId?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>

                <div className="text-sm font-medium text-foreground/80 group-hover:text-purple-600 transition-colors">
                    <span className="hidden sm:inline">
                        Liked by <span className="font-bold text-foreground">{likeData[0]?.authorId?.name}</span>
                        {likeData.length > 1 &&
                            <> and <span className="font-bold text-foreground">{likeData.length - 1} other{likeData.length - 1 > 1 ? 's' : ''}</span></>}
                    </span>
                    <span className="inline sm:hidden font-bold text-foreground">
                        {likeData.length} like{likeData.length > 1 ? 's' : ''}
                    </span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-3 w-64 z-50 origin-top-left bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="p-1 max-h-72 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted">
                        <div className="px-3 py-2 border-b border-border/50">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Liked by</h4>
                        </div>
                        {likeData.map((like) => (
                            <div 
                                key={like._id} 
                                className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition-colors group/item"
                            >
                                <Avatar className="size-8">
                                    <AvatarImage referrerPolicy="no-referrer" src={like.authorId?.avatar} className="object-cover" />
                                    <AvatarFallback className="text-xs font-bold">
                                        {like.authorId?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-semibold truncate group-hover/item:text-purple-600 transition-colors">
                                        {like.authorId?.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                        {getTimeAgo(like.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikedByDropdown;

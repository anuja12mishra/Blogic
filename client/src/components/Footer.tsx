import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            bLogic
                        </span>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs text-center md:text-left text-balance">
                            Sharing stories, insights, and perspectives through modern storytelling and vibrant community.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <a href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</a>
                        <a href="/blogs" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Blogs</a>
                        <a href="/about" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</a>
                        <a href="/contact" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs text-center">
                        © {new Date().getFullYear()} bLogic. All rights reserved. Built with ❤️ for the community.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Privacy Policy</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import React from 'react'
import { FaLinkedin, FaHeart, FaArrowUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'


function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <h3 className="text-2xl font-bold text-foreground">
                b<span className='text-purple-600 font-extrabold'>L</span>ogic
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Elevating the digital discourse through deep-dive analysis, creative storytelling, and professional insights. A space for thinkers and builders.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
               <a href="https://www.linkedin.com/in/anuja-mishra-1193a2245/" className="hover:text-blue-500 transition-colors">
                  <FaLinkedin size={22} />
               </a>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-between h-full space-y-8 md:space-y-0 text-left md:text-right">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 active:scale-95"
            >
              <FaArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
              <span className="font-semibold text-sm">Back to Top</span>
            </button>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm flex items-center gap-1 md:justify-end">
                © 2025 bLogic. Crafted with <FaHeart className="text-red-500 animate-pulse" size={12} /> by <span className="font-semibold text-foreground">Anuj</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
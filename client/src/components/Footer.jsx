import React from 'react'
import { FaLinkedin, FaHeart, FaArrowUp } from 'react-icons/fa'


function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="text-white">
      {/* Bottom Bar */}
      <div className="border-t border-purple-200 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="space-y-2">
              <h3 className="flex text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black bg-clip-text">
                b<p className='text-purple-600 font-extrabold'>L</p>ogic
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sharing thoughts, ideas, and stories through engaging content.
                Join our community of readers and writers.
              </p>
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
                  © 2025 Your Blog. Made with
                  <FaHeart className="text-red-500 mx-1" size={12} />
                  by <a href="https://www.linkedin.com/in/anuja-mishra-1193a2245/" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300 ml-1">Anuj</a>
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/in/anuja-mishra-1193a2245/" className="text-gray-500 hover:text-blue-400 transition-colors duration-300">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>

            {/* Back to Top Button */}
            <div>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium shadow-md hover:shadow-lg"
            >
              <FaArrowUp size={12} />
              <span>Back to Top</span>
            </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'

const PageLoader = () => {
  return (
        <div className="flex items-center justify-center h-screen bg-transparent">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Rotating Outer Ring */}
                <div className="absolute w-40 h-40 rounded-full border-4 border-primary border-t-indigo-400 animate-spin"></div>

                {/* Static Inner Circle */}
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center animate-[pulse_2.5s_ease-in-out_infinite] shadow-[0_0_35px_rgba(99,102,241,0.6)]">
                    <span className="text-white font-semibold tracking-widest">
                        SKYFER
                    </span>
                </div>
            </div>
        </div>
  );
}

export default PageLoader
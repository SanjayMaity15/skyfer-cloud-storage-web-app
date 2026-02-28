import React from "react";

const ButtonLoader = ({text}) => {
    return (
        <div className="flex gap-2 justify-center items-center">
            <h3>{text}</h3>
            <div className="animate-spin rounded-full h-5 w-5 border-t-3 border-b-3 border-white"></div>
        </div>
    );
};

export default ButtonLoader;

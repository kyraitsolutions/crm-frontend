import React from "react";

interface ButtonWithTitleProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    tooltipClassName?: string;
    disabled?: boolean,
    position?: "top" | "bottom" | "left" | "right";
}

const positionClasses = {
    top: "top-1 left-56 -translate-x-1/2 mb-2",
    bottom: "top- left -translate-x-1/2 mt-5 ml-10",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ButtonWithTitle = ({
    title,
    children,
    className = "",
    onClick,
    disabled = false,
    tooltipClassName = "",
    position = "bottom",
}: ButtonWithTitleProps) => {
    return (
        <div className={`group`}>
            <button
                disabled={disabled}
                onClick={onClick}
                className={className}>
                {children}
            </button>

            {title && <div
                className={`
                    absolute z-50 whitespace-nowrap shadow-xl border
                    bg-white px-3 py-2 text-xs text-gray-600
                    opacity-0 pointer-events-none
                    transition-opacity duration-200 rounded
                    group-hover:opacity-100
                    ${positionClasses[position]}
                    ${tooltipClassName}
                    `}
            >
                {title}
            </div>}
        </div>
    );
};

export default ButtonWithTitle;
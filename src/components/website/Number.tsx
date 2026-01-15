import { useEffect, useState } from "react";

interface CountUpProps {
    end: number;
    suffix?: string;
    duration?: number;
}

export const CountUp = ({ end, suffix = "", duration = 2000 }: CountUpProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16);

        const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(counter);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(counter);
    }, [end, duration]);

    return (
        <span className="text-4xl font-bold text-[#16A34A]">
            {count}
            {suffix}
        </span>
    );
}

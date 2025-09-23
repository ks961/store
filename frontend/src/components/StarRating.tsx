'use client';

import React, { useState } from "react";
import Star from "./Icons/Star";

export type StarRatingProps = {
    currentRating: number,
    setCurrentRating: (rating: number) => void
}

export default function StarRating({
    currentRating,
    setCurrentRating
}: StarRatingProps) {

    const [ hoveredIndex, setHoveredIndex ] = useState<number | null>(null);

    const rating = hoveredIndex !== null ? hoveredIndex + 1 : currentRating;

    function onMouseOver(event: React.MouseEvent<HTMLUListElement>) {
        const target = (event.target as HTMLElement).closest("li[data-index]");
        if(!target) return;
        const index = target.getAttribute("data-index");
        if(!index) return;
        
        setHoveredIndex(Number(index));
    }

    function onMouseLeave() {
        setHoveredIndex(null);
    }

    function handleOnClick(event: React.MouseEvent<HTMLLIElement>) {
        const index = event.currentTarget.getAttribute("data-index");
        if(!index) return;

        setCurrentRating(Number(index) + 1);
    }

    return (
        <div className="h-20 flex items-center gap-2 mt-2">
            <ul 
                onMouseOver={onMouseOver} 
                onMouseLeave={onMouseLeave}
                className="flex items-center gap-2"
            >
                {
                    Array.from({length: 5}).map((_, idx) => (
                        <React.Fragment key={`name-${idx+1}`}>
                            <li 
                                data-index={idx}
                                onClick={handleOnClick}
                                className="w-12 peer cursor-pointer list-none"
                            >
                                <Star 
                                    className={idx < rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-white"}
                                />
                            </li>
                        </React.Fragment>
                    ))
                }
            </ul>
        </div>
    );
}
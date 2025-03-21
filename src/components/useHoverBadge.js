import { useState } from 'react';

const useHoverBadge = ({ rows, getCountFunction, countLabel, idKey = 'id' }) => {
    const [hoveredRowId, setHoveredRowId] = useState(null);

    // Add these props to the table row
    const getRowProps = (row) => ({
        onMouseEnter: () => setHoveredRowId(row[idKey]),
        onMouseLeave: () => setHoveredRowId(null),
        className: "relative border-b hover:bg-gray-50"
    });

    // Get the badge element if the row is hovered
    const getBadge = (row) => {
        if (hoveredRowId === row[idKey]) {
            const count = getCountFunction(row[idKey]);
            if (count > 0) {
                return (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transition-opacity duration-200 ease-in-out">
                        {count} {countLabel}
                    </div>
                );
            }
        }
        return null;
    };

    return { getRowProps, getBadge };
};

export default useHoverBadge;
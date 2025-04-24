import React, {useState} from 'react';

const SiteMap = () => {
    // Define custom heights for each area as percentages (must add up to 100 minus corridor spaces)
    const leftAreaHeights = {
        areaL1: 15, // 15%
        areaL2: 15, // 20%
        areaL3: 20, // 30%
        areaL4: 30, // 15%
        areaL5: 20  // 20%
    };

    const rightAreaHeights = {
        areaR1: 15, // 25%
        areaR2: 15, // 30%
        areaR3: 50, // 15%
        areaR4: 20  // 30%
    };

    const itemSizes = {
        areaL1: { width: 60, height: 30 },
        areaL2: { width: 60, height: 30 },
        areaL3: { width: 60, height: 30 },
        areaL4: { width: 60, height: 30 },
        areaL5: { width: 60, height: 30 },
        areaR1: { width: 60, height: 30 },
        areaR2: { width: 60, height: 30 },
        areaR3: { width: 60, height: 30 },
        areaR4: { width: 60, height: 30 },
        area5: { width: 60, height: 30 },
        area6: { width: 60, height: 30 },
    };

    // Store the state of movable elements
    const [movableItems, setMovableItems] = useState({
        // Left side areas (5 areas)
        areaL1: [
            {id: 'itemL1-1', label: 'FCM Flashing', x: 60, y: 1},
            {id: 'itemL1-1', label: 'SCAS ICT', x: 50, y: 1},
            {id: 'itemL1-1', label: 'Offline ICT', x: 10, y: 70},
            {id: 'itemL1-1', label: 'ATE EVO', x: 20, y: 1},
        ],
        areaL2: [
            {id: 'itemL2-1', label: 'FCM ICT1', x: 90, y: 80},
            {id: 'itemL2-1', label: 'FCM ICT2', x: 82, y: 30},
            {id: 'itemL2-1', label: 'SFTP ICT', x: 10, y: 55},
            {id: 'itemL2-1', label: 'CCU ICT1', x: 30, y: 5},
            {id: 'itemL2-1', label: 'CCU ICT2', x: 30, y: 65},
            {id: 'itemL2-1', label: 'CCU Flashing', x: 40, y: 50},
        ],
        areaL3: [
            {id: 'itemL3-1', label: 'RLS Flashing', x: 90, y: 80},
            {id: 'itemL3-1', label: 'Asys1 ICT', x: 90, y: 10},
            {id: 'itemL3-1', label: 'Asys2 ICT', x: 80, y: 65},
            {id: 'itemL3-1', label: 'Grohman ICT', x: 60, y: 10},
            {id: 'itemL3-1', label: 'Asys3 ICT', x: 50, y: 80},
            {id: 'itemL3-1', label: 'ECU/MAN ICT', x: 0, y: 35},
        ],
        areaL4: [
            {id: 'itemL4-1', label: 'MLB ICT1', x: 90, y: 85},
            {id: 'itemL4-1', label: 'MLB ICT2', x: 82, y: 60},
            {id: 'itemL4-1', label: 'Flashing SAR', x: 72, y: 85},
            {id: 'itemL4-1', label: 'SAR ICT1', x: 72, y: 60},
            {id: 'itemL4-1', label: 'SAR ICT2', x: 72, y: 35},
            {id: 'itemL4-1', label: 'SAR ICT3', x: 72, y: 10},
            {id: 'itemL4-1', label: 'Flashing STAR', x: 50, y: 60},
            {id: 'itemL4-1', label: 'STAR ICT 1', x: 0, y: 45},
            {id: 'itemL4-1', label: 'STAR ICT 2', x: 8, y: 68},
            {id: 'itemL4-1', label: 'STAR ICT 3', x: 20, y: 12},
            {id: 'itemL4-1', label: 'STAR ICT 4', x: 20, y: 40},
        ],
        areaL5: [
            {id: 'itemL5-1', label: 'FSCM ICT', x: 20, y: 1},
            {id: 'itemL5-1', label: 'BMU ICT2', x: 73, y: 30},
            {id: 'itemL5-1', label: 'BMU ICT1', x: 82, y: 30},
            {id: 'itemL5-1', label: 'BMU Flashing', x: 64, y: 65},
            {id: 'itemL5-1', label: 'Frontend ICT', x: 40, y: 65},
        ],

        // Right side areas (4 areas)
        areaR1: [
            {id: 'itemR1-1', label: 'Knor Aeroflex', x: 80, y: 45},
            {id: 'itemR1-1', label: 'Knor Seica', x: 60, y: 45},
        ],
        areaR2: [
        ],
        areaR3: [
        ],
        areaR4: [
            {id: 'itemR4-1', label: 'EVSV ICT', x: 50, y:30},
            {id: 'itemR4-1', label: 'EVSV Flashing', x: 50, y:70},
        ],

        // External areas
        area5: [
            {id: 'item5-1', label: 'NEXTEER ICT1', x: 60, y: 20},
            {id: 'item5-2', label: 'NEXTEER ICT2', x: 60, y: 50},
            {id: 'item5-3', label: 'NEXTEER Flashing', x: 25, y: 80},
        ],
        area6: [
            {id: 'item6-1', label: 'MIX ICT1', x: 67, y: 95},
            {id: 'item6-2', label: 'MIX ICT3', x: 42, y: 75},
            {id: 'item6-3', label: 'MIX ICT4', x: 42, y: 47},
            {id: 'item6-2', label: 'Flashing 1', x: 70, y: 2},
            {id: 'item6-3', label: 'Flashing 2', x: 70, y: 30},
        ],
    });

    // Area colors for left side
    const leftAreaColors = [
        {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
            header: "bg-blue-100",
            item: "bg-blue-200"
        },
        {
            bg: "bg-cyan-50",
            border: "border-cyan-200",
            text: "text-cyan-800",
            header: "bg-cyan-100",
            item: "bg-cyan-200"
        },
        {
            bg: "bg-teal-50",
            border: "border-teal-200",
            text: "text-teal-800",
            header: "bg-teal-100",
            item: "bg-teal-200"
        },
        {
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-800",
            header: "bg-emerald-100",
            item: "bg-emerald-200"
        },
        {
            bg: "bg-purple-50",
            border: "border-purple-200",
            text: "text-purple-800",
            header: "bg-purple-100",
            item: "bg-purple-200"
        },
    ];

    // Area colors for right side
    const rightAreaColors = [
        {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
            header: "bg-green-100",
            item: "bg-green-200"
        },
        {
            bg: "bg-lime-50",
            border: "border-lime-200",
            text: "text-lime-800",
            header: "bg-lime-100",
            item: "bg-lime-200"
        },
        {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-800",
            header: "bg-amber-100",
            item: "bg-amber-200"
        },
        {
            bg: "bg-orange-50",
            border: "border-orange-200",
            text: "text-orange-800",
            header: "bg-orange-100",
            item: "bg-orange-200"
        },
    ];

    // Area names for left side
    const leftAreaNames = [
        "Assembly",
        "Production",
        "Engineering",
        "Development",
        "Quality Control"
    ];

    // Area names for right side
    const rightAreaNames = [
        "Testing",
        "Packaging",
        "Storage",
        "Logistics"
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Site Map</h1>

            <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Main floor layout with an outer corridor */}
                <div className="absolute inset-4 bg-gray-300 rounded p-2">
                    {/* Area 5 - Extends outside the main rectangle, on the left */}
                    <div
                        className="absolute left-0 top-[73%] w-[180px] h-[150px] bg-red-50 border border-red-200 rounded-l shadow-md transform -translate-x-[190px]">
                        <div className="font-medium text-red-800 p-20px bg-red-100 rounded text-left text-sm inline-block">
                            Area 5 - NEXTEER
                        </div>

                        {/* Extended corridor connecting Area 5 to the main building */}
                        <div className="absolute right-0 bottom-[10%] w-[60px] h-[8px] bg-gray-300 z-10"
                             style={{right: '-60px'}}></div>

                        {/* Movable items in Area 5 */}
                        <div className="relative h-[calc(100%-1.75rem)]">
                            {movableItems.area5.map(item => (
                                <div
                                    key={item.id}
                                    className="absolute bg-red-200 rounded p-1 shadow-sm text-xs text-center cursor-move hover:shadow-md transition-shadow"
                                    style={{
                                        top: `calc(${item.y}% - ${item.y >= 0 ? '1.5rem' : '0px'})`,
                                        left: `min(calc(100% - ${itemSizes.area5.width}px), max(0%, ${item.x}%))`,
                                        width: `${itemSizes.area5.width}px`,
                                        height: `${itemSizes.area5.height}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Area 6 - Extends outside the main rectangle, below Area 4 */}
                    <div
                        className="absolute right-0 bottom-0 w-[250px] h-[150px] bg-indigo-50 border border-indigo-200 rounded-b shadow-md transform translate-y-[160px]">
                        <div className="font-medium text-indigo-800 p-20px bg-indigo-100 rounded text-left text-sm inline-block">
                            Area 6 - Workshop
                        </div>

                        {/* Extended corridor connecting Area 6 to the main building */}
                        <div
                            className="absolute top-0 left-1/2 h-[30px] w-[250px] bg-gray-300 z-10 transform -translate-x-1/2 -translate-y-[30px]"></div>

                        {/* Movable items in Area 6 */}
                        <div className="relative h-[calc(100%-1.75rem)]">
                            {movableItems.area6.map(item => (
                                <div
                                    key={item.id}
                                    className="absolute bg-indigo-200 rounded p-1 shadow-sm text-xs text-center cursor-move hover:shadow-md transition-shadow"
                                    style={{
                                        top: `calc(${item.y}% - ${item.y >= 0 ? '1.5rem' : '0px'})`,
                                        left: `min(calc(100% - ${itemSizes.area6.width}px), max(0%, ${item.x}%))`,
                                        width: `${itemSizes.area6.width}px`,
                                        height: `${itemSizes.area6.height}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inner layout with all areas and corridors */}
                    <div className="relative w-full h-full bg-gray-100 rounded">
                        <div className="flex h-full">
                            {/* Left side with 5 areas */}
                            <div className="w-[55%] h-full flex flex-col">
                                {leftAreaColors.map((colors, index) => {
                                    const areaKey = `areaL${index + 1}`;
                                    return (
                                        <React.Fragment key={`leftArea${index}`}>
                                            {/* Add a thin corridor between areas (except before the first one) */}
                                            <div className="h-[1%] bg-gray-300 w-full flex items-center justify-center">
                                            </div>

                                            {/* Area with custom height */}
                                            <div
                                                className={`${colors.bg} border ${colors.border} ${index === 0 ? 'rounded-tl' : ''} ${index === 4 ? 'rounded-bl' : ''}`}
                                                style={{height: `${leftAreaHeights[areaKey]}%`}}
                                            >
                                                <div
                                                    className={`font-medium ${colors.text} p-5px ${colors.header} rounded text-left text-xs inline-block`}>
                                                    Area L{index + 1} - {leftAreaNames[index]}
                                                </div>

                                                {/* Movable items in this area */}
                                                <div className="relative h-[calc(100%-1.5rem)]">
                                                    {movableItems[areaKey].map(item => (
                                                        <div
                                                            key={item.id}
                                                            className={`absolute ${colors.item} rounded shadow-sm text-xs text-center cursor-move hover:shadow-md transition-shadow`}
                                                            style={{
                                                                top: `calc(${item.y}% - ${item.y >= 0 ? '1.5rem' : '0px'})`,
                                                                left: `min(calc(100% - ${itemSizes[areaKey].width}px), max(0%, ${item.x}%))`,
                                                                width: `${itemSizes[areaKey].width}px`,
                                                                height: `${itemSizes[areaKey].height}px`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            {item.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Center corridor */}
                            <div className="w-[2%] h-full bg-gray-300 flex items-center justify-center">
                                <div
                                    className="transform -rotate-90 text-gray-600 font-medium text-sm whitespace-nowrap">
                                    Main Corridor
                                </div>
                            </div>

                            {/* Right side with 4 areas */}
                            <div className="w-[45%] h-full flex flex-col">
                                {rightAreaColors.map((colors, index) => {
                                    const areaKey = `areaR${index + 1}`;
                                    return (
                                        <React.Fragment key={`rightArea${index}`}>
                                            {/* Add a thin corridor between areas (except before the first one) */}
                                            <div className="h-[1%] bg-gray-300 w-full flex items-center justify-center">
                                            </div>

                                            {/* Area with custom height */}
                                            <div
                                                className={`${colors.bg} border ${colors.border} ${index === 0 ? 'rounded-tr' : ''} ${index === 3 ? 'rounded-br' : ''}`}
                                                style={{height: `${rightAreaHeights[areaKey]}%`}}
                                            >
                                                <div
                                                    className={`font-medium ${colors.text} p-5px ${colors.header} rounded text-left text-xs inline-block`}>
                                                    Area R{index + 1} - {rightAreaNames[index]}
                                                </div>

                                                {/* Movable items in this area */}
                                                <div className="relative h-[calc(100%-1.5rem)]">
                                                    {movableItems[areaKey].map(item => (
                                                        <div
                                                            key={item.id}
                                                            className={`absolute ${colors.item} rounded shadow-sm text-xs text-center cursor-move hover:shadow-md transition-shadow`}
                                                            style={{
                                                                top: `calc(${item.y}% - ${item.y >= 0 ? '1.5rem' : '0px'})`,
                                                                left: `min(calc(100% - ${itemSizes[areaKey].width}px), max(0%, ${item.x}%))`,
                                                                width: `${itemSizes[areaKey].width}px`,
                                                                height: `${itemSizes[areaKey].height}px`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            {item.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteMap;
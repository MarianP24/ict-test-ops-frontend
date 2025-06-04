import React, { useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import FixtureService from '../../services/FixtureService';
import MachineService from '../../services/MachineService';

const IctIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
);

const FlashingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const DefaultIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7"/>
    </svg>
);


const SiteMap = () => {
    // Define custom heights for each area as percentages (must add up to 100 minus corridor spaces)
    const leftAreaHeights = { areaL1: 15, areaL2: 15, areaL3: 20, areaL4: 30, areaL5: 20 };
    const rightAreaHeights = { areaR1: 15, areaR2: 15, areaR3: 50, areaR4: 20 };

    // Store the state of movable elements
    const [movableItems, setMovableItems] = useState({
        // Left side areas (5 areas)
        areaL1: [ {id: 'itemL1-1', label: 'FCM Flashing', x: 60, y: 10}, {id: 'itemL1-2', label: 'SCAS ICT', x: 50, y: 30}, {id: 'itemL1-3', label: 'Offline ICT', x: 10, y: 70}, {id: 'itemL1-4', label: 'ATE EVO', x: 20, y: 10}, ],
        areaL2: [ {id: 'itemL2-1', label: 'FCM ICT1', x: 90, y: 80}, {id: 'itemL2-2', label: 'FCM ICT2', x: 82, y: 30}, {id: 'itemL2-3', label: 'SFTP ICT', x: 10, y: 55}, {id: 'itemL2-4', label: 'CCU ICT1', x: 30, y: 5}, {id: 'itemL2-5', label: 'CCU ICT2', x: 30, y: 65}, {id: 'itemL2-6', label: 'CCU Flashing', x: 45, y: 50}, ],
        areaL3: [ {id: 'itemL3-1', label: 'RLS Flashing', x: 90, y: 80}, {id: 'itemL3-2', label: 'Asys1 ICT', x: 90, y: 10}, {id: 'itemL3-3', label: 'Asys2 ICT', x: 80, y: 65}, {id: 'itemL3-4', label: 'Grohman ICT', x: 60, y: 10}, {id: 'itemL3-5', label: 'Asys3 ICT', x: 50, y: 80}, {id: 'itemL3-6', label: 'ECU/MAN ICT', x: 5, y: 35}, ],
        areaL4: [ {id: 'itemL4-1', label: 'MLB ICT1', x: 90, y: 85}, {id: 'itemL4-2', label: 'MLB ICT2', x: 82, y: 60}, {id: 'itemL4-3', label: 'Flashing SAR', x: 72, y: 85}, {id: 'itemL4-4', label: 'SAR ICT1', x: 72, y: 60}, {id: 'itemL4-5', label: 'SAR ICT2', x: 72, y: 35}, {id: 'itemL4-6', label: 'SAR ICT3', x: 72, y: 10}, {id: 'itemL4-7', label: 'Flashing STAR', x: 50, y: 60}, {id: 'itemL4-8', label: 'STAR ICT 1', x: 5, y: 45}, {id: 'itemL4-9', label: 'STAR ICT 2', x: 15, y: 68}, {id: 'itemL4-10', label: 'STAR ICT 3', x: 25, y: 12}, {id: 'itemL4-11', label: 'STAR ICT 4', x: 30, y: 40}, ],
        areaL5: [ {id: 'itemL5-1', label: 'FSCM ICT', x: 20, y: 10}, {id: 'itemL5-2', label: 'BMU ICT2', x: 73, y: 30}, {id: 'itemL5-3', label: 'BMU ICT1', x: 82, y: 30}, {id: 'itemL5-4', label: 'BMU Flashing', x: 64, y: 65}, {id: 'itemL5-5', label: 'Frontend ICT', x: 40, y: 65}, ],
        // Right side areas (4 areas)
        areaR1: [ {id: 'itemR1-1', label: 'Knor Aeroflex', x: 80, y: 45}, {id: 'itemR1-2', label: 'Knor Seica', x: 60, y: 45}, {id: 'itemR1-3', label: 'HVH Flashing', x: 78, y: 15}, ],
        areaR2: [],
        areaR3: [],
        areaR4: [ {id: 'itemR4-1', label: 'EVSV ICT', x: 50, y:30}, {id: 'itemR4-2', label: 'EVSV Flashing', x: 50, y:70}, ],
        // External areas
        area5: [ {id: 'item5-1', label: 'NEXTEER ICT1', x: 60, y: 20}, {id: 'item5-2', label: 'NEXTEER ICT2', x: 60, y: 50}, {id: 'item5-3', label: 'NEXTEER Flashing', x: 25, y: 80}, ],
        area6: [ {id: 'item6-1', label: 'MIX ICT1', x: 67, y: 95}, {id: 'item6-2', label: 'ICT3 MIX', x: 42, y: 75}, {id: 'item6-3', label: 'MIX ICT4', x: 42, y: 47}, {id: 'item6-4', label: 'Flashing 1', x: 70, y: 5}, {id: 'item6-5', label: 'Flashing 2', x: 70, y: 30}, ],
    });

    // Area colors
    const leftAreaColors = [ { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", header: "bg-blue-100", item: "bg-blue-200" }, { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800", header: "bg-cyan-100", item: "bg-cyan-200" }, { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-800", header: "bg-teal-100", item: "bg-teal-200" }, { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", header: "bg-emerald-100", item: "bg-emerald-200" }, { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", header: "bg-purple-100", item: "bg-purple-200" }, ];
    const rightAreaColors = [ { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", header: "bg-green-100", item: "bg-green-200" }, { bg: "bg-lime-50", border: "border-lime-200", text: "text-lime-800", header: "bg-lime-100", item: "bg-lime-200" }, { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", header: "bg-amber-100", item: "bg-amber-200" }, { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", header: "bg-orange-100", item: "bg-orange-200" }, ];

    // Area names
    const leftAreaNames = [ "Assembly", "Production", "Engineering", "Development", "Quality Control" ];
    const rightAreaNames = [ "Testing", "Packaging", "Storage", "Logistics" ];

    // --- State for Action Menu and Machines ---
    const [actionMenu, setActionMenu] = useState({ visible: false, item: null, position: { top: 0, left: 0 } });
    const [loading, setLoading] = useState(false);
    const [machines, setMachines] = useState([]);
    const [machinesLoading, setMachinesLoading] = useState(true);

    // Load machines on component mount
    useEffect(() => {
        const loadMachines = async () => {
            try {
                const response = await MachineService.getAllMachines();
                setMachines(response.data);
            } catch (error) {
                console.error('Failed to load machines:', error);
                toast.error('Failed to load machine data');
            } finally {
                setMachinesLoading(false);
            }
        };

        loadMachines();
    }, []);

    const handleItemClick = useCallback((item, event) => {
        event.stopPropagation();
        const mapContainer = event.currentTarget.closest('.map-container');
        const iconRect = event.currentTarget.getBoundingClientRect();
        if (mapContainer) {
            const mapRect = mapContainer.getBoundingClientRect();
            const top = iconRect.top - mapRect.top + iconRect.height / 2;
            const left = iconRect.left - mapRect.left + iconRect.width + 5;
            setActionMenu({ visible: true, item: item, position: { top, left } });
        } else {
            console.warn("Map container not found for positioning menu.");
            setActionMenu({ visible: true, item: item, position: { top: event.clientY, left: event.clientX + 10 } });
        }
    }, []);

    const handleCloseActionMenu = useCallback(() => {
        setActionMenu(prev => ({ ...prev, visible: false, item: null }));
    }, []);

    // Helper function to find hostname by equipment name
    const getHostnameByEquipmentName = (equipmentName) => {
        const machine = machines.find(m => m.equipmentName === equipmentName);
        return machine?.hostname || null;
    };

    const handleSelectAction = async (action, item) => {
        console.log(`Action: ${action} selected for item: ${item.label} (ID: ${item.id})`);

        // Find the hostname from machines data
        const hostname = getHostnameByEquipmentName(item.label);

        if (!hostname) {
            toast.error(`No hostname found for equipment: ${item.label}`);
            handleCloseActionMenu();
            return;
        }

        setLoading(true);

        try {
            let response;

            switch (action) {
                case 'VNC':
                    response = await FixtureService.connectVnc(hostname);
                    toast.success(`VNC connection initiated to ${item.label} (${hostname})`);
                    break;

                case 'Disk C':
                    response = await FixtureService.connectToCDrive(hostname);
                    toast.success(`Successfully connected to C$ drive on ${item.label} (${hostname})`);
                    break;

                case 'Disk D':
                    response = await FixtureService.connectToDDrive(hostname);
                    toast.success(`Successfully connected to D$ drive on ${item.label} (${hostname})`);
                    break;

                default:
                    console.warn(`Unknown action: ${action}`);
                    toast.warning(`Unknown action: ${action}`);
                    return;
            }

            console.log(`${action} response:`, response);

        } catch (error) {
            console.error(`Failed to execute ${action} for ${item.label}:`, error);

            // Extract error message from response if available
            const errorMessage = error.response?.data || error.message || `Failed to execute ${action}`;
            toast.error(`Failed to ${action.toLowerCase()} ${item.label}: ${errorMessage}`);
        } finally {
            setLoading(false);
            handleCloseActionMenu();
        }
    };

    const getIconForItem = (label) => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('ict')) return <IctIcon />;
        if (lowerLabel.includes('flashing')) return <FlashingIcon />;
        if (lowerLabel === 'ate evo' || lowerLabel === 'knor seica' || lowerLabel === 'knor aeroflex') {
            return <IctIcon />;
        }
        return <DefaultIcon />;
    };

    // Check if an item has a corresponding machine
    const hasCorrespondingMachine = (itemLabel) => {
        return machines.some(machine => machine.equipmentName === itemLabel);
    };

    // --- Generic function to render items for any area ---
    const renderItemsForArea = (areaKey, areaItems, itemColorClass) => {
        const iconContainerSize = 24;
        const iconOffset = iconContainerSize / 2;
        return (
            <div className="relative h-full w-full">
                {areaItems.map(item => {
                    const hasMachine = hasCorrespondingMachine(item.label);
                    const opacity = hasMachine ? 'opacity-100' : 'opacity-50';
                    const cursor = hasMachine ? 'cursor-pointer' : 'cursor-not-allowed';

                    return (
                        <button
                            key={item.id}
                            data-tooltip-id="sitemap-item-tooltip"
                            data-tooltip-content={
                                hasMachine
                                    ? item.label
                                    : `${item.label} (No machine data available)`
                            }
                            className={`absolute flex items-center justify-center rounded-full hover:ring-2 ring-offset-1 ${itemColorClass} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 ${itemColorClass} ${opacity} ${cursor}`}
                            style={{
                                top: `calc(${item.y}% - ${iconOffset}px)`,
                                left: `calc(${item.x}% - ${iconOffset}px)`,
                                width: `${iconContainerSize}px`,
                                height: `${iconContainerSize}px`,
                            }}
                            onClick={(e) => hasMachine ? handleItemClick(item, e) : null}
                            aria-label={`Open actions for ${item.label}`}
                            disabled={!hasMachine}
                        >
                            {getIconForItem(item.label)}
                        </button>
                    );
                })}
            </div>
        );
    };


    // --- Calculate cumulative top offsets ---
    let cumulativeTopLeft = 0;
    let cumulativeTopRight = 0;

    if (machinesLoading) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Site Map</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">Loading machine data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6" onClick={handleCloseActionMenu}>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Site Map</h1>
            <div className="map-container relative w-full h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Main floor layout with an outer corridor */}
                <div className="absolute inset-4 bg-gray-300 rounded p-2"> {/* Inner padding/corridor space */}

                    {/* --- Left Side Areas --- */}
                    {Object.entries(leftAreaHeights).map(([areaKey, heightPercent], index) => {
                        const colors = leftAreaColors[index % leftAreaColors.length];
                        const currentTop = cumulativeTopLeft; // Use the *current* cumulative top
                        cumulativeTopLeft += heightPercent; // Update cumulative top for the *next* iteration

                        const areaStyle = {
                            height: `${heightPercent}%`,
                            top: `${currentTop}%`, // Use calculated top
                            width: 'calc(50% - 0.5rem)', // Adjusted width for potential padding issues (0.5rem from p-2 on parent)
                            left: '0',
                        };

                        return (
                            <div key={areaKey} className={`absolute border ${colors.border} ${colors.bg} rounded shadow-sm`} style={areaStyle}>
                                <div className={`font-medium ${colors.text} ${colors.header} p-1 text-xs rounded-t truncate`}>
                                    {leftAreaNames[index] || areaKey}
                                </div>
                                <div className="absolute inset-0 top-[1.5rem]">
                                    {renderItemsForArea(areaKey, movableItems[areaKey] || [], colors.border)}
                                </div>
                            </div>
                        );
                    })}


                    {/* --- Right Side Areas --- */}
                    {Object.entries(rightAreaHeights).map(([areaKey, heightPercent], index) => {
                        const colors = rightAreaColors[index % rightAreaColors.length];
                        const currentTop = cumulativeTopRight; // Use the *current* cumulative top
                        cumulativeTopRight += heightPercent; // Update cumulative top for the *next* iteration

                        const areaStyle = {
                            height: `${heightPercent}%`,
                            top: `${currentTop}%`, // Use calculated top
                            width: 'calc(50% - 0.5rem)', // Adjusted width
                            right: '0',
                        };

                        return (
                            <div key={areaKey} className={`absolute border ${colors.border} ${colors.bg} rounded shadow-sm`} style={areaStyle}>
                                <div className={`font-medium ${colors.text} ${colors.header} p-1 text-xs rounded-t truncate`}>
                                    {rightAreaNames[index] || areaKey}
                                </div>
                                <div className="absolute inset-0 top-[1.5rem]">
                                    {renderItemsForArea(areaKey, movableItems[areaKey] || [], colors.border)}
                                </div>
                            </div>
                        );
                    })}

                </div> {/* End of inner gray area */}


                {/* --- External Area 5 (NEXTEER) --- */}
                <div className="absolute left-0 top-[73%] w-[180px] h-[150px] bg-red-50 border border-red-200 rounded-l shadow-md transform -translate-x-[calc(100%+4px)]"> {/* Adjusted translate for border */}
                    <div className="font-medium text-red-800 p-1 bg-red-100 rounded-tl text-left text-xs inline-block truncate w-full">
                        Area 5 - NEXTEER
                    </div>
                    <div className="absolute right-[-4px] bottom-[10%] w-[8px] h-[8px] bg-gray-300 z-10 transform translate-x-full" />
                    <div className="absolute inset-0 top-[1.5rem]">
                        {renderItemsForArea('area5', movableItems.area5 || [], 'border-red-300')}
                    </div>
                </div>

                {/* --- External Area 6 (Workshop) --- */}
                <div className="absolute right-[5%] bottom-0 w-[250px] h-[150px] bg-indigo-50 border border-indigo-200 rounded-b shadow-md transform translate-y-[calc(100%+4px)]"> {/* Adjusted position & translate */}
                    <div className="font-medium text-indigo-800 p-1 bg-indigo-100 rounded-t text-left text-xs inline-block truncate w-full">
                        Area 6 - Workshop
                    </div>
                    <div className="absolute top-[-4px] left-1/2 h-[8px] w-[8px] bg-gray-300 z-10 transform -translate-x-1/2 -translate-y-full" />
                    <div className="absolute inset-0 top-[1.5rem]">
                        {renderItemsForArea('area6', movableItems.area6 || [], 'border-indigo-300')}
                    </div>
                </div>


                {/* --- Action Menu --- */}
                {actionMenu.visible && actionMenu.item && (
                    <div
                        className="absolute bg-white border border-gray-400 rounded shadow-xl p-2 text-sm z-50 w-40"
                        style={{ top: `${actionMenu.position.top}px`, left: `${actionMenu.position.left}px` }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="font-semibold mb-1 px-1 pb-1 border-b border-gray-200 truncate">{actionMenu.item.label}</div>
                        <div className="text-xs text-gray-500 mb-2 px-1">
                            {getHostnameByEquipmentName(actionMenu.item.label) || 'No hostname found'}
                        </div>
                        <button
                            onClick={() => handleSelectAction('VNC', actionMenu.item)}
                            className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Connecting...' : 'Connect VNC'}
                        </button>
                        <button
                            onClick={() => handleSelectAction('Disk C', actionMenu.item)}
                            className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Connecting...' : 'Access Disk C'}
                        </button>
                        <button
                            onClick={() => handleSelectAction('Disk D', actionMenu.item)}
                            className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Connecting...' : 'Access Disk D'}
                        </button>
                    </div>
                )}

            </div> {/* End of main relative map-container */}

            {/* Tooltip Component Anchor - MUST be outside the relatively positioned map */}
            <Tooltip id="sitemap-item-tooltip" place="top" effect="solid" />
        </div>
    );
};

export default SiteMap;
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import FixtureService from '../../services/FixtureService';
import MachineService from '../../services/MachineService';
import AuthService from '../../services/AuthService';

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

// Admin Toggle Icon
const AdminIcon = ({ isEnabled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isEnabled ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

// Rename Icon
const RenameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const SiteMap = () => {
    // Check if user is admin
    const isAdmin = AuthService.isAdmin();

    // Admin features state
    const [adminMode, setAdminMode] = useState(false);
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [isRenameMode, setIsRenameMode] = useState(false);

    // Rename state
    const [renamingItem, setRenamingItem] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const [showBatchRenameModal, setShowBatchRenameModal] = useState(false);
    const [batchRenameList, setBatchRenameList] = useState([]);

    // Drag state
    const [dragState, setDragState] = useState({
        isDragging: false,
        dragItem: null,
        dragArea: null,
        startPos: { x: 0, y: 0 },
        offset: { x: 0, y: 0 }
    });

    // Refs for drag calculations
    const mapContainerRef = useRef(null);
    const renameInputRef = useRef(null);

    // Define custom heights for each area as percentages (must add up to 100 minus corridor spaces)
    const leftAreaHeights = { areaL1: 15, areaL2: 15, areaL3: 20, areaL4: 30, areaL5: 20 };
    const rightAreaHeights = { areaR1: 15, areaR2: 15, areaR3: 50, areaR4: 20 };

    // Store the state of movable elements
    const [movableItems, setMovableItems] = useState({
        // Left side areas (5 areas)
        areaL1: [ {id: 'itemL1-1', label: 'FCM Flashing', x: 60, y: 10}, {id: 'itemL1-2', label: 'SCAS ICT', x: 50, y: 30}, {id: 'itemL1-3', label: 'Offline ICT', x: 10, y: 70}, {id: 'itemL1-4', label: 'ATE EVO', x: 20, y: 10}, ],
        areaL2: [ {id: 'itemL2-1', label: 'FCM ICT1', x: 90, y: 80}, {id: 'itemL2-2', label: 'FCM ICT2', x: 82, y: 30}, {id: 'itemL2-3', label: 'SFTP ICT', x: 10, y: 55}, {id: 'itemL2-4', label: 'CCU ICT1', x: 30, y: 5}, {id: 'itemL2-5', label: 'CCU ICT2', x: 30, y: 65}, {id: 'itemL2-6', label: 'CCU Flashing', x: 45, y: 50}, ],
        areaL3: [ {id: 'itemL3-1', label: 'RLS Flashing', x: 90, y: 80}, {id: 'itemL3-2', label: 'Asys1 ICT', x: 90, y: 10}, {id: 'itemL3-3', label: 'Asys2 ICT', x: 80, y: 65}, {id: 'itemL3-4', label: 'Grohman ICT', x: 60, y: 10}, {id: 'itemL3-5', label: 'Asys3 ICT', x: 50, y: 80}, {id: 'itemL3-6', label: 'ECU/MAN ICT', x: 5, y: 35}, ],
        areaL4: [ {id: 'itemL4-1', label: 'MLB ICT1', x: 90, y: 85}, {id: 'itemL4-2', label: 'MLB ICT2', x: 82, y: 60}, {id: 'itemL4-3', label: 'Flashing SAR', x: 72, y: 85}, {id: 'itemL4-4', label: 'SAR ICT1', x: 72, y: 60}, {id: 'itemL4-5', label: 'SAR ICT2', x: 72, y: 35}, {id: 'itemL4-6', label: 'SAR ICT3', x: 72, y: 10}, {id: 'itemL4-7', label: 'Flashing STAR', x: 50, y: 60}, {id: 'itemL4-8', label: 'Star3 ICT1', x: 5, y: 45}, {id: 'itemL4-9', label: 'STAR ICT 2', x: 15, y: 68}, {id: 'itemL4-10', label: 'STAR ICT 3', x: 25, y: 12}, {id: 'itemL4-11', label: 'STAR ICT 4', x: 30, y: 40}, ],
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

    // Admin Features Handlers
    const handleAdminToggle = () => {
        const newAdminMode = !adminMode;
        setAdminMode(newAdminMode);

        if (newAdminMode) {
            toast.success('🔐 Admin mode enabled - Advanced features unlocked', {
                position: "top-center",
                autoClose: 2000,
                className: "!bg-gradient-to-r !from-red-500 !to-red-600"
            });
        } else {
            toast.info('🔒 Admin mode disabled', {
                position: "top-center",
                autoClose: 1500,
            });
            // Reset admin features when disabling admin mode
            setIsDraggingEnabled(false);
            setShowDebugInfo(false);
            setIsRenameMode(false);
            setRenamingItem(null);
        }
    };

    const handleDragToggle = () => {
        const newDragState = !isDraggingEnabled;
        setIsDraggingEnabled(newDragState);

        // Disable rename mode when enabling drag mode
        if (newDragState && isRenameMode) {
            setIsRenameMode(false);
            setRenamingItem(null);
        }

        toast.success(newDragState ? '🎯 Drag mode enabled - Click and drag items to move them' : '🎯 Drag mode disabled', {
            autoClose: 2000,
        });
    };

    const handleRenameToggle = () => {
        const newRenameState = !isRenameMode;
        setIsRenameMode(newRenameState);

        // Disable drag mode when enabling rename mode
        if (newRenameState && isDraggingEnabled) {
            setIsDraggingEnabled(false);
        }

        // Clear any active renaming
        if (!newRenameState) {
            setRenamingItem(null);
            setRenameValue('');
        }

        toast.success(newRenameState ? '✏️ Rename mode enabled - Click items to rename them' : '✏️ Rename mode disabled', {
            autoClose: 2000,
        });
    };

    const handleDebugToggle = () => {
        const newDebugState = !showDebugInfo;
        setShowDebugInfo(newDebugState);
        toast.success(newDebugState ? '🐛 Debug info enabled' : '🐛 Debug info disabled', {
            autoClose: 1000,
        });
    };

    const handleBatchRename = () => {
        // Collect all items for batch rename
        const allItems = [];
        Object.entries(movableItems).forEach(([areaKey, items]) => {
            items.forEach(item => {
                allItems.push({
                    ...item,
                    areaKey,
                    originalLabel: item.label,
                    newLabel: item.label
                });
            });
        });

        setBatchRenameList(allItems);
        setShowBatchRenameModal(true);
    };

    // Rename functionality
    const handleItemRename = useCallback((item, areaKey, event) => {
        if (!isRenameMode || !adminMode) return;

        event.preventDefault();
        event.stopPropagation();

        setRenamingItem({ ...item, areaKey });
        setRenameValue(item.label);
    }, [isRenameMode, adminMode]);

    const handleRenameSubmit = useCallback(async (event) => {
        event.preventDefault();

        if (!renamingItem || !renameValue.trim()) {
            setRenamingItem(null);
            setRenameValue('');
            return;
        }

        const newLabel = renameValue.trim();
        const oldLabel = renamingItem.label;

        try {
            // Find the machine with the old equipment name
            const machine = machines.find(m => m.equipmentName === oldLabel);

            if (machine) {
                // Update the machine in the backend
                const updatedMachine = { ...machine, equipmentName: newLabel };
                await MachineService.updateMachine(machine.id, updatedMachine);

                // Update the machines list in state
                setMachines(prevMachines =>
                    prevMachines.map(m =>
                        m.id === machine.id ? { ...m, equipmentName: newLabel } : m
                    )
                );

                toast.success(`✏️ "${oldLabel}" renamed to "${newLabel}"`, {
                    autoClose: 2000,
                });
            } else {
                // If no machine found, just update the display name locally
                toast.info(`✏️ Display name updated to "${newLabel}" (no machine data to sync)`, {
                    autoClose: 2000,
                });
            }

            // Update the movable items
            setMovableItems(prev => ({
                ...prev,
                [renamingItem.areaKey]: prev[renamingItem.areaKey].map(item =>
                    item.id === renamingItem.id ? { ...item, label: newLabel } : item
                )
            }));

        } catch (error) {
            console.error('Failed to rename machine:', error);
            toast.error(`Failed to rename "${oldLabel}": ${error.response?.data || error.message}`, {
                autoClose: 3000,
            });
        }

        setRenamingItem(null);
        setRenameValue('');
    }, [renamingItem, renameValue, machines]);

    const handleRenameCancel = useCallback(() => {
        setRenamingItem(null);
        setRenameValue('');
    }, []);

    const handleBatchRenameSubmit = async () => {
        setLoading(true);
        const errors = [];
        const successes = [];

        try {
            for (const item of batchRenameList) {
                if (item.newLabel.trim() !== item.originalLabel) {
                    try {
                        const machine = machines.find(m => m.equipmentName === item.originalLabel);

                        if (machine) {
                            const updatedMachine = { ...machine, equipmentName: item.newLabel.trim() };
                            await MachineService.updateMachine(machine.id, updatedMachine);
                            successes.push(`"${item.originalLabel}" → "${item.newLabel.trim()}"`);
                        }

                        // Update local state
                        setMovableItems(prev => ({
                            ...prev,
                            [item.areaKey]: prev[item.areaKey].map(mapItem =>
                                mapItem.id === item.id ? { ...mapItem, label: item.newLabel.trim() } : mapItem
                            )
                        }));

                    } catch (error) {
                        console.error(`Failed to rename ${item.originalLabel}:`, error);
                        errors.push(`"${item.originalLabel}": ${error.response?.data || error.message}`);
                    }
                }
            }

            // Update machines state
            if (successes.length > 0) {
                const updatedMachines = machines.map(machine => {
                    const renamedItem = batchRenameList.find(item =>
                        item.originalLabel === machine.equipmentName &&
                        item.newLabel.trim() !== item.originalLabel
                    );
                    return renamedItem ? { ...machine, equipmentName: renamedItem.newLabel.trim() } : machine;
                });
                setMachines(updatedMachines);
            }

            // Show results
            if (successes.length > 0) {
                toast.success(`✏️ Successfully renamed ${successes.length} items`, {
                    autoClose: 3000,
                });
            }

            if (errors.length > 0) {
                toast.error(`❌ Failed to rename ${errors.length} items. Check console for details.`, {
                    autoClose: 5000,
                });
                console.error('Batch rename errors:', errors);
            }

        } catch (error) {
            console.error('Batch rename failed:', error);
            toast.error('Batch rename operation failed', { autoClose: 3000 });
        } finally {
            setLoading(false);
            setShowBatchRenameModal(false);
            setBatchRenameList([]);
        }
    };

    // Auto-focus rename input
    useEffect(() => {
        if (renamingItem && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [renamingItem]);

    // Drag and Drop Handlers
    const handleMouseDown = useCallback((item, areaKey, event) => {
        if (!isDraggingEnabled || !adminMode) return;

        event.preventDefault();
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();
        const areaElement = event.currentTarget.closest(`[data-area="${areaKey}"]`);
        const areaRect = areaElement ? areaElement.getBoundingClientRect() : null;

        if (areaRect) {
            setDragState({
                isDragging: true,
                dragItem: item,
                dragArea: areaKey,
                startPos: { x: event.clientX, y: event.clientY },
                offset: {
                    x: event.clientX - rect.left - rect.width / 2,
                    y: event.clientY - rect.top - rect.height / 2
                }
            });
        }
    }, [isDraggingEnabled, adminMode]);

    const handleMouseMove = useCallback((event) => {
        if (!dragState.isDragging || !dragState.dragItem) return;

        const areaElement = document.querySelector(`[data-area="${dragState.dragArea}"]`);
        if (!areaElement) return;

        const areaRect = areaElement.getBoundingClientRect();
        const areaContentElement = areaElement.querySelector('.drag-content-area');
        const contentRect = areaContentElement ? areaContentElement.getBoundingClientRect() : areaRect;

        // Calculate new position relative to the area
        const newX = ((event.clientX - dragState.offset.x - contentRect.left) / contentRect.width) * 100;
        const newY = ((event.clientY - dragState.offset.y - contentRect.top) / contentRect.height) * 100;

        // Constrain to area bounds (with some padding)
        const constrainedX = Math.max(2, Math.min(98, newX));
        const constrainedY = Math.max(2, Math.min(98, newY));

        // Update item position
        setMovableItems(prev => ({
            ...prev,
            [dragState.dragArea]: prev[dragState.dragArea].map(item =>
                item.id === dragState.dragItem.id
                    ? { ...item, x: constrainedX, y: constrainedY }
                    : item
            )
        }));
    }, [dragState]);

    const handleMouseUp = useCallback(() => {
        if (dragState.isDragging && dragState.dragItem) {
            toast.success(`📍 ${dragState.dragItem.label} repositioned`, {
                autoClose: 1000,
            });
        }
        setDragState({
            isDragging: false,
            dragItem: null,
            dragArea: null,
            startPos: { x: 0, y: 0 },
            offset: { x: 0, y: 0 }
        });
    }, [dragState]);

    // Add global mouse event listeners for dragging
    useEffect(() => {
        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

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

    const handleItemClick = useCallback((item, areaKey, event) => {
        // Handle rename mode
        if (isRenameMode && adminMode) {
            handleItemRename(item, areaKey, event);
            return;
        }

        // Don't show action menu when dragging is enabled
        if (isDraggingEnabled && adminMode) return;

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
    }, [isDraggingEnabled, adminMode, isRenameMode, handleItemRename]);

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
            <div className="drag-content-area relative h-full w-full">
                {areaItems.map(item => {
                    const hasMachine = hasCorrespondingMachine(item.label);
                    const opacity = hasMachine ? 'opacity-100' : 'opacity-50';
                    const isBeingDragged = dragState.isDragging && dragState.dragItem?.id === item.id;
                    const isBeingRenamed = renamingItem && renamingItem.id === item.id;

                    let cursor = 'cursor-not-allowed';
                    if (hasMachine) {
                        if (isRenameMode && adminMode) {
                            cursor = 'cursor-text';
                        } else if (isDraggingEnabled && adminMode) {
                            cursor = 'cursor-grab';
                        } else {
                            cursor = 'cursor-pointer';
                        }
                    }
                    if (isBeingDragged) {
                        cursor = 'cursor-grabbing';
                    }

                    // If this item is being renamed, show input instead
                    if (isBeingRenamed) {
                        return (
                            <form
                                key={`${item.id}-rename`}
                                onSubmit={handleRenameSubmit}
                                className="absolute z-50"
                                style={{
                                    top: `calc(${item.y}% - 12px)`,
                                    left: `calc(${item.x}% - 50px)`,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    ref={renameInputRef}
                                    type="text"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onBlur={handleRenameCancel}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            handleRenameCancel();
                                        }
                                    }}
                                    className="px-2 py-1 text-xs border border-blue-300 rounded bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                                    maxLength={50}
                                />
                            </form>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            data-tooltip-id="sitemap-item-tooltip"
                            data-tooltip-content={
                                hasMachine
                                    ? `${item.label}${showDebugInfo ? ` (${Math.round(item.x)}, ${Math.round(item.y)})` : ''}${isRenameMode && adminMode ? ' - Click to rename' : isDraggingEnabled && adminMode ? ' - Drag to move' : ''}`
                                    : `${item.label} (No machine data available)`
                            }
                            className={`
                                absolute flex items-center justify-center rounded-full hover:ring-2 ring-offset-1 
                                ${itemColorClass} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 
                                ${itemColorClass} ${opacity} ${cursor}
                                ${adminMode && isDraggingEnabled ? 'ring-2 ring-red-400 shadow-lg' : ''}
                                ${adminMode && isRenameMode ? 'ring-2 ring-blue-400 shadow-lg' : ''}
                                ${isBeingDragged ? 'ring-4 ring-red-500 shadow-2xl scale-110 z-50' : ''}
                                transition-all duration-150
                            `}
                            style={{
                                top: `calc(${item.y}% - ${iconOffset}px)`,
                                left: `calc(${item.x}% - ${iconOffset}px)`,
                                width: `${iconContainerSize}px`,
                                height: `${iconContainerSize}px`,
                            }}
                            onClick={(e) => hasMachine ? handleItemClick(item, areaKey, e) : null}
                            onMouseDown={(e) => hasMachine && isDraggingEnabled ? handleMouseDown(item, areaKey, e) : null}
                            aria-label={`${isRenameMode && adminMode ? 'Click to rename' : isDraggingEnabled && adminMode ? 'Drag to move' : 'Open actions for'} ${item.label}`}
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
            {/* Header with Admin Controls */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Site Map</h1>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="flex items-center space-x-4">
                        {/* Admin Mode Toggle Button */}
                        <button
                            onClick={handleAdminToggle}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 
                                ${adminMode
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                            `}
                            data-tooltip-id="admin-tooltip"
                            data-tooltip-content={adminMode ? "Disable admin features" : "Enable admin features"}
                        >
                            <AdminIcon isEnabled={adminMode} />
                            <span className="text-sm">
                                {adminMode ? 'Admin Mode ON' : 'Admin Mode'}
                            </span>
                        </button>

                        {/* Additional Admin Controls - Only show when admin mode is active */}
                        {adminMode && (
                            <>
                                <button
                                    onClick={handleDragToggle}
                                    className={`
                                        px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                        ${isDraggingEnabled
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    `}
                                    data-tooltip-id="drag-tooltip"
                                    data-tooltip-content="Toggle item dragging mode"
                                >
                                    🎯 {isDraggingEnabled ? 'Drag ON' : 'Drag OFF'}
                                </button>

                                <button
                                    onClick={handleRenameToggle}
                                    className={`
                                        px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                        ${isRenameMode
                                        ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                    `}
                                    data-tooltip-id="rename-tooltip"
                                    data-tooltip-content="Toggle item rename mode"
                                >
                                    ✏️ {isRenameMode ? 'Rename ON' : 'Rename OFF'}
                                </button>

                                <button
                                    onClick={handleBatchRename}
                                    className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                    data-tooltip-id="batch-rename-tooltip"
                                    data-tooltip-content="Rename multiple items at once"
                                >
                                    📝 Batch Rename
                                </button>

                                <button
                                    onClick={handleDebugToggle}
                                    className={`
                                        px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                        ${showDebugInfo
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                                    `}
                                    data-tooltip-id="debug-tooltip"
                                    data-tooltip-content="Toggle debug information display"
                                >
                                    🐛 {showDebugInfo ? 'Debug ON' : 'Debug OFF'}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Admin Mode Indicator */}
            {adminMode && (
                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <strong>Admin Mode Active:</strong> Advanced features enabled.
                                {isDraggingEnabled && ' 🎯 Click and drag items to reposition them.'}
                                {isRenameMode && ' ✏️ Click items to rename them.'}
                                {showDebugInfo && ' 🐛 Debug information is visible.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={mapContainerRef}
                className="map-container relative w-full h-[600px] bg-white rounded-lg shadow-lg border border-gray-200"
            >
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
                            <div
                                key={areaKey}
                                data-area={areaKey}
                                className={`absolute border ${colors.border} ${colors.bg} rounded shadow-sm`}
                                style={areaStyle}
                            >
                                <div className={`font-medium ${colors.text} ${colors.header} p-1 text-xs rounded-t truncate`}>
                                    {leftAreaNames[index] || areaKey}
                                    {showDebugInfo && (
                                        <span className="ml-2 text-xs opacity-75">({movableItems[areaKey]?.length || 0} items)</span>
                                    )}
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
                            <div
                                key={areaKey}
                                data-area={areaKey}
                                className={`absolute border ${colors.border} ${colors.bg} rounded shadow-sm`}
                                style={areaStyle}
                            >
                                <div className={`font-medium ${colors.text} ${colors.header} p-1 text-xs rounded-t truncate`}>
                                    {rightAreaNames[index] || areaKey}
                                    {showDebugInfo && (
                                        <span className="ml-2 text-xs opacity-75">({movableItems[areaKey]?.length || 0} items)</span>
                                    )}
                                </div>
                                <div className="absolute inset-0 top-[1.5rem]">
                                    {renderItemsForArea(areaKey, movableItems[areaKey] || [], colors.border)}
                                </div>
                            </div>
                        );
                    })}

                </div> {/* End of inner gray area */}

                {/* --- External Area 5 (NEXTEER) --- */}
                <div
                    data-area="area5"
                    className="absolute left-0 top-[73%] w-[180px] h-[150px] bg-red-50 border border-red-200 rounded-l shadow-md transform -translate-x-[calc(100%+4px)]"
                >
                    <div className="font-medium text-red-800 p-1 bg-red-100 rounded-tl text-left text-xs inline-block truncate w-full">
                        Area 5 - NEXTEER
                        {showDebugInfo && (
                            <span className="ml-2 text-xs opacity-75">({movableItems.area5?.length || 0} items)</span>
                        )}
                    </div>
                    <div className="absolute right-[-4px] bottom-[10%] w-[8px] h-[8px] bg-gray-300 z-10 transform translate-x-full" />
                    <div className="absolute inset-0 top-[1.5rem]">
                        {renderItemsForArea('area5', movableItems.area5 || [], 'border-red-300')}
                    </div>
                </div>

                {/* --- External Area 6 (Workshop) --- */}
                <div
                    data-area="area6"
                    className="absolute right-[5%] bottom-0 w-[250px] h-[150px] bg-indigo-50 border border-indigo-200 rounded-b shadow-md transform translate-y-[calc(100%+4px)]"
                >
                    <div className="font-medium text-indigo-800 p-1 bg-indigo-100 rounded-t text-left text-xs inline-block truncate w-full">
                        Area 6 - Workshop
                        {showDebugInfo && (
                            <span className="ml-2 text-xs opacity-75">({movableItems.area6?.length || 0} items)</span>
                        )}
                    </div>
                    <div className="absolute top-[-4px] left-1/2 h-[8px] w-[8px] bg-gray-300 z-10 transform -translate-x-1/2 -translate-y-full" />
                    <div className="absolute inset-0 top-[1.5rem]">
                        {renderItemsForArea('area6', movableItems.area6 || [], 'border-indigo-300')}
                    </div>
                </div>

                {/* --- Action Menu --- */}
                {actionMenu.visible && actionMenu.item && !isDraggingEnabled && !isRenameMode && (
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

            {/* Batch Rename Modal */}
            {showBatchRenameModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-hidden">
                        <h2 className="text-xl font-bold mb-4">Batch Rename Equipment</h2>

                        <div className="overflow-y-auto max-h-[60vh] border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 text-left">Area</th>
                                    <th className="px-3 py-2 text-left">Current Name</th>
                                    <th className="px-3 py-2 text-left">New Name</th>
                                    <th className="px-3 py-2 text-center">Has Machine Data</th>
                                </tr>
                                </thead>
                                <tbody>
                                {batchRenameList.map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-3 py-2 text-xs font-medium">{item.areaKey}</td>
                                        <td className="px-3 py-2 text-gray-600">{item.originalLabel}</td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                value={item.newLabel}
                                                onChange={(e) => {
                                                    setBatchRenameList(prev =>
                                                        prev.map(prevItem =>
                                                            prevItem.id === item.id
                                                                ? { ...prevItem, newLabel: e.target.value }
                                                                : prevItem
                                                        )
                                                    );
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                maxLength={50}
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {hasCorrespondingMachine(item.originalLabel) ? (
                                                <span className="text-green-600">✓</span>
                                            ) : (
                                                <span className="text-gray-400">✗</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowBatchRenameModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBatchRenameSubmit}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Renaming...' : 'Apply Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tooltip Components */}
            <Tooltip id="sitemap-item-tooltip" place="top" effect="solid" />
            <Tooltip id="admin-tooltip" place="bottom" effect="solid" />
            <Tooltip id="drag-tooltip" place="bottom" effect="solid" />
            <Tooltip id="rename-tooltip" place="bottom" effect="solid" />
            <Tooltip id="batch-rename-tooltip" place="bottom" effect="solid" />
            <Tooltip id="debug-tooltip" place="bottom" effect="solid" />
        </div>
    );
};

export default SiteMap;
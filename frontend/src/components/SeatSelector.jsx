import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Compass, RotateCcw } from 'lucide-react';

const SeatSelector = ({ type = 'flight', numSeatsRequired = 1, selectedSeats = [], onSelectSeats }) => {
    const normalizedType = String(type).toLowerCase();

    // Deterministically seed some occupied seats based on the name of the seat
    const isOccupied = (seatId) => {
        // Deterministic hash so it doesn't change on render
        let hash = 0;
        for (let i = 0; i < seatId.length; i++) {
            hash = seatId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash % 3 === 0; // Roughly 33% of seats are occupied
    };

    // 1. Generate Flight seats: Rows 1-8, Columns A,B,C, D,E,F
    const flightRows = useMemo(() => {
        const rows = [];
        for (let r = 1; r <= 8; r++) {
            const rowSeats = [];
            ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
                const id = `${r}${col}`;
                rowSeats.push({
                    id,
                    label: id,
                    occupied: isOccupied(id),
                    type: col === 'A' || col === 'F' ? 'Window' : col === 'C' || col === 'D' ? 'Aisle' : 'Middle'
                });
            });
            rows.push(rowSeats);
        }
        return rows;
    }, []);

    // 2. Generate Train seats: 6 Rows. Each row is a compartment
    // Left: Window (W), Middle (M), Lower (L)
    // Aisle
    // Right: Side Lower (SL), Side Upper (SU)
    const trainRows = useMemo(() => {
        const rows = [];
        for (let r = 1; r <= 6; r++) {
            const id1 = `${r}L`;  // Lower
            const id2 = `${r}M`;  // Middle
            const id3 = `${r}U`;  // Upper
            const id4 = `${r}SL`; // Side Lower
            const id5 = `${r}SU`; // Side Upper

            rows.push({
                rowNum: r,
                left: [
                    { id: id1, label: `${r} L`, occupied: isOccupied(id1), sub: 'Lower' },
                    { id: id2, label: `${r} M`, occupied: isOccupied(id2), sub: 'Middle' },
                    { id: id3, label: `${r} U`, occupied: isOccupied(id3), sub: 'Upper' },
                ],
                right: [
                    { id: id4, label: `${r} SL`, occupied: isOccupied(id4), sub: 'S-Lower' },
                    { id: id5, label: `${r} SU`, occupied: isOccupied(id5), sub: 'S-Upper' },
                ]
            });
        }
        return rows;
    }, []);

    // 3. Generate Bus seats: 8 Rows, 2x2 layout
    // Left: A, B. Right: C, D
    const busRows = useMemo(() => {
        const rows = [];
        for (let r = 1; r <= 8; r++) {
            const rowSeats = [];
            ['A', 'B', 'C', 'D'].forEach(col => {
                const id = `${r}${col}`;
                rowSeats.push({
                    id,
                    label: id,
                    occupied: isOccupied(id),
                    type: col === 'A' || col === 'D' ? 'Window' : 'Aisle'
                });
            });
            rows.push(rowSeats);
        }
        return rows;
    }, []);

    // Handle seat click
    const handleSeatClick = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            // Unselect seat
            onSelectSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            // Select seat
            if (selectedSeats.length >= numSeatsRequired) {
                // FIFO: Remove oldest selected seat and add the new one
                onSelectSeats([...selectedSeats.slice(1), seatId]);
            } else {
                onSelectSeats([...selectedSeats, seatId]);
            }
        }
    };

    // Styling configurations based on transport type
    const styleConfig = {
        flight: {
            title: 'Flight Cabin Map',
            themeColor: 'from-indigo-500 to-purple-500',
            glowColor: 'rgba(99, 102, 241, 0.4)',
            seatText: 'text-indigo-600',
            accent: 'indigo'
        },
        train: {
            title: 'Railway Coach Layout',
            themeColor: 'from-amber-500 to-orange-500',
            glowColor: 'rgba(245, 158, 11, 0.4)',
            seatText: 'text-amber-600',
            accent: 'amber'
        },
        bus: {
            title: 'Express Bus Layout',
            themeColor: 'from-emerald-500 to-teal-500',
            glowColor: 'rgba(16, 185, 129, 0.4)',
            seatText: 'text-emerald-600',
            accent: 'emerald'
        }
    }[normalizedType] || {
        title: 'Seat Map',
        themeColor: 'from-primary to-secondary',
        glowColor: 'rgba(99, 102, 241, 0.4)',
        seatText: 'text-primary',
        accent: 'primary'
    };

    const isDirectSelected = (seatId) => selectedSeats.includes(seatId);

    // Renderer for Flight Seats
    const renderFlightMap = () => {
        return (
            <div className="relative mx-auto w-full max-w-[340px] border-t-2 border-x-2 border-white/20 rounded-t-[140px] pt-24 pb-8 px-3 sm:px-6 bg-white/[0.01] shadow-[inset_0_10px_30px_rgba(255,255,255,0.02)] mt-8 overflow-hidden">
                {/* Airplane Cockpit outline */}
                <div className="absolute top-0 inset-x-0 h-20 flex flex-col justify-center items-center border-b border-dashed border-white/10 bg-white/[0.02]">
                    <Plane className="w-6 h-6 text-white/40 mb-1 rotate-180" />
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Flight Deck</span>
                </div>

                {/* Left and Right Wings */}
                <div className="absolute -left-12 top-36 w-12 h-44 bg-white/5 border border-white/10 rounded-l-[20px] pointer-events-none flex items-center justify-center">
                    <div className="w-[2px] h-36 bg-white/10"></div>
                </div>
                <div className="absolute -right-12 top-36 w-12 h-44 bg-white/5 border border-white/10 rounded-r-[20px] pointer-events-none flex items-center justify-center">
                    <div className="w-[2px] h-36 bg-white/10"></div>
                </div>

                {/* Cabin Seats */}
                <div className="space-y-3 relative z-10 pt-4">
                    {flightRows.map((row, rIndex) => (
                        <div key={rIndex} className="flex items-center justify-between">
                            {/* Left Side (A, B, C) */}
                            <div className="flex gap-1 sm:gap-2">
                                {row.slice(0, 3).map(seat => renderSeatButton(seat))}
                            </div>

                            {/* Aisle */}
                            <div className="w-6 sm:w-8 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-gray-600">{rIndex + 1}</span>
                            </div>

                            {/* Right Side (D, E, F) */}
                            <div className="flex gap-1 sm:gap-2">
                                {row.slice(3).map(seat => renderSeatButton(seat))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Renderer for Train Map
    const renderTrainMap = () => {
        return (
            <div className="mx-auto w-full max-w-[380px] border-y border-x-2 border-white/20 rounded-2xl p-2 sm:p-4 bg-white/[0.01] shadow-inner mt-8 relative">
                {/* Tracks decoration */}
                <div className="absolute -left-4 inset-y-0 w-1 flex flex-col justify-between pointer-events-none opacity-40">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-1 w-2 bg-slate-600"></div>)}
                </div>
                <div className="absolute -right-4 inset-y-0 w-1 flex flex-col justify-between pointer-events-none opacity-40">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-1 w-2 bg-slate-600"></div>)}
                </div>

                <div className="space-y-6 pt-2">
                    {trainRows.map((row, index) => (
                        <div key={index} className="relative pb-5 border-b border-white/5 last:border-b-0 last:pb-0">
                            {/* Compartment Label */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600 uppercase tracking-widest z-0 bg-dark px-2">
                                Cabin {row.rowNum}
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                {/* Left Side: 3 Berths (Lower, Middle, Upper) */}
                                <div className="flex gap-1 sm:gap-2">
                                    {row.left.map(seat => renderSeatButton(seat, true))}
                                </div>

                                {/* Right Side: 2 Side Berths (Side Lower, Side Upper) */}
                                <div className="flex gap-1 sm:gap-2">
                                    {row.right.map(seat => renderSeatButton(seat, true))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Renderer for Bus Map
    const renderBusMap = () => {
        return (
            <div className="mx-auto w-full max-w-[280px] border-4 border-white/10 rounded-3xl p-3 sm:p-5 bg-white/[0.01] shadow-inner mt-8 relative">
                {/* Driver Section */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Driver</span>
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mt-1">
                            <Compass className="w-4 h-4 text-gray-500 animate-spin-slow" />
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Door</span>
                        <div className="h-6 w-12 border border-green-500/20 bg-green-500/5 rounded-md flex items-center justify-center text-[10px] font-bold text-green-500/70 mt-1">
                            Exit
                        </div>
                    </div>
                </div>

                {/* Bus Seats */}
                <div className="space-y-3">
                    {busRows.map((row, rIndex) => (
                        <div key={rIndex} className="flex justify-between items-center">
                            {/* Left Side (A, B) */}
                            <div className="flex gap-1 sm:gap-2">
                                {row.slice(0, 2).map(seat => renderSeatButton(seat))}
                            </div>

                            {/* Middle aisle space */}
                            <div className="w-6 flex items-center justify-center text-[10px] text-gray-600 font-bold">
                                {rIndex + 1}
                            </div>

                            {/* Right Side (C, D) */}
                            <div className="flex gap-1 sm:gap-2">
                                {row.slice(2).map(seat => renderSeatButton(seat))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Unified seat renderer
    const renderSeatButton = (seat, isCompartment = false) => {
        const { id, label, occupied, sub } = seat;
        const isSelected = isDirectSelected(id);

        let buttonClass = "";
        let content = null;

        if (occupied) {
            // Booked by other people - Dark Slate/Gray
            buttonClass = "bg-slate-800/80 border border-white/5 text-slate-600 cursor-not-allowed opacity-50 shadow-inner";
        } else if (isSelected) {
            // Booked/selected by USER - Colorful gradient
            buttonClass = `bg-gradient-to-br ${styleConfig.themeColor} text-white font-bold border-transparent shadow-[0_0_15px_${styleConfig.glowColor}] cursor-pointer scale-105`;
        } else {
            // Available seat - SLEEK CLEAN WHITE as requested
            buttonClass = "bg-white text-slate-900 border border-gray-200 hover:bg-slate-100 hover:border-gray-300 cursor-pointer shadow-md";
        }

        if (isCompartment) {
            content = (
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-center select-none text-[9px]">
                    <span className="font-extrabold uppercase leading-tight">{label.split(' ')[1]}</span>
                    <span className={`text-[7px] font-bold opacity-75 mt-0.5 tracking-tighter truncate max-w-full ${isSelected ? 'text-white' : 'text-slate-500'}`}>{sub}</span>
                </div>
            );
        } else {
            content = (
                <div className="flex items-center justify-center w-10 h-10 rounded-xl text-center select-none text-xs font-bold leading-none uppercase">
                    {label}
                </div>
            );
        }

        return (
            <motion.button
                key={id}
                type="button"
                disabled={occupied}
                onClick={() => handleSeatClick(id)}
                whileHover={occupied ? {} : { scale: 1.12, translateY: -2 }}
                whileTap={occupied ? {} : { scale: 0.92 }}
                animate={
                    isSelected 
                        ? { 
                            scale: [1, 1.25, 1.05],
                            boxShadow: `0px 0px 16px ${styleConfig.glowColor}`
                          } 
                        : { scale: 1, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }
                }
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`transition-all duration-300 rounded-xl outline-none focus:outline-none ${buttonClass}`}
            >
                {content}
            </motion.button>
        );
    };

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-${styleConfig.accent}-500/5 rounded-full blur-3xl pointer-events-none`}></div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div>
                    <h4 className="text-white font-bold text-lg">{styleConfig.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                        Select <span className="text-white font-bold">{numSeatsRequired}</span> {numSeatsRequired === 1 ? 'seat' : 'seats'} for your travel.
                    </p>
                </div>
                {selectedSeats.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onSelectSeats([])}
                        className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs transition-colors p-1.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/10"
                    >
                        <RotateCcw size={12} /> Reset
                    </button>
                )}
            </div>

            {/* Seat Map Layout */}
            {normalizedType === 'flight' && renderFlightMap()}
            {normalizedType === 'train' && renderTrainMap()}
            {normalizedType === 'bus' && renderBusMap()}

            {/* Selection Legend */}
            <div className="flex justify-center items-center gap-6 mt-8 border-t border-white/5 pt-5 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-white border border-gray-300 shadow-md"></div>
                    <span className="text-gray-400 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md bg-gradient-to-br ${styleConfig.themeColor} shadow-md`}></div>
                    <span className="text-gray-400 font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-slate-800 border border-white/5"></div>
                    <span className="text-gray-400 font-medium">Occupied</span>
                </div>
            </div>

            {/* Selection Summary */}
            <AnimatePresence>
                {selectedSeats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                    >
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Your Selection</span>
                            <div className="text-white font-extrabold text-lg mt-0.5 tracking-wide flex items-center justify-center sm:justify-start gap-1">
                                {selectedSeats.map((seat, index) => (
                                    <span 
                                        key={seat} 
                                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs bg-${styleConfig.accent}-500/10 text-${styleConfig.accent}-400 border border-${styleConfig.accent}-500/20`}
                                    >
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs text-gray-400">
                            {selectedSeats.length < numSeatsRequired ? (
                                <span>Choose <strong className="text-white">{numSeatsRequired - selectedSeats.length}</strong> more seat(s)</span>
                            ) : (
                                <span className={`text-${styleConfig.accent}-400 font-bold flex items-center gap-1`}>
                                    ✓ All seats chosen
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SeatSelector;

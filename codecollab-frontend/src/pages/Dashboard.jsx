import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRooms, createRoom, joinRoom, deleteRoom } from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [language, setLanguage] = useState('java');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const loadRooms = useCallback(async () => {
        if (!user?.email) return;
        
        setLoading(true);
        try {
            const response = await getUserRooms(user.email);
            const uniqueRooms = Array.from(
                new Map(response.data.map(room => [room.roomId, room])).values()
            );
            setRooms(uniqueRooms);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadRooms();
        
        const handleFocus = () => {
            loadRooms();
        };
        
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [user, navigate, loadRooms, refreshKey]);

    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            alert('Please enter a room name');
            return;
        }
        try {
            const response = await createRoom({ roomName, language }, user.email);
            setShowCreateModal(false);
            setRoomName('');
            navigate(`/room/${response.data.roomId}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create room');
        }
    };

    const handleJoinRoom = async () => {
        if (!joinRoomId.trim()) {
            alert('Please enter a room ID');
            return;
        }
        try {
            await joinRoom(joinRoomId.toUpperCase(), user.email);
            setShowJoinModal(false);
            setJoinRoomId('');
            navigate(`/room/${joinRoomId.toUpperCase()}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join room');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            await deleteRoom(roomId, user.email);
            setDeleteConfirm(null);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete room');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white text-base md:text-xl">Loading your rooms...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20 md:pb-0">
            {/* Navbar */}
            <nav className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg md:text-xl font-bold">&lt;/&gt;</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                CodeCollab
                            </h1>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Signed in as</p>
                                <p className="text-white text-sm font-medium">{user?.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition border border-red-500/20"
                            >
                                Logout
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-300 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 pt-3 border-t border-gray-700">
                            <div className="text-center mb-3">
                                <p className="text-gray-400 text-sm">Signed in as</p>
                                <p className="text-white text-sm font-medium break-all">{user?.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition border border-red-500/20"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Collaboration Rooms</h2>
                    <p className="text-gray-400 text-sm md:text-base">Create or join a room to start coding together in real-time</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Room
                    </button>
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Join Room
                    </button>
                    <button
                        onClick={() => setRefreshKey(prev => prev + 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition md:ml-auto"
                        title="Refresh rooms"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {rooms.length === 0 ? (
                    <div className="bg-gray-800/50 rounded-2xl p-8 md:p-12 text-center border border-gray-700">
                        <div className="text-5xl md:text-6xl mb-4">🚀</div>
                        <h3 className="text-lg md:text-xl text-white font-semibold mb-2">No Rooms Yet</h3>
                        <p className="text-gray-400 text-sm md:text-base mb-4">Create your first room or join an existing one to start collaborating</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 md:px-6 py-2 rounded-lg transition"
                        >
                            Create Room
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.roomId}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-blue-500/50 group cursor-pointer"
                                onClick={() => navigate(`/room/${room.roomId}`)}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base md:text-lg font-semibold text-white mb-1 truncate">
                                                {room.roomName}
                                            </h3>
                                            <p className="text-gray-400 text-xs md:text-sm font-mono">ID: {room.roomId}</p>
                                        </div>
                                        {room.ownerEmail === user.email && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirm(room.roomId);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition ml-2 flex-shrink-0"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                                            {room.language}
                                        </span>
                                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                                            {room.participantCount} participant{room.participantCount !== 1 ? 's' : ''}
                                        </span>
                                        {room.ownerEmail === user.email && (
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                                                Owner
                                            </span>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/room/${room.roomId}`);
                                        }}
                                        className="w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-400 py-2 rounded-lg transition font-medium text-sm md:text-base"
                                    >
                                        Join Room →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
                    <div className="bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Room</h2>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2 text-sm md:text-base">Room Name</label>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition text-sm md:text-base"
                                placeholder="My Coding Session"
                                autoFocus
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2 text-sm md:text-base">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition text-sm md:text-base"
                            >
                                <option value="java">☕ Java</option>
                                <option value="python">🐍 Python</option>
                                <option value="javascript">📜 JavaScript</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCreateRoom}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setRoomName('');
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Room Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
                    <div className="bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Join Room</h2>
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2 text-sm md:text-base">Room ID</label>
                            <input
                                type="text"
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500 transition font-mono text-center text-lg md:text-xl"
                                placeholder="ABCD12"
                                maxLength={6}
                                autoFocus
                            />
                            <p className="text-gray-500 text-xs mt-2">Enter the 6-character room ID</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleJoinRoom}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Join
                            </button>
                            <button
                                onClick={() => {
                                    setShowJoinModal(false);
                                    setJoinRoomId('');
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
                    <div className="bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                        <div className="text-center mb-4">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 md:w-8 md:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Delete Room?</h2>
                            <p className="text-gray-400 text-sm">
                                This action cannot be undone. All code and data will be permanently deleted.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDeleteRoom(deleteConfirm)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoom, updateCode } from '../services/api';
import Editor from '@monaco-editor/react';
import webSocketService from '../services/websocket';
import { executeCode } from '../services/api';

const Room = () => {
    const { roomId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [code, setCode] = useState('');
    const [participants, setParticipants] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [language, setLanguage] = useState('java');
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const typingTimeoutRef = useRef(null);
    const codeUpdateTimeoutRef = useRef(null);
    const [output, setOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [showOutput, setShowOutput] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadRoom();
        
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (codeUpdateTimeoutRef.current) clearTimeout(codeUpdateTimeoutRef.current);
            if (webSocketService.isConnected()) {
                webSocketService.send('/app/room.leave', {
                    roomId: roomId,
                    eventType: 'LEAVE',
                    participantEmail: user.email,
                    participantName: user.email
                });
                webSocketService.disconnect();
            }
        };
    }, [roomId, user]);

    const loadRoom = async () => {
        try {
            const response = await getRoom(roomId, user.email);
            setRoom(response.data);
            setCode(response.data.codeContent);
            setLanguage(response.data.language);
            connectWebSocket();
        } catch (error) {
            console.error('Failed to load room:', error);
            alert('Room not found');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const connectWebSocket = () => {
        webSocketService.connect(
            roomId,
            user.email,
            (type, data) => {
                switch (type) {
                    case 'code':
                        if (data.senderEmail !== user.email) {
                            setCode(data.codeContent);
                        }
                        break;
                    case 'typing':
                        if (data.senderEmail !== user.email) {
                            if (data.typing) {
                                setTypingUsers(prev => {
                                    if (!prev.includes(data.senderEmail)) {
                                        return [...prev, data.senderEmail];
                                    }
                                    return prev;
                                });
                            } else {
                                setTypingUsers(prev => prev.filter(email => email !== data.senderEmail));
                            }
                        }
                        setTimeout(() => {
                            setTypingUsers(prev => prev.filter(email => email !== data.senderEmail));
                        }, 3000);
                        break;
                    case 'participants':
                        setParticipants(data.participants || []);
                        break;
                    default:
                        break;
                }
            },
            () => {
                setConnected(false);
            }
        );
        
        setConnected(true);
    };

    const handleCodeChange = (value) => {
        setCode(value);
        
        if (webSocketService.isConnected()) {
            webSocketService.send('/app/typing.start', {
                roomId: roomId,
                senderEmail: user.email,
                username: user.email,
                typing: true
            });
        }
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        
        typingTimeoutRef.current = setTimeout(() => {
            if (webSocketService.isConnected()) {
                webSocketService.send('/app/typing.stop', {
                    roomId: roomId,
                    senderEmail: user.email,
                    username: user.email,
                    typing: false
                });
            }
        }, 2000);
        
        if (codeUpdateTimeoutRef.current) clearTimeout(codeUpdateTimeoutRef.current);
        
        codeUpdateTimeoutRef.current = setTimeout(() => {
            if (webSocketService.isConnected()) {
                webSocketService.send('/app/code.update', {
                    roomId: roomId,
                    codeContent: value,
                    senderEmail: user.email
                });
            }
            updateCode(roomId, value, user.email).catch(console.error);
        }, 500);
    };

    const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('⏳ Executing code...');
    setShowOutput(true);
    
    try {
        const response = await executeCode({
            code: code,
            language: language,
            roomId: roomId,
            userEmail: user.email
        });
        
        if (response.data.success) {
            if (response.data.output) {
                setOutput(response.data.output);
            } else {
                setOutput('✅ Code executed successfully (no output)');
            }
        } else {
            setOutput(`❌ Error:\n${response.data.error}`);
        }
    } catch (error) {
        console.error('Execution failed:', error);
        setOutput(`❌ Failed to execute code: ${error.response?.data?.message || error.message}`);
    } finally {
        setIsExecuting(false);
    }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const leaveRoom = () => {
        if (webSocketService.isConnected()) {
            webSocketService.send('/app/room.leave', {
                roomId: roomId,
                eventType: 'LEAVE',
                participantEmail: user.email,
                participantName: user.email
            });
            // Small delay to ensure message is sent before disconnecting
            setTimeout(() => {
                webSocketService.disconnect();
                navigate('/dashboard');
            }, 100);
        } else {
            navigate('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading room...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Navbar */}
            <nav className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 p-4 sticky top-0 z-10">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">&lt;/&gt;</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">CodeCollab</h1>
                            <p className="text-gray-400 text-sm line-clamp-1">{room?.roomName}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Run Code Button */}
                        <button
                            onClick={handleRunCode}
                            disabled={isExecuting}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                                isExecuting 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                            } text-white`}
                        >
                            {isExecuting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Running...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Run Code
                                </>
                            )}
                        </button>
                        
                        <div className="text-center">
                            <p className="text-gray-400 text-xs">Room ID</p>
                            <button
                                onClick={copyRoomId}
                                className="text-blue-400 hover:text-blue-300 font-mono text-sm flex items-center gap-1"
                            >
                                {roomId}
                                {copySuccess && <span className="text-green-400 text-xs">✓ Copied!</span>}
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-gray-400 text-xs">Language</p>
                            <p className="text-white text-sm capitalize">{language}</p>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-gray-400 text-xs">Participants</p>
                            <p className="text-white text-sm">{participants.length}</p>
                        </div>
                        
                        <button
                            onClick={leaveRoom}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition border border-red-500/20 text-sm"
                        >
                            Leave Room
                        </button>
                        
                        <button
                            onClick={logout}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Connection Status */}
            <div className={`text-center py-1 text-xs font-medium ${connected ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                {connected ? '🟢 Connected to collaboration server' : '🟡 Connecting...'}
            </div>

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
                <div className="bg-gray-800/80 text-gray-300 text-sm py-2 px-4 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                            {typingUsers.slice(0, 3).map((user, i) => (
                                <div key={i} className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                                    {user[0].toUpperCase()}
                                </div>
                            ))}
                        </div>
                        <span>
                            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                        </span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Editor Section */}
                <div className="flex-1">
                    <Editor
                        height="calc(100vh - 120px)"
                        language={language}
                        value={code}
                        onChange={handleCodeChange}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: 'Consolas, monospace',
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 4,
                            wordWrap: 'on',
                            lineNumbers: 'on',
                            renderWhitespace: 'selection',
                            smoothScrolling: true,
                        }}
                    />
                </div>
                
                {/* Output Panel - Toggle Button */}
                <button
                    onClick={() => setShowOutput(!showOutput)}
                    className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition z-20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>

                {/* Output Panel */}
                {showOutput && (
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-10 animate-slideUp">
                        <div className="flex justify-between items-center p-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="text-white font-semibold">Output</h3>
                                <span className="text-gray-400 text-xs">({language.toUpperCase()})</span>
                            </div>
                            <button
                                onClick={() => setShowOutput(false)}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 max-h-64 overflow-y-auto">
                            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                {output || 'Click "Run Code" to execute your code'}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Participants Sidebar */}
                <div className="w-72 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Participants ({participants.length})
                    </h3>
                    <div className="space-y-2">
                        {participants.map((participant) => {
                            const isCurrentUser = participant === user?.email;
                            return (
                                <div
                                    key={participant}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition ${
                                        isCurrentUser ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                            {participant[0].toUpperCase()}
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${connected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-200 text-sm font-medium">
                                            {participant.split('@')[0]}
                                            {isCurrentUser && <span className="text-blue-400 text-xs ml-1">(you)</span>}
                                        </p>
                                        <p className="text-gray-500 text-xs">{participant}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {participants.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-500 text-sm">No other participants</div>
                                <p className="text-gray-600 text-xs mt-1">Share the room ID to invite others</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Invite Section */}
                    {participants.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <p className="text-gray-400 text-xs mb-2">Share this room ID:</p>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-gray-900 p-2 rounded text-blue-400 text-sm font-mono text-center">
                                    {roomId}
                                </code>
                                <button
                                    onClick={copyRoomId}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Room;
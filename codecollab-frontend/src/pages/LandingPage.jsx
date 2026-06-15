import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (user) {
            navigate('/dashboard');
        }

        // Add scroll effect for navbar
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
            }`}>
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg md:text-xl font-bold">&lt;/&gt;</span>
                            </div>
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                CodeCollab
                            </span>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white px-3 md:px-4 py-2 rounded-lg transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition"
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 md:pt-32 pb-12 md:pb-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center">
                        <div className="inline-block mb-4 px-3 py-1 bg-blue-500/10 rounded-full">
                            <span className="text-blue-400 text-sm">🚀 Real-time Collaboration</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                            Code Together,
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                In Real-Time
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                            Collaborate with your team in real-time, share code, and solve problems together.
                            The ultimate platform for pair programming and code reviews.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105"
                            >
                                Get Started Free
                            </Link>
                            <a
                                href="#features"
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-lg transition"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-blue-400">Real-time</div>
                            <div className="text-gray-500 text-sm mt-1">Code Sync</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-purple-400">Multi-Language</div>
                            <div className="text-gray-500 text-sm mt-1">Java, Python, JS</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-green-400">Live</div>
                            <div className="text-gray-500 text-sm mt-1">Typing Indicators</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-orange-400">Secure</div>
                            <div className="text-gray-500 text-sm mt-1">JWT Auth</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Everything you need for seamless collaboration
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Real-time Code Editor</h3>
                            <p className="text-gray-400">
                                Powerful Monaco editor with syntax highlighting, auto-completion, and real-time sync across all participants.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Live Participants</h3>
                            <p className="text-gray-400">
                                See who's online, track cursors, and know when someone is typing with real-time indicators.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition group">
                            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Execute Code</h3>
                            <p className="text-gray-400">
                                Run Java, Python, and JavaScript code directly in the browser. See output instantly.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition group">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition">
                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Session History</h3>
                            <p className="text-gray-400">
                                All your rooms are saved. Come back anytime to continue your work.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Secure Rooms</h3>
                            <p className="text-gray-400">
                                Private rooms with unique IDs. Only people with the room ID can join.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition group">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Multi-Language</h3>
                            <p className="text-gray-400">
                                Support for Java, Python, and JavaScript. More languages coming soon.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 md:py-20 bg-gray-800/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-400">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Create an Account</h3>
                            <p className="text-gray-400">
                                Sign up for free with your email address. No credit card required.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Create or Join a Room</h3>
                            <p className="text-gray-400">
                                Start a new coding session or join an existing one with a room ID.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-green-400">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Start Collaborating</h3>
                            <p className="text-gray-400">
                                Write code together in real-time, run it, and see results instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to Collaborate?
                        </h2>
                        <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                            Join thousands of developers coding together on CodeCollab
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-white text-purple-600 px-6 md:px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105"
                        >
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">&lt;/&gt;</span>
                            </div>
                            <span className="text-gray-400 text-sm">CodeCollab</span>
                        </div>
                        <div className="flex gap-6">
                            <Link to="/login" className="text-gray-500 hover:text-gray-400 text-sm transition">
                                Login
                            </Link>
                            <Link to="/signup" className="text-gray-500 hover:text-gray-400 text-sm transition">
                                Sign Up
                            </Link>
                            <a href="#features" className="text-gray-500 hover:text-gray-400 text-sm transition">
                                Features
                            </a>
                        </div>
                        <div className="text-gray-600 text-xs">
                            © 2026 CodeCollab. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
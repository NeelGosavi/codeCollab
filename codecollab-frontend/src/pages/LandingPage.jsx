import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
    const featuresRef = useRef([]);
    const statsRef = useRef(null);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Add mouse move effect for hero section
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        // Animate counters when stats come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounterAnimation();
                    observer.disconnect();
                }
            });
        });
        
        if (statsRef.current) {
            observer.observe(statsRef.current);
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [user, navigate]);

    const startCounterAnimation = () => {
        const targets = [100, 3, 1000, 99];
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        
        targets.forEach((target, index) => {
            let current = 0;
            const increment = target / steps;
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                setCounterValues(prev => {
                    const newValues = [...prev];
                    newValues[index] = Math.floor(current);
                    return newValues;
                });
            }, stepTime);
        });
    };

    const features = [
        {
            icon: "💻",
            title: "Real-time Code Editor",
            description: "Powerful Monaco editor with syntax highlighting, auto-completion, and real-time sync across all participants.",
            color: "blue",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: "👥",
            title: "Live Participants",
            description: "See who's online, track cursors, and know when someone is typing with real-time indicators.",
            color: "purple",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: "⚡",
            title: "Execute Code",
            description: "Run Java, Python, and JavaScript code directly in the browser. See output instantly.",
            color: "green",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: "📚",
            title: "Session History",
            description: "All your rooms are saved. Come back anytime to continue your work.",
            color: "yellow",
            gradient: "from-yellow-500 to-orange-500"
        },
        {
            icon: "🔒",
            title: "Secure Rooms",
            description: "Private rooms with unique IDs. Only people with the room ID can join.",
            color: "red",
            gradient: "from-red-500 to-rose-500"
        },
        {
            icon: "🌐",
            title: "Multi-Language",
            description: "Support for Java, Python, and JavaScript. More languages coming soon.",
            color: "indigo",
            gradient: "from-indigo-500 to-purple-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
            {/* Animated Background Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
            }`}>
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center animate-bounce-slow group-hover:scale-110 transition">
                                <span className="text-white text-lg md:text-xl font-bold">&lt;/&gt;</span>
                            </div>
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition">
                                CodeCollab
                            </span>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-white/10"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center">
                        <div className="inline-block mb-4 px-3 py-1 bg-blue-500/10 rounded-full animate-pulse">
                            <span className="text-blue-400 text-sm">🚀 Real-time Collaboration</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fadeInUp">
                            Code Together,
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                                In Real-Time
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 animate-fadeInUp animation-delay-200">
                            Collaborate with your team in real-time, share code, and solve problems together.
                            The ultimate platform for pair programming and code reviews.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-400">
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl group"
                            >
                                Get Started Free
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition">→</span>
                            </Link>
                            <a
                                href="#features"
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Floating Code Editor Preview */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-2xl px-4 animate-float">
                    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                        <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-400 text-xs ml-2">main.java</span>
                        </div>
                        <div className="p-4 font-mono text-sm">
                            <div className="text-purple-400">public class</div>
                            <div className="text-yellow-400 ml-4">public static void main(String[] args) {'{'}</div>
                            <div className="text-blue-400 ml-8 animate-pulse">System.out.println("Hello CodeCollab!");</div>
                            <div className="text-gray-500 ml-4">{'}'}</div>
                            <div className="text-green-400 animate-pulse">// Real-time collaboration</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-20 mt-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/50 transition-all hover:scale-105 cursor-pointer">
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {counterValues[0]}+
                            </div>
                            <div className="text-gray-500 text-sm mt-1">Lines of Code</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/50 transition-all hover:scale-105 cursor-pointer">
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {counterValues[1]}+
                            </div>
                            <div className="text-gray-500 text-sm mt-1">Languages</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/50 transition-all hover:scale-105 cursor-pointer">
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                {counterValues[2]}+
                            </div>
                            <div className="text-gray-500 text-sm mt-1">Active Users</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/50 transition-all hover:scale-105 cursor-pointer">
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                {counterValues[3]}%
                            </div>
                            <div className="text-gray-500 text-sm mt-1">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp">
                            Powerful Features
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
                            Everything you need for seamless collaboration
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                ref={el => featuresRef.current[index] = el}
                                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-transparent transition-all duration-500 cursor-pointer group animate-fadeInUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onMouseEnter={() => setActiveFeature(index)}
                                onMouseLeave={() => setActiveFeature(null)}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 transition-all group-hover:text-gray-300">
                                    {feature.description}
                                </p>
                                <div className={`mt-4 w-0 h-0.5 bg-gradient-to-r ${feature.gradient} transition-all duration-500 ${activeFeature === index ? 'w-full' : ''}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 md:py-20 bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp">
                            How It Works
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group animate-fadeInUp animation-delay-300">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                                <span className="text-3xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Create an Account</h3>
                            <p className="text-gray-400">Sign up for free with your email address. No credit card required.</p>
                        </div>

                        <div className="text-center group animate-fadeInUp animation-delay-400">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                                <span className="text-3xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Create or Join a Room</h3>
                            <p className="text-gray-400">Start a new coding session or join an existing one with a room ID.</p>
                        </div>

                        <div className="text-center group animate-fadeInUp animation-delay-500">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                                <span className="text-3xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Start Collaborating</h3>
                            <p className="text-gray-400">Write code together in real-time, run it, and see results instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Loved by Developers
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            See what people are saying about CodeCollab
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-all duration-300">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4">"Best real-time coding platform I've ever used. The collaboration features are incredible!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                <div>
                                    <p className="text-white font-semibold">Alex Johnson</p>
                                    <p className="text-gray-500 text-sm">Senior Developer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-all duration-300 md:mt-8">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4">"Perfect for pair programming interviews. The real-time sync is flawless!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                <div>
                                    <p className="text-white font-semibold">Sarah Chen</p>
                                    <p className="text-gray-500 text-sm">Tech Lead</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-all duration-300">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4">"The multi-language support is amazing. Great for teaching coding!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                                <div>
                                    <p className="text-white font-semibold">Mike Ross</p>
                                    <p className="text-gray-500 text-sm">Instructor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center transform hover:scale-105 transition-all duration-500">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to Collaborate?
                        </h2>
                        <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                            Join thousands of developers coding together on CodeCollab
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-white text-purple-600 px-6 md:px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-110 hover:shadow-xl group"
                        >
                            Get Started Now
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">&lt;/&gt;</span>
                            </div>
                            <span className="text-gray-400 text-sm group-hover:text-white transition">CodeCollab</span>
                        </div>
                        <div className="flex gap-6">
                            <Link to="/login" className="text-gray-500 hover:text-gray-400 text-sm transition hover:scale-105">
                                Login
                            </Link>
                            <Link to="/signup" className="text-gray-500 hover:text-gray-400 text-sm transition hover:scale-105">
                                Sign Up
                            </Link>
                            <a href="#features" className="text-gray-500 hover:text-gray-400 text-sm transition hover:scale-105">
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
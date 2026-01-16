import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AuroraBackground } from './components/AuroraBackground';
import Leaderboard from './components/Leaderboard';
import AddParticipationForm from './components/AddParticipationForm';
import Login from './components/Login';
import Profile from './components/Profile';
import logo from './assets/RaukRacing-cropped.svg';

function App() {
    const [session, setSession] = useState(null);
    const [view, setView] = useState('home'); // 'home', 'login', 'profile'
    const [showAddForm, setShowAddForm] = useState(false);
    const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);
    const [initialFormData, setInitialFormData] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);

            // Handle view changes based on events
            if (event === 'SIGNED_IN') {
                setView('home');
            } else if (event === 'SIGNED_OUT') {
                setView('home');
                setShowAddForm(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []); // Empty dependency array to prevent loops logic

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error.message);
        setView('home');
        setShowAddForm(false);
        // Clean URL
        window.history.replaceState({}, '', '/');
    };

    const handleTimeAdded = () => {
        setShowAddForm(false);
        setRefreshLeaderboard(prev => prev + 1);
        setInitialFormData(null);
    };

    const handleHomeClick = () => {
        setView('home');
        setShowAddForm(false);
        setInitialFormData(null);
    };

    const handleAddFromLeaderboard = (raceData) => {
        if (!session) {
            setView('login');
            return;
        }
        setInitialFormData(raceData);
        setShowAddForm(true);
        setView('home'); // Ensure we are on home view
    };

    return (
        <AuroraBackground className="text-slate-900 dark:text-white font-display selection:bg-primary/30 !items-stretch !justify-start">

            {view === 'login' ? (
                <Login onLoginSuccess={() => setView('home')} onCancel={() => setView('home')} />
            ) : (
                <>
                    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/5 glass px-6 md:px-10 py-3">
                        <div className="flex items-center gap-8 cursor-pointer group" onClick={handleHomeClick}>
                            <div className="flex items-center gap-3 group-hover:scale-110 transition-all duration-700">
                                <img
                                    src={logo}
                                    alt="RaukRacing-cropped"
                                    className="h-8 w-auto  drop-shadow-[0_0_8px_rgba(0,0,0,0.2)] filter"
                                />
                                <span className="text-white text-xl font-bold tracking-tight">Rauk Racing</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 lg:gap-8">

                            <div className="flex gap-3 items-center">
                                {session ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (view === 'profile') setView('home');
                                                setShowAddForm(!showAddForm);
                                                if (!showAddForm) setInitialFormData(null); // Reset if opening fresh
                                            }}
                                            className=" cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg active:scale-95 z-20"
                                        >
                                            {showAddForm ? 'Cancel' : 'Add Race'}
                                        </button>
                                        <button
                                            onClick={() => setView(view === 'profile' ? 'home' : 'profile')}
                                            className={`flex items-center justify-center rounded-lg h-9 w-9 transition-colors z-20 ${view === 'profile' ? 'bg-primary text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                            title="Profile"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">person</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setView('login')}
                                        className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/5 z-20"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 md:py-10 flex flex-col gap-10">
                        {view === 'profile' ? (
                            <Profile session={session} onLogout={handleLogout} />
                        ) : (
                            <>
                                <section>
                                    <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
                                        <div>
                                            <h2 className="text-white md:text-xl text-base font-bold tracking-tight">
                                                {showAddForm ? 'Log Your Performance' : 'Latest Races'}
                                            </h2>
                                            <p className="text-white/50 text-sm mt-1 ">
                                                {showAddForm ? ' Add your finish time to the leaderboard' : 'Explore upcoming challenges and past results'}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {session && showAddForm && (
                                    <section className="mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
                                        <AddParticipationForm
                                            onAdded={handleTimeAdded}
                                            initialData={initialFormData}
                                        />
                                    </section>
                                )}

                                <section>
                                    <Leaderboard
                                        refreshTrigger={refreshLeaderboard}
                                        onAddParticipation={handleAddFromLeaderboard}
                                    />
                                </section>
                            </>
                        )}
                    </main>

                    <footer className="mt-auto border-t border-white/5 py-10 px-6 md:px-10 text-center">
                        <p className="text-white/30 text-sm">© 2026 Rauk Racing. All rights reserved. </p>
                    </footer>
                </>
            )}
        </AuroraBackground>
    );
}

export default App;

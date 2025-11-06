import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ForumPost } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SendIcon } from './icons/SendIcon';

const CommunityPage: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'feed' | 'sessions'>('feed');
    const [posts, setPosts] = useLocalStorage<ForumPost[]>('forumPosts', []);
    const [newPostContent, setNewPostContent] = useState('');

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        const newPost: ForumPost = {
            id: crypto.randomUUID(),
            content: newPostContent.trim(),
            createdAt: Date.now(),
            userName: t('you'),
            userAvatar: 'U',
        };

        setPosts(prevPosts => [newPost, ...prevPosts]);
        setNewPostContent('');
    };
    
    const formatPostTime = (timestamp: number) => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);

        if (seconds < 60) return t('justNow');
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('minutesAgo', { count: minutes });

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return t('hoursAgo', { count: hours });

        const days = Math.floor(hours / 24);
        return t('daysAgo', { count: days });
    };

    return (
        <div className="p-4 md:p-8 min-h-screen bg-brand-bg dark:bg-dark-bg">
            <header className="mb-8 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('communityTitle')}</h1>
                <p className="text-brand-text-secondary dark:text-dark-text-secondary mt-2">{t('communityDesc')}</p>
            </header>

            <main className="max-w-4xl mx-auto">
                 {/* Tabs */}
                <div className="flex bg-slate-100 dark:bg-dark-elev1 rounded-xl p-1 space-x-1 mb-8">
                    {(['feed', 'sessions'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full h-10 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === tab ? 'bg-white dark:bg-dark-surface shadow' : 'hover:bg-white/50 dark:hover:bg-dark-surface/50 text-brand-text-secondary dark:text-dark-text-secondary'}`}
                        >
                            <span className="capitalize">{t(tab)}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'feed' && (
                    <section>
                         {/* Create Post Form */}
                        <form onSubmit={handlePostSubmit} className="mb-6">
                            <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios border dark:border-dark-border p-4 flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-brand-primary">
                                    U
                                </div>
                                <textarea
                                    value={newPostContent}
                                    onChange={e => setNewPostContent(e.target.value)}
                                    placeholder={t('whatsOnYourMindCommunity')}
                                    rows={2}
                                    className="flex-grow bg-transparent text-brand-text-primary dark:text-dark-text-primary placeholder:text-brand-text-secondary/60 dark:placeholder:text-dark-muted focus:outline-none resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!newPostContent.trim()}
                                    className="flex-shrink-0 bg-brand-primary hover:bg-blue-700 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-surface focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label={t('post')}
                                >
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        {/* Posts Feed */}
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post.id} className="bg-white dark:bg-dark-surface p-4 rounded-3xl shadow-ios border dark:border-dark-border flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-brand-primary">
                                        {post.userAvatar}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-bold text-brand-text-primary dark:text-dark-text-primary">{post.userName}</p>
                                            <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary">{formatPostTime(post.createdAt)}</p>
                                        </div>
                                        <p className="mt-1 text-brand-text-primary dark:text-dark-text-secondary whitespace-pre-wrap">{post.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {activeTab === 'sessions' && (
                    <section>
                        <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary mb-4">{t('upcomingSession')}</h2>
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-shrink-0 bg-brand-primary-tonal-bg dark:bg-dark-elev1 p-4 rounded-2xl">
                                <VideoCameraIcon className="w-8 h-8 text-brand-primary dark:text-dark-text-primary" />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                                <p className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary">Weekly Deep Work Session</p>
                                <p className="text-lg font-bold text-brand-text-primary dark:text-dark-text-primary">Today at 4:00 PM GMT+7</p>
                            </div>
                            <button className="w-full sm:w-auto flex-shrink-0 h-12 px-6 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-surface focus:ring-brand-primary">
                                {t('joinZoom')}
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default CommunityPage;
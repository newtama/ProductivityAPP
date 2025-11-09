import React, { useState, useRef, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ForumPost, Comment, UserRole, Course, Session } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SendIcon } from './icons/SendIcon';
import { BackIcon } from './icons/BackIcon';
import { LikeIcon } from './icons/LikeIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

const initialPosts: ForumPost[] = [
  {
    id: 'post-admin-1',
    content: 'Welcome to the community! What is the #1 thing you are focusing on this week? Share your goals and let\'s support each other!',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    userName: 'Admin',
    userAvatar: 'A',
    likes: 15,
    likedBy: [],
    comments: [
      {
        id: 'comment-1',
        text: 'Finishing my quarterly report! A bit of a grind, but it needs to be done.',
        userName: 'Jane Doe',
        userAvatar: 'J',
        createdAt: Date.now() - 86400000, // 1 day ago
      },
      {
        id: 'comment-2',
        text: 'Launching my new side project. A bit nervous but excited!',
        userName: 'John Smith',
        userAvatar: 'S',
        createdAt: Date.now() - 3600000 * 5, // 5 hours ago
      },
    ]
  }
];

const initialCourses: Course[] = [
    { id: 'course-1', titleKey: 'course1Title', descKey: 'course1Desc', imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1974&auto=format&fit=crop', status: 'active' },
    { id: 'course-2', titleKey: 'course2Title', descKey: 'course2Desc', imageUrl: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=2070&auto=format&fit=crop', status: 'coming_soon' }
];

const initialSession: Session = {
    title: 'Weekly Deep Work Session',
    time: 'Today at 4:00 PM GMT+7',
    link: 'https://zoom.us' // Example link
};


interface CommunityPageProps {
    role: UserRole;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ role }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'forum' | 'sessions' | 'courses'>('forum');
    const [posts, setPosts] = useLocalStorage<ForumPost[]>('forumPosts', initialPosts);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [newComment, setNewComment] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const commentInputRef = useRef<HTMLInputElement>(null);

    // Admin state
    const [courses, setCourses] = useLocalStorage<Course[]>('courses', initialCourses);
    const [sessionInfo, setSessionInfo] = useLocalStorage<Session>('sessionInfo', initialSession);
    const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState<Course | null | undefined>(undefined);
    const [tempSessionInfo, setTempSessionInfo] = useState(sessionInfo);
    const [tempCourseInfo, setTempCourseInfo] = useState<Partial<Course>>({});


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

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        const newPost: ForumPost = {
            id: crypto.randomUUID(),
            content: newPostContent.trim(),
            createdAt: Date.now(),
            userName: 'Admin',
            userAvatar: 'A',
            likes: 0,
            likedBy: [],
            comments: [],
        };

        setPosts(prev => [newPost, ...prev]);
        setNewPostContent('');
    };

    const handleLikePost = (postId: string) => {
        const updateLikes = (post: ForumPost) => {
            const hasLiked = post.likedBy.includes(t('you'));
            return {
                ...post,
                likes: hasLiked ? post.likes - 1 : post.likes + 1,
                likedBy: hasLiked ? post.likedBy.filter(u => u !== t('you')) : [...post.likedBy, t('you')],
            };
        };
        setPosts(prev => prev.map(p => p.id === postId ? updateLikes(p) : p));
        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updateLikes(selectedPost));
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedPost) return;

        const comment: Comment = {
            id: crypto.randomUUID(),
            text: newComment.trim(),
            userName: t('you'),
            userAvatar: 'U',
            createdAt: Date.now(),
        };

        const updatedPost = { ...selectedPost, comments: [...selectedPost.comments, comment] };
        setPosts(prev => prev.map(p => (p.id === selectedPost.id ? updatedPost : p)));
        setSelectedPost(updatedPost);
        setNewComment('');
    };
    
    // --- Admin Functions ---

    const handleOpenCourseModal = (course: Course | null) => {
        setCourseToEdit(course);
        setTempCourseInfo(course || { status: 'active' });
        setIsCourseModalOpen(true);
    };
    
    const handleSaveCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tempCourseInfo.titleKey || !tempCourseInfo.descKey || !tempCourseInfo.imageUrl) return;

        if (courseToEdit) { // Editing existing
            setCourses(prev => prev.map(c => c.id === courseToEdit.id ? { ...c, ...tempCourseInfo } as Course : c));
        } else { // Adding new
            const newCourse: Course = {
                id: crypto.randomUUID(),
                titleKey: tempCourseInfo.titleKey,
                descKey: tempCourseInfo.descKey,
                imageUrl: tempCourseInfo.imageUrl,
                status: tempCourseInfo.status || 'active',
            };
            setCourses(prev => [...prev, newCourse]);
        }
        setIsCourseModalOpen(false);
        setCourseToEdit(null);
        setTempCourseInfo({});
    };

    const handleRemoveCourse = (courseId: string) => {
        if (window.confirm(t('removeCourseConfirm'))) {
            setCourses(prev => prev.filter(c => c.id !== courseId));
        }
    };

    const handleSaveSession = () => {
        setSessionInfo(tempSessionInfo);
        setIsEditSessionModalOpen(false);
    };
    
    const isEditingCourse = useMemo(() => courseToEdit !== null, [courseToEdit]);

    return (
        <div className="p-4 md:p-8 min-h-screen bg-brand-bg dark:bg-dark-bg">
            <header className="mb-8 max-w-4xl mx-auto">
                 {selectedPost ? (
                    <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-text-primary dark:hover:text-dark-text-primary transition-colors mb-4">
                        <BackIcon className="w-5 h-5" />
                        <span className="font-semibold">{t('forum')}</span>
                    </button>
                 ) : (
                    <>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('communityTitle')}</h1>
                        <p className="text-brand-text-secondary dark:text-dark-text-secondary mt-2">{t('communityDesc')}</p>
                    </>
                 )}
            </header>

            <main className="max-w-4xl mx-auto">
                {!selectedPost && (
                    <div className="flex bg-slate-100 dark:bg-dark-elev1 rounded-xl p-1 space-x-1 mb-8">
                        {(['forum', 'sessions', 'courses'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full h-10 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === tab ? 'bg-white dark:bg-dark-surface shadow' : 'hover:bg-white/50 dark:hover:bg-dark-surface/50 text-brand-text-secondary dark:text-dark-text-secondary'}`}>
                                <span className="capitalize">{t(tab)}</span>
                            </button>
                        ))}
                    </div>
                )}
                
                {activeTab === 'forum' && (
                    <section>
                    {selectedPost ? (
                        <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios border dark:border-dark-border">
                            <div className="p-6 border-b border-brand-border dark:border-dark-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-brand-primary">{selectedPost.userAvatar}</div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-brand-text-primary dark:text-dark-text-primary">{selectedPost.userName}</p>
                                        <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary">{formatPostTime(selectedPost.createdAt)}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-brand-text-primary dark:text-dark-text-secondary whitespace-pre-wrap">{selectedPost.content}</p>
                            </div>
                             <div className="p-4 flex items-center gap-4 border-b border-brand-border dark:border-dark-border">
                                <button onClick={() => handleLikePost(selectedPost.id)} className={`flex items-center gap-2 font-semibold text-sm transition-colors ${selectedPost.likedBy.includes(t('you')) ? 'text-red-500' : 'text-brand-text-secondary dark:text-dark-text-secondary hover:text-red-500'}`}>
                                    <LikeIcon className={`w-5 h-5 ${selectedPost.likedBy.includes(t('you')) ? 'fill-current' : ''}`} />
                                    <span>{selectedPost.likes} {t('likes')}</span>
                                </button>
                                <button onClick={() => commentInputRef.current?.focus()} className="flex items-center gap-2 font-semibold text-sm text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-text-primary dark:hover:text-dark-text-primary transition-colors">
                                    <ChatBubbleIcon className="w-5 h-5" />
                                    <span>{selectedPost.comments.length} {t('comments')}</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                                {selectedPost.comments.map(comment => (
                                     <div key={comment.id} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-slate-400 text-sm">{comment.userAvatar}</div>
                                        <div className="flex-grow bg-slate-100 dark:bg-dark-elev1 rounded-2xl p-3">
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-bold text-sm text-brand-text-primary dark:text-dark-text-primary">{comment.userName}</p>
                                                <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary">{formatPostTime(comment.createdAt)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-brand-text-primary dark:text-dark-text-secondary">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleAddComment} className="p-4 border-t border-brand-border dark:border-dark-border flex items-center gap-3">
                                <input ref={commentInputRef} type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={`${t('reply')}...`} className="flex-grow h-10 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-full px-4 text-sm text-brand-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-brand-primary focus:bg-white dark:focus:bg-dark-surface transition" />
                                <button type="submit" disabled={!newComment.trim()} className="flex-shrink-0 bg-brand-primary hover:bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition-all disabled:opacity-50"><SendIcon className="w-5 h-5" /></button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {role === 'admin' && (
                                <form onSubmit={handleCreatePost} className="bg-white dark:bg-dark-surface p-4 rounded-3xl shadow-ios border dark:border-dark-border/50 space-y-3">
                                    <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('whatsOnYourMindCommunity')} rows={3} className="w-full bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent rounded-xl p-3 text-brand-text-primary dark:text-dark-text-primary placeholder:text-sm dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200 resize-none" />
                                    <button type="submit" disabled={!newPostContent.trim()} className="w-full h-11 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">{t('createPost')}</button>
                                </form>
                            )}
                            {posts.map(post => (
                                <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-white dark:bg-dark-surface p-4 rounded-3xl shadow-ios border dark:border-dark-border flex items-start gap-4 cursor-pointer hover:border-brand-primary/50 dark:hover:border-dark-text-primary/50 transition-all">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-brand-primary">{post.userAvatar}</div>
                                    <div className="flex-grow">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-bold text-brand-text-primary dark:text-dark-text-primary">{post.userName}</p>
                                            <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary">{formatPostTime(post.createdAt)}</p>
                                        </div>
                                        <p className="mt-1 text-brand-text-primary dark:text-dark-text-secondary whitespace-pre-wrap line-clamp-3">{post.content}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-brand-text-secondary dark:text-dark-text-secondary font-semibold">
                                            <span className="flex items-center gap-1.5"><LikeIcon className="w-4 h-4" /> {post.likes}</span>
                                            <span className="flex items-center gap-1.5"><ChatBubbleIcon className="w-4 h-4" /> {post.comments.length}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </section>
                )}

                {activeTab === 'sessions' && (
                     <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary">{t('upcomingSession')}</h2>
                            {role === 'admin' && (
                                <button onClick={() => { setTempSessionInfo(sessionInfo); setIsEditSessionModalOpen(true); }} className="flex items-center gap-2 text-sm font-semibold text-brand-primary dark:text-dark-text-primary hover:underline">
                                    <EditIcon className="w-4 h-4" /> {t('edit')}
                                </button>
                            )}
                        </div>
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-shrink-0 bg-brand-primary-tonal-bg dark:bg-dark-elev1 p-4 rounded-2xl"><VideoCameraIcon className="w-8 h-8 text-brand-primary dark:text-dark-text-primary" /></div>
                            <div className="flex-grow text-center sm:text-left"><p className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary">{sessionInfo.title}</p><p className="text-lg font-bold text-brand-text-primary dark:text-dark-text-primary">{sessionInfo.time}</p></div>
                            <a href={sessionInfo.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex-shrink-0 h-12 px-6 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center">{t('joinZoom')}</a>
                        </div>
                    </section>
                )}

                {activeTab === 'courses' && (
                    <section>
                        {role === 'admin' && (
                            <div className="mb-6 text-right">
                                <button onClick={() => handleOpenCourseModal(null)} className="inline-flex items-center gap-2 h-11 px-5 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
                                    <PlusIcon className="w-5 h-5" />
                                    <span>{t('addNewCourse')}</span>
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courses.map(course => (
                                <div key={course.id} className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios border dark:border-dark-border/50 overflow-hidden flex flex-col">
                                    <div className="relative aspect-video">
                                        <img src={course.imageUrl} alt={t(course.titleKey)} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        {role === 'admin' && (
                                            <div className="absolute top-2 right-2 flex items-center gap-2">
                                                <button onClick={() => handleOpenCourseModal(course)} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"><EditIcon className="w-4 h-4" /></button>
                                                <button onClick={() => handleRemoveCourse(course.id)} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-600 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-brand-text-primary dark:text-dark-text-primary">{t(course.titleKey)}</h3>
                                        <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary mt-1 flex-grow">{t(course.descKey)}</p>
                                        <button disabled={course.status === 'coming_soon'} className="w-full mt-4 h-11 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:bg-slate-200 dark:disabled:bg-dark-elev1 disabled:text-brand-text-primary dark:disabled:text-dark-text-primary disabled:cursor-not-allowed">
                                            {course.status === 'active' ? t('startCourse') : t('comingSoon')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

             {/* Admin Modals */}
            {isEditSessionModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setIsEditSessionModalOpen(false)}>
                    <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{t('editSession')}</h2>
                        <div className="space-y-4">
                            <div><label className="text-sm font-semibold">{t('sessionTitle')}</label><input type="text" value={tempSessionInfo.title} onChange={e => setTempSessionInfo({...tempSessionInfo, title: e.target.value})} className="w-full h-12 mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl px-4" /></div>
                            <div><label className="text-sm font-semibold">{t('sessionTime')}</label><input type="text" value={tempSessionInfo.time} onChange={e => setTempSessionInfo({...tempSessionInfo, time: e.target.value})} className="w-full h-12 mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl px-4" /></div>
                            <div><label className="text-sm font-semibold">{t('zoomLink')}</label><input type="text" value={tempSessionInfo.link} onChange={e => setTempSessionInfo({...tempSessionInfo, link: e.target.value})} className="w-full h-12 mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl px-4" /></div>
                        </div>
                        <div className="mt-6 flex gap-3"><button onClick={() => setIsEditSessionModalOpen(false)} className="w-full h-11 rounded-xl bg-slate-100 dark:bg-dark-elev1 font-semibold">{t('cancel')}</button><button onClick={handleSaveSession} className="w-full h-11 rounded-xl bg-brand-primary text-white font-semibold">{t('saveChanges')}</button></div>
                    </div>
                </div>
            )}
            
            {isCourseModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setIsCourseModalOpen(false)}>
                     <form onSubmit={handleSaveCourse} className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{isEditingCourse ? t('editCourse') : t('addCourse')}</h2>
                        <div className="space-y-4">
                            <div><label className="text-sm font-semibold">{t('courseTitleLabel')} Key</label><input required type="text" value={tempCourseInfo.titleKey || ''} onChange={e => setTempCourseInfo({...tempCourseInfo, titleKey: e.target.value})} className="w-full h-12 mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl px-4" /></div>
                            <div><label className="text-sm font-semibold">{t('courseDescription')} Key</label><textarea required value={tempCourseInfo.descKey || ''} onChange={e => setTempCourseInfo({...tempCourseInfo, descKey: e.target.value})} className="w-full mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl p-4" rows={3}/></div>
                            <div><label className="text-sm font-semibold">{t('courseImageURL')}</label><input required type="text" value={tempCourseInfo.imageUrl || ''} onChange={e => setTempCourseInfo({...tempCourseInfo, imageUrl: e.target.value})} className="w-full h-12 mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl px-4" /></div>
                            <div><label className="text-sm font-semibold">{t('courseStatus')}</label><select value={tempCourseInfo.status || 'active'} onChange={e => setTempCourseInfo({...tempCourseInfo, status: e.target.value as 'active' | 'coming_soon'})} className="w-full h-12 mt-1 bg-slate-100 dark:bg-dark-elev1 rounded-xl px-4 appearance-none"><option value="active">{t('active')}</option><option value="coming_soon">{t('comingSoon')}</option></select></div>
                        </div>
                        <div className="mt-6 flex gap-3"><button type="button" onClick={() => setIsCourseModalOpen(false)} className="w-full h-11 rounded-xl bg-slate-100 dark:bg-dark-elev1 font-semibold">{t('cancel')}</button><button type="submit" className="w-full h-11 rounded-xl bg-brand-primary text-white font-semibold">{t('saveChanges')}</button></div>
                    </form>
                </div>
            )}

        </div>
    );
};

export default CommunityPage;
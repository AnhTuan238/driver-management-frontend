import { useTranslation } from 'react-i18next';
import { useState, Fragment } from 'react';

import { SendIcon, CloseIcon, ChatIcon } from '~/components/UiComponents/Icon/Icon';
import formatDate from '~/utils/formatDate';
import { chatWithAI } from '~/api/chat';

function Chatbot() {
    const [isOpenChatbox, setIsOpenChatbox] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [question, setQuestion] = useState('');
    const { t } = useTranslation();

    const handleOpenChatbox = () => {
        setIsOpenChatbox((pre) => !pre);
    };

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        try {
            const res = await chatWithAI(question);
            const newMessage = {
                question: question,
                answer: res.data.answer || 'Không có phản hồi từ AI',
                timestamp: Date.now(),
            };
            setChatHistory((prev) => [...prev, newMessage]);
            setQuestion('');
        } catch (err) {
            setChatHistory((prev) => [
                ...prev,
                { question, answer: 'Something went wrong. Please try again in a few seconds!' },
            ]);
            setQuestion('');
            console.error(err);
        }
    };

    return (
        <>
            {isOpenChatbox ? (
                <div className='fixed right-10 bottom-25 z-2 w-80 bg-white shadow-md rounded-lg overflow-hidden border border-primary dark:bg-zinc-800'>
                    <div className='flex flex-col h-100'>
                        {/* HEADER */}
                        <div className='p-3 bg-primary border-b border-border dark:border-zinc-700'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg text-white font-bold'>{t('DriveBot')}</h2>
                                <div className='p-1 text-white rounded-full cursor-pointer' onClick={handleOpenChatbox}>
                                    <CloseIcon className='size-6' />
                                </div>
                            </div>
                        </div>

                        {/* CHAT CONTENT */}
                        <div className='flex-1 flex flex-col p-3 overflow-y-auto space-y-2'>
                            {chatHistory.map((msg, index) => (
                                <Fragment key={index}>
                                    <div className='self-end justify-items-end'>
                                        <div className='message justify-self-end bg-primary'>{msg.question}</div>
                                        <span className='text-xs text-gray-400 font-normal dark:text-white-dark'>
                                            {formatDate(msg.timestamp)}
                                        </span>
                                    </div>
                                    <div className='self-start'>
                                        <div className='message justify-self-start bg-gray-500/80'>{msg.answer}</div>
                                        <span className='text-xs text-gray-400 font-normal dark:text-white-dark'>
                                            {formatDate(msg.timestamp)}
                                        </span>
                                    </div>
                                </Fragment>
                            ))}
                        </div>

                        {/* SEND */}
                        <div className='p-2 border-t border-border dark:border-zinc-700'>
                            <form className='flex gap-2' onSubmit={handleAsk}>
                                <input
                                    type='text'
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder={t('Ask DriveBot about a driver...')}
                                    className='ps-4 pe-1 py-1 h-10 w-full text-[15px] text-[oklch(55.1%_.027_264.364)] font-normal bg-gray-500/10 cursor-text rounded-full outline-none dark:bg-gray-40/20 dark:border'
                                />

                                <button className='text-sm text-primary font-bold cursor-pointer' type='submit'>
                                    <SendIcon className='size-6' />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div onClick={handleOpenChatbox} className='fixed right-10 bottom-34 z-2 cursor-pointer'>
                    <ChatIcon className='size-14 text-primary' />
                </div>
            )}
        </>
    );
}

export default Chatbot;

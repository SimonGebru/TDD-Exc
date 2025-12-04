import { useMemo, useState } from 'react';
import { FiEdit2, FiMessageSquare } from 'react-icons/fi';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';

// Sätt global locale till svenska
dayjs.locale('sv');

export default function App({ initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Sortera meddelanden: nyaste först
  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [messages]
  );

  const hasMessages = sortedMessages.length > 0;

  const handleOpenForm = () => {
    setMessageText('');
    setUsername('');
    setError('');
    setView('create');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      setError('Meddelandet kan inte vara tomt.');
      return;
    }

    const newMessage = {
      id: Date.now(),
      text: messageText.trim(),
      author: username.trim() || 'Anonym',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
    setUsername('');
    setError('');
    setView('list');
  };

  const handleCancel = () => {
    setMessageText('');
    setUsername('');
    setError('');
    setView('list');
  };

  return (
    <main className="min-h-screen bg-[#0B1220] flex items-center justify-center py-6">
      {/* Mobil-container: ca 411x840 (Figma-storlek) */}
      <section className="w-[411px] h-[840px] bg-[#E5E5E5] shadow-2xl overflow-hidden relative">
        {/* Blå bakgrund innanför mobilen */}
        <div className="absolute inset-0 bg-[#19274A]" />

        {/*  S-badge högst upp (global) */}
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-[#EF4343] text-white text-2xl font-semibold px-4 py-3 rounded-br-md">
            S
          </div>
        </div>

        {/* Innehållsyta */}
        <div className="relative z-10 h-full">
          {/* LIST-VY */}
          {view === 'list' && (
            <>
              {hasMessages && (
                <div className="h-full pt-[20px] pb-[96px] px-[16px] overflow-y-auto">
                  {sortedMessages.map((msg) => (
                    <article
                      key={msg.id}
                      data-testid="message-card"
                      className="relative w-[379px] bg-white rounded-[3px] shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 pt-5 pb-7 mb-5"
                    >
                      {/* Ikon + datum-rad */}
                      <div className="flex items-center gap-2 mb-3">
                        <FiMessageSquare
                          aria-hidden="true"
                          className="w-4 h-4 text-slate-500"
                        />
                        <p className="text-[11px] text-slate-500">
                          {dayjs(msg.createdAt).format('ddd D MMM, HH:mm')}
                        </p>
                      </div>

                      {/* Själva meddelandet */}
                      <p className="text-[14px] text-slate-900 leading-snug mb-4">
                        {msg.text}
                      </p>

                      {/* Avsändare */}
                      <p className="text-[14px] font-semibold text-slate-900">
                        — {msg.author}
                      </p>

                      {/* Pratbubbel-spets längst ner till höger */}
                      <div className="absolute -bottom-4 right-10 w-0 h-0 border-t-[18px] border-t-white border-l-[18px] border-l-transparent" />
                    </article>
                  ))}
                </div>
              )}

              {!hasMessages && (
                <div className="relative h-full flex flex-col">
                  {/* Centerad text vid tom lista */}
                  <div className="flex-1 flex items-center justify-center px-6 text-center">
                    <p className="text-[20px] font-semibold text-white leading-snug">
                      Du har inga meddelanden att visa.
                    </p>
                  </div>

                  {/* Vågig botten i ljusblått */}
                  <div className="relative h-[160px] overflow-hidden">
                    <div className="absolute -bottom-10 -left-16 w-[260px] h-[140px] bg-[#00B2FFCC] rounded-t-full" />
                    <div className="absolute -bottom-24 left-80 w-[260px] h-[180px] bg-[#00B2FFCC] rounded-t-full" />
                    <div className="absolute -bottom-20 left-40 w-[260px] h-[160px] bg-[#00B2FFCC] rounded-t-full" />
                  </div>
                </div>
              )}

              {/* FAB-knapp – Nytt meddelande */}
              <button
                type="button"
                aria-label="Nytt meddelande"
                onClick={handleOpenForm}
                className="absolute z-30 w-[72px] h-[72px] bg-[#EF4343] border-2 border-[#EF4343] rounded-[4px] bottom-[24px] right-[16px] shadow-xl flex items-center justify-center"
              >
                <FiEdit2 aria-hidden="true" className="w-7 h-7 text-white" />
                <span className="sr-only">Nytt meddelande</span>
              </button>
            </>
          )}

          {/* SKRIV-VY */}
          {view === 'create' && (
            <div className="h-full flex flex-col px-[16px] pt-[87px] pb-6">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col flex-1 gap-5"
              >
                {/* Label för a11y + tester */}
                <label htmlFor="message" className="sr-only">
                  Meddelande
                </label>

                {/* Stor vit pratbubbla */}
                <div className="relative">
                  <textarea
                    id="message"
                    rows={6}
                    className="w-[379px] h-[464px] resize-none rounded-[3px] bg-white text-slate-900 text-base leading-snug p-4 shadow-[0_6px_18px_rgba(0,0,0,0.25)] focus:outline-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Låt oss baka pannkakor!"
                  />
                  <div className="absolute -bottom-4 right-10 w-0 h-0 border-t-[18px] border-t-white border-l-[18px] border-l-transparent" />
                </div>

                {/* Användarnamnfält */}
                <div className="mt-3">
                  <label htmlFor="username" className="sr-only">
                    Användarnamn
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-[379px] h-[72px] rounded-[3px] bg-[#19274A] border border-white/70 text-white text-base px-4 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Användarnamn"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-300 mt-1">{error}</p>
                )}

                {/* Publicera + Avbryt */}
                <div className="mt-auto flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-[379px] h-[72px] bg-[#EF4343] text-black font-semibold rounded-[4px] text-base tracking-wide hover:brightness-110 transition"
                  >
                    Publicera
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-[379px] text-white/80 text-xs py-2"
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


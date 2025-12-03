import { useMemo, useState } from 'react';

export default function App({ initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [messages]);

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-3xl shadow-xl p-5 flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Shui – React</h1>
          <p className="text-xs text-slate-400">
            Dela korta meddelanden med klassen.
          </p>
        </header>

        <div className="h-px bg-slate-800" />

        {/* LISTVY */}
        {view === 'list' && (
          <>
            {!hasMessages && (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-slate-300">
                  Du har inga meddelanden att visa.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  När du postar ett meddelande dyker det upp här.
                </p>
              </div>
            )}

            {hasMessages && (
              <div className="flex-1 max-h-80 overflow-y-auto pr-1">
                <ul className="space-y-3">
                  {sortedMessages.map((msg) => (
                    <li
                      key={msg.id}
                      data-testid="message-card"
                      className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5"
                    >
                      <p className="text-sm leading-snug mb-1">{msg.text}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                          — {msg.author}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <footer className="pt-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleOpenForm}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium px-4 py-2 transition-colors"
                >
                  Nytt meddelande
                </button>
              </div>
            </footer>
          </>
        )}

        {/* FORMVY */}
        {view === 'create' && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-slate-100"
              >
                Meddelande
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-slate-100"
              >
                Användarnamn
              </label>
              <input
                id="username"
                type="text"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMessageText('');
                  setUsername('');
                  setError('');
                  setView('list');
                }}
                className="text-xs px-3 py-2 rounded-full border border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium px-4 py-2 transition-colors"
              >
                Publicera
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}



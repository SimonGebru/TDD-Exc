import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Message list view', () => {
  test('visar tom-vy när det inte finns några meddelanden', () => {
    render(<App initialMessages={[]} />);

    expect(
      screen.getByText(/Du har inga meddelanden att visa\./i)
    ).toBeInTheDocument();
  });

  test('visar en lista med meddelanden, nyaste först', () => {
    const mockMessages = [
      {
        id: 1,
        text: 'Äldre meddelande',
        author: 'Anna',
        createdAt: '2024-11-03T09:23:00Z',
      },
      {
        id: 2,
        text: 'Nyare meddelande',
        author: 'Bertil',
        createdAt: '2024-11-03T16:19:00Z',
      },
    ];

    render(<App initialMessages={mockMessages} />);

    expect(screen.getByText(/Äldre meddelande/i)).toBeInTheDocument();
    expect(screen.getByText(/Nyare meddelande/i)).toBeInTheDocument();

    const cards = screen.getAllByTestId('message-card');

    expect(cards[0]).toHaveTextContent('Nyare meddelande');
    expect(cards[1]).toHaveTextContent('Äldre meddelande');
  });
});

describe('Create new message flow', () => {
  test('kan navigera till formuläret via knappen "Nytt meddelande"', async () => {
    const user = userEvent.setup();
    render(<App initialMessages={[]} />);

    const button = screen.getByRole('button', { name: /nytt meddelande/i });
    await user.click(button);

    expect(screen.getByLabelText(/Meddelande/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Användarnamn/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /publicera/i })
    ).toBeInTheDocument();
  });

  test('visar felmeddelande om man försöker posta utan text', async () => {
    const user = userEvent.setup();
    render(<App initialMessages={[]} />);

    await user.click(
      screen.getByRole('button', { name: /nytt meddelande/i })
    );

    await user.click(
      screen.getByRole('button', { name: /publicera/i })
    );

    expect(
      screen.getByText(/meddelandet kan inte vara tomt/i)
    ).toBeInTheDocument();
  });

  test('lyckad post: meddelandet sparas och visas överst i listan', async () => {
    const user = userEvent.setup();
    render(<App initialMessages={[]} />);

    await user.click(
      screen.getByRole('button', { name: /nytt meddelande/i })
    );

    const msgInput = screen.getByLabelText(/Meddelande/i);
    const userInput = screen.getByLabelText(/Användarnamn/i);

    await user.type(msgInput, 'Hej världen');
    await user.type(userInput, 'Simon');

    await user.click(
      screen.getByRole('button', { name: /publicera/i })
    );

    // Tillbaka i listvyn
    expect(screen.getByText(/Hej världen/i)).toBeInTheDocument();
    expect(screen.getByText(/— Simon/i)).toBeInTheDocument();

    const cards = screen.getAllByTestId('message-card');
    expect(cards[0]).toHaveTextContent('Hej världen');
  });
});

describe('Navigation & form reset', () => {
  test('Avbryt rensar formuläret och går tillbaka till listan', async () => {
    const user = userEvent.setup();
    render(<App initialMessages={[]} />);

    // Gå till formuläret
    await user.click(screen.getByRole('button', { name: /nytt meddelande/i }));

    // Skriv något
    await user.type(screen.getByLabelText(/Meddelande/i), 'Något text');
    await user.type(screen.getByLabelText(/Användarnamn/i), 'Simon');

    // Klicka på avbryt
    await user.click(screen.getByRole('button', { name: /avbryt/i }));

    // Vi ska vara tillbaka i listvyn
    expect(
      screen.getByText(/Du har inga meddelanden att visa/i)
    ).toBeInTheDocument();

    // Öppna forumläret igen
    await user.click(screen.getByRole('button', { name: /nytt meddelande/i }));

    // Fälten ska vara tomma
    expect(screen.getByLabelText(/Meddelande/i).value).toBe('');
    expect(screen.getByLabelText(/Användarnamn/i).value).toBe('');
  });
});
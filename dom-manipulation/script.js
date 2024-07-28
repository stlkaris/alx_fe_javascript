document.addEventListener('DOMContentLoaded', () => {
  const apiURL = 'https://jsonplaceholder.typicode.com/posts';
  const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
  const quotes = storedQuotes || [];
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const addQuoteButton = document.getElementById('addQuote');
  const importFileInput = document.getElementById('importFile');
  const exportButton = document.getElementById('exportButton');

  const saveQuotes = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  };

  const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  };

  const addQuote = () => {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      saveQuotes();
      alert('Quote added successfully!');
      syncToServer({ text, category });
    } else {
      alert('Please enter both quote and category.');
    }
  };

  const importFromJsonFile = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  };

  const exportToJsonFile = () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const syncToServer = (quote) => {
    fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(data => console.log('Quote synced to server:', data))
      .catch(error => console.error('Error syncing to server:', error));
  };

  const fetchFromServer = () => {
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        data.forEach(quote => {
          if (!quotes.some(q => q.text === quote.text && q.category === quote.category)) {
            quotes.push({ text: quote.title, category: quote.body });
          }
        });
        saveQuotes();
        alert('Quotes fetched from server and merged!');
      })
      .catch(error => console.error('Error fetching from server:', error));
  };

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  importFileInput.addEventListener('change', importFromJsonFile);
  exportButton.addEventListener('click', exportToJsonFile);

  // Show the last viewed quote from session storage if available
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
    quoteDisplay.textContent = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
  } else {
    // Show a random quote on initial load
    showRandomQuote();
  }

  // Fetch data from the server periodically
  setInterval(fetchFromServer, 60000); // every 60 seconds
});


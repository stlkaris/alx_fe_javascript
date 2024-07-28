document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    {text: "Genius is one percent inspiration and ninety-nine percent perspiration.", category: "inspirational"},
    {text: "You can observe a lot just by watching.", category: "Motivational"},
    {text: "A house divided against itself cannot stand.", category: "life"},
    {text: "Difficulties increase the nearer we get to the goal.", category: "inspirational"},
    {text: "Fate is in your hands and no one else's.", category: "life"},
    {text: "Be the chief but never the lord.", category: "motivational"},
    {text: "Nothing happens unless first we dream.", category: "motivational"},
    {text: "Well begun is half done.", category: "inspirational"},
    {text: "The best way to predict the future is to invent it.", category: "Inspiration"},
    {text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life"},
    {text: "Good artists copy, great artists steal.", category: "Creativity"}
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const addQuoteButton = document.getElementById('addQuote');
  const importFileInput = document.getElementById('importFile');
  const exportButton = document.getElementById('exportButton');
  const categoryFilter = document.getElementById('categoryFilter');

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  const getUniqueCategories = () => {
    const categories = quotes.map(quote => quote.category);
    return ['all', ...new Set(categories)];
  };

  const populateCategoryFilter = () => {
    const categories = getUniqueCategories();
    categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
  };

  const showRandomQuote = () => {
    const filteredQuotes = quotes.filter(quote => categoryFilter.value === 'all' || quote.category === categoryFilter.value);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
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
      populateCategoryFilter();
      alert('Quote added successfully!');
    } else {
      alert('Please enter both quote and category.');
    }
  };

  const filterQuotes = () => {
    const selectedCategory = categoryFilter.value.trim();
    const filteredQuotes = quotes.filter(quote => selectedCategory === 'all' || quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
      quoteDisplay.textContent = `"${filteredQuotes[0].text}" - ${filteredQuotes[0].category}`;
    } else {
      quoteDisplay.textContent = 'No quotes available for this category.';
    }
  };

  const importFromJsonFile = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategoryFilter();
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

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  importFileInput.addEventListener('change', importFromJsonFile);
  exportButton.addEventListener('click', exportToJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);

  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
    quoteDisplay.textContent = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
  } else {
    showRandomQuote();
  }

  populateCategoryFilter();
  filterQuotes();
});
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const result = await axios.post('http://127.0.0.1:8000/bfhl/', parsedInput);
      setResponse(result.data);
    } catch (err) {
      setError(err instanceof SyntaxError ? 'Invalid JSON format' : 'An error occurred');
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    selectedOptions.forEach(option => {
      if (response[option.value]) {
        filteredResponse[option.value] = response[option.value];
      }
    });

    return (
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Filtered Response:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(filteredResponse, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BFHL React Frontend</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="4"
          placeholder='Enter JSON (e.g., {"data": ["A","1","B","2"]})'
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {response && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Filter Response:</h2>
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={setSelectedOptions}
            className="mb-2"
          />
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default App;

import APIChainBuilder from './components/APIChainBuilder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">API Chaining Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              How to use the API Chaining Dashboard
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <ol className="list-decimal list-inside">
                <li>Select an API from the "Available APIs" section to add it to your chain.</li>
                <li>For each step (except the first), you can select fields from previous steps to use as inputs.</li>
                <li>Add a transformation if you need to modify the data between steps.</li>
                <li>For POST requests, you can specify the request body.</li>
                <li>Click "Execute Chain" to run your API chain and see the results.</li>
              </ol>
            </div>
          </div>
        </div>
        <APIChainBuilder />
      </main>
    </div>
  );
}

export default App;

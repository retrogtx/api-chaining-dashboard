interface APIDetails {
  name: string;
  url: string;
  method: 'GET' | 'POST';
}

const apis: APIDetails[] = [
  { name: 'Get Users List', url: 'https://jsonplaceholder.typicode.com/users', method: 'GET' },
  { name: 'Create New Post', url: 'https://jsonplaceholder.typicode.com/posts', method: 'POST' },
  { name: 'Get Comments by Post', url: 'https://jsonplaceholder.typicode.com/comments', method: 'GET' },
];

interface APISelectorProps {
  onSelect: (api: APIDetails) => void;
}

function APISelector({ onSelect }: APISelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Available APIs</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apis.map((api) => (
          <div
            key={api.name}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${api.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {api.method}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <button
                className="focus:outline-none w-full text-left"
                onClick={() => onSelect(api)}
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{api.name}</p>
                <p className="text-sm text-gray-500 truncate">{api.url}</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default APISelector;
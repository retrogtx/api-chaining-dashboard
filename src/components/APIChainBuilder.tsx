import { useState } from 'react';
import APISelector from './APISelector';
import APIChainVisualizer from './APIChainVisualizer';

interface APIDetails {
  name: string;
  url: string;
  method: 'GET' | 'POST';
}

interface SelectedField {
  sourceStep: number;
  sourceField: string;
  targetField: string;
}

interface APIStep {
  id: string;
  api: APIDetails;
  selectedFields: SelectedField[];
  transformation: string;
  requestBody?: Record<string, unknown>;
  response?: unknown;
}

function APIChainBuilder() {
  const [apiChain, setApiChain] = useState<APIStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStep = (api: APIDetails) => {
    const newStep: APIStep = {
      id: Date.now().toString(),
      api,
      selectedFields: [],
      transformation: '',
      requestBody: api.method === 'POST' ? {} : undefined,
    };
    setApiChain([...apiChain, newStep]);
  };

  const updateStep = (id: string, updates: Partial<APIStep>) => {
    setApiChain(apiChain.map(step => step.id === id ? { ...step, ...updates } : step));
  };

  const removeStep = (id: string) => {
    setApiChain(apiChain.filter(step => step.id !== id));
  };

  const executeChain = async () => {
    setLoading(true);
    setError(null);
    const updatedChain = [...apiChain];

    try {
      for (let i = 0; i < updatedChain.length; i++) {
        const step = updatedChain[i];
        const url = new URL(step.api.url);
        const body: Record<string, unknown> = { ...step.requestBody };

        console.log(`Executing step ${i + 1}: ${step.api.name}`);
        console.log('Initial URL:', url.toString());
        console.log('Initial Body:', JSON.stringify(body));

        // Apply selected fields from previous responses
        step.selectedFields.forEach((field) => {
          const sourceStep = updatedChain[field.sourceStep];
          console.log(`Applying field: ${field.targetField} from Step ${field.sourceStep + 1}`);
          if (sourceStep.response && typeof sourceStep.response === 'object') {
            const sourceData = sourceStep.response as Record<string, unknown>;
            const sourceValue = sourceData[field.sourceField];
            console.log(`Source value: ${JSON.stringify(sourceValue)}`);
            if (step.api.method === 'GET') {
              url.searchParams.append(field.targetField, String(sourceValue));
            } else if (step.api.method === 'POST') {
              body[field.targetField] = sourceValue;
            }
          } else {
            console.log('Source step response is not an object:', sourceStep.response);
          }
        });

        console.log(`Final URL: ${url.toString()}`);
        console.log(`Final Body: ${JSON.stringify(body)}`);

        // Execute API call
        const response = await fetch(url.toString(), {
          method: step.api.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: step.api.method === 'POST' ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data)}`);

        // Apply transformation if specified
        let transformedData = data;
        if (step.transformation && step.transformation.trim() !== '') {
          try {
            console.log('Applying transformation:', step.transformation);
            const transform = new Function('data', `
              try {
                return (${step.transformation});
              } catch (error) {
                console.error('Transformation runtime error:', error);
                throw new Error('Transformation runtime error: ' + error.message);
              }
            `);
            transformedData = transform(data);
            console.log(`Transformed data: ${JSON.stringify(transformedData)}`);
          } catch (error) {
            console.error('Transformation error:', error);
            throw new Error(`Transformation failed: ${error instanceof Error ? error.message : String(error)}`);
          }
        }

        // Update step with response
        updatedChain[i] = { ...step, response: transformedData };
      }
      setApiChain(updatedChain);
    } catch (err) {
      console.error('Chain execution error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPossibleFields = (stepIndex: number) => {
    const possibleFields: { [key: string]: string[] } = {
      'Get Users List': ['id', 'name', 'email', 'username'],
      'Create New Post': ['id', 'title', 'body', 'userId'],
      'Get Comments by Post': ['id', 'postId', 'name', 'email', 'body'],
    };

    return apiChain
      .slice(0, stepIndex)
      .flatMap((step, index) => 
        possibleFields[step.api.name]?.map(field => ({
          label: `Step ${index + 1}: ${field}`,
          value: `${index}.${field}`
        })) || []
      );
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Build API Chain</h2>
        <APISelector onSelect={addStep} />
        {apiChain.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">API Chain</h3>
            {apiChain.map((step, index) => (
              <div key={step.id} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-md">
                <h4 className="text-xl font-medium text-gray-800">Step {index + 1}: {step.api.name}</h4>
                <p className="text-sm text-gray-600">Method: {step.api.method}</p>
                <p className="text-sm text-gray-600">URL: {step.api.url}</p>
                {index > 0 && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Select Fields from Previous Steps</label>
                    {step.selectedFields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="flex items-center mt-1">
                        <input
                          type="text"
                          value={field.targetField}
                          onChange={(e) => {
                            const newSelectedFields = [...step.selectedFields];
                            newSelectedFields[fieldIndex] = { ...field, targetField: e.target.value };
                            updateStep(step.id, { selectedFields: newSelectedFields });
                          }}
                          className="w-1/3 border border-gray-300 rounded-md shadow-sm p-2 mr-2"
                          placeholder="Field name"
                        />
                        <select
                          value={`${field.sourceStep}.${field.sourceField}`}
                          onChange={(e) => {
                            const [sourceStep, sourceField] = e.target.value.split('.');
                            const newSelectedFields = [...step.selectedFields];
                            newSelectedFields[fieldIndex] = { 
                              ...field, 
                              sourceStep: parseInt(sourceStep), 
                              sourceField 
                            };
                            updateStep(step.id, { selectedFields: newSelectedFields });
                          }}
                          className="w-2/3 border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="">Select a field</option>
                          {getPossibleFields(index).map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const newSelectedFields = step.selectedFields.filter((_, i) => i !== fieldIndex);
                            updateStep(step.id, { selectedFields: newSelectedFields });
                          }}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateStep(step.id, { 
                        selectedFields: [...step.selectedFields, { sourceStep: 0, sourceField: '', targetField: '' }]
                      })}
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Add Field
                    </button>
                  </div>
                )}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Transformation (JavaScript code)</label>
                  <input
                    type="text"
                    value={step.transformation}
                    onChange={(e) => updateStep(step.id, { transformation: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="e.g., data.map(item => item.name)"
                  />
                </div>
                {step.api.method === 'POST' && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Request Body (JSON)</label>
                    <textarea
                      value={JSON.stringify(step.requestBody, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateStep(step.id, { requestBody: parsed });
                        } catch (error) {
                          console.error('Invalid JSON input:', error);
                        }
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      rows={4}
                    />
                  </div>
                )}
                <button
                  onClick={() => removeStep(step.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove Step
                </button>
              </div>
            ))}
            <button
              onClick={executeChain}
              disabled={loading}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300 disabled:bg-green-300"
            >
              {loading ? 'Executing...' : 'Execute Chain'}
            </button>
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </div>
        )}
        {apiChain.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">API Chain Visualization</h3>
            <APIChainVisualizer chain={apiChain} />
          </div>
        )}
      </div>
    </div>
  );
}

export default APIChainBuilder;
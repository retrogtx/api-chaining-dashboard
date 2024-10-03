import React from 'react';

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

interface APIChainVisualizerProps {
  chain: APIStep[];
}

function APIChainVisualizer({ chain }: APIChainVisualizerProps) {
  const renderValue = (value: unknown): React.ReactNode => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    } else if (value === null) {
      return 'null';
    } else if (Array.isArray(value)) {
      return (
        <details>
          <summary>Array({value.length})</summary>
          <pre className="ml-4">{JSON.stringify(value, null, 2)}</pre>
        </details>
      );
    } else if (typeof value === 'object') {
      return (
        <details>
          <summary>Object</summary>
          <pre className="ml-4">{JSON.stringify(value, null, 2)}</pre>
        </details>
      );
    }
    return 'undefined';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-nowrap space-x-4 pb-4">
        {chain.map((step, index) => (
          <div key={step.id} className="flex-shrink-0 w-96 bg-white shadow-lg rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 text-lg mb-2">Step {index + 1}: {step.api.name}</h4>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">{step.api.method}</span>
              <span className="truncate ml-2">{step.api.url}</span>
            </div>
            {step.selectedFields.length > 0 && (
              <div className="mb-2 text-sm">
                <p className="font-medium text-gray-700">Selected Fields:</p>
                <ul className="list-disc list-inside text-gray-500">
                  {step.selectedFields.map((field) => (
                    <li key={field.targetField}>
                      {field.targetField}: Step {field.sourceStep + 1}.{field.sourceField}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step.transformation && (
              <div className="mb-2 text-sm">
                <p className="font-medium text-gray-700">Transformation:</p>
                <pre className="text-gray-500 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {step.transformation}
                </pre>
              </div>
            )}
            {step.requestBody && Object.keys(step.requestBody).length > 0 && (
              <div className="mb-2 text-sm">
                <p className="font-medium text-gray-700">Request Body:</p>
                <pre className="text-gray-500 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(step.requestBody, null, 2)}
                </pre>
              </div>
            )}
            {step.response !== undefined && (
              <div className="text-sm">
                <p className="font-medium text-gray-700">Response:</p>
                <div className="text-gray-500 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60 overflow-y-auto">
                  {renderValue(step.response)}
                </div>
              </div>
            )}
            <div className="mt-2 text-sm">
              <p className="font-medium text-gray-700">Final URL:</p>
              <p className="text-gray-500 break-all">{new URL(step.api.url).toString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default APIChainVisualizer;
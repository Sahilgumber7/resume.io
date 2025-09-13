export default function Result({ data }) {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Parsed Resume Data</h2>
      <pre className="whitespace-pre-wrap text-sm text-gray-700">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

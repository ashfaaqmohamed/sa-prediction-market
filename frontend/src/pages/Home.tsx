export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-center">
      <h1 className="text-6xl font-bold mb-4">Welcome to SA Predict</h1>
      <p className="text-2xl text-gray-400 mb-12">Prediction markets for South Africa • Politics • Economy • Sports • Load-shedding</p>
      <a href="/markets" className="bg-emerald-500 hover:bg-emerald-600 px-10 py-4 rounded-2xl text-2xl font-semibold inline-block">
        Start Predicting →
      </a>
    </div>
  );
}

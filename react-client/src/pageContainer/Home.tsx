const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <nav className="mt-8 space-x-4">
        <a
          href="/students"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Students
        </a>
        <a
          href="/hotel"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Hotel
        </a>
      </nav>
    </div>
  );
};

export default Home;

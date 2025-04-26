import TopCard from "../../components/home/TopCard";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50/60 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">Monitor your business metrics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <TopCard title={"Total Jobs"} num={"400+"} />
          <TopCard title={"Categories"} num={"200+"} />
          <TopCard title={"Total Clicks"} num={"50+"} />
          <TopCard title={"Applications"} num={"100+"} />
        </div>
      </div>
    </div>
  );
}

export default Home;

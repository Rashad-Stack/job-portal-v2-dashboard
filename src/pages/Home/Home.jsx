import TopCard from '../../components/home/TopCard';

function Home() {
  return (
    <>
      <div>
        <h1 className="sm:text-2xl sm:mt-0 mt-2 text-xl font-semibold text-gray-600">Dashboard</h1>
        <div className="grid sm:grid-cols-4 grid-cols-1 gap-[16px] mt-[16px]">
          <TopCard title={'Total Job Posts'} num={'400+'} />
          <TopCard title={'Total Users'} num={'200+'} />
          <TopCard title={'Total Companies'} num={'50+'} />
          <TopCard title={'Total Applications'} num={'100+'} />
        </div>
      </div>
    </>
  );
}

export default Home;

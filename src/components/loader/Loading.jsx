export default function Loading() {
  return (
    <main className="mt-[77px] my-14 container mx-auto">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    </main>
  );
}
// export default function Loading() {
//   return <main className='mt-[77px] my-14 container mx-auto'>
//     <div className='flex items-center justify-center h-[calc(100vh-400px)]'>
//       <p className='text-7xl font-thin'>L</p>
//       <div className='size-10 border-8 border-dashed border-[#40854a] rounded-full mt-4 animate-spin'></div>
//       <p className='text-7xl font-thin'>ading<span>...</span> </p>
//     </div>
//   </main>;
// }

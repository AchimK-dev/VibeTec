const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-600 flex items-center justify-center">
      <div className='flex flex-col items-center'>
      <h1 className='text-[10rem] font-extrabold lg:text-[16rem] text-transparent bg-linear-to-r from-[#6054e8] to-[#f8485e] bg-clip-text'>
        404
      </h1>
      <p className='text-2xl font-bold text-gray-700'>
        Page not found{' '}
        <span role='img' aria-labelledby='crying face'>
          😢
        </span>
      </p>
      </div>
    </div>
  );
};

export default NotFound;

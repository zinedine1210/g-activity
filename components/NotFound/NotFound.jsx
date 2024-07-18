import { useRouter } from 'next/router';
import React from 'react';

const NotFound = () => {
  const router = useRouter();

  const handleBackToHomepage = () => {
    router.push('/usr');
  };


  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
        <div className="max-w-md text-center md:text-left">
          <div className="text-5xl font-dark font-bold">404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal">
            Sorry we couldn't find this page.
          </p>
          <p className="mb-8">
            But don't worry, you can find plenty of other things on our homepage.
          </p>
          <button
            onClick={handleBackToHomepage}
            className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
          >
            back to homepage
          </button>
        </div>
        <div className="max-w-lg flex justify-center">
          <img src="/images/notfound.svg" alt="not found" />
        </div>
      </div>
    </div>

  );
};

export default NotFound;

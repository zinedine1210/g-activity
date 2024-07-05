export default function Sidebar(props) {
    console.log(props.data);

    if(props.data){
        return (
          <div className="fixed top-0 left-0 z-40 w-1/6 h-screen overflow-y-auto transition-transform bg-zinc-100 dark:bg-dark">
              <div className="sticky top-0 left-0 w-full p-5 bg-zinc-100 shadow-md flex items-center gap-2">
                  <span className="flex items-center justify-center font-semibold text-base bg-red-500 w-8 text-white h-8">Z</span>
                  <h1 className="text-base font-bold text-black capitalize dark:text-zinc-400">Zinedine Web</h1>
              </div>
              <div className="p-4 overflow-y-auto">
                  <ul className="space-y-2">
                      {
                          props.data.pages ? props.data.pages.map((page, key) => {
                              return (
                                  <li key={key}>
                                      <a href="#" className="flex items-center p-2 text-base font-normal text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700">
                                      <svg aria-hidden="true" className="w-6 h-6 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                      <span className="ml-3">{page.page}</span>
                                      </a>
                                  </li>
                              )
                          })
                          :""
                      }
                      <li>
                          <a href="#" className="flex items-center p-2 text-base font-normal text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700">
                          <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path></svg>
                          <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="flex items-center p-2 text-base font-normal text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700">
                          <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                          <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
        )
    }else{
        return "nothing"
    }
}

import GamePage from './components/game'

function App() {

  return (
    <>
      <header>
        <nav className='p-4 text-white flex justify-between items-center'>
          <button className='p-4 rounded-full bg-gray-800'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16m-7 6h7'
              />
            </svg>
          </button>
          <h1>Anubhav Pathak</h1>
        </nav>

      </header>
      <GamePage />
    </>
  )
  
}

export default App

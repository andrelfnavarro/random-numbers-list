import Head from 'next/head';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const generateRandomNumbersList = () => {
  const numbers = new Set();
  while (numbers.size < 10) {
    numbers.add(Math.floor(Math.random() * 100) + 1);
  }
  return Array.from(numbers) as number[];
};

export default function Home() {
  const [requestStatus, setRequestStatus] = useState<'idle' | 'pending'>(
    'idle'
  );
  const [deleteNumbersDialogOpen, setDeleteNumbersDialogOpen] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  const selectedNumbers = useRef(new Set<number>());

  const handleToggleNumber = (number: number) => {
    if (selectedNumbers.current.has(number)) {
      selectedNumbers.current.delete(number);
    } else {
      selectedNumbers.current.add(number);
    }
  };

  const handleDeleteSelectedNumbers = () => {
    console.log(numbers.filter(number => !selectedNumbers.current.has(number)));
    setNumbers(prevNumbers =>
      prevNumbers.filter(number => !selectedNumbers.current.has(number))
    );

    selectedNumbers.current.clear();
  };

  const sendPostRequest = async () => {
    const sum = numbers.reduce((acc, number) => acc + number, 0);

    try {
      setRequestStatus('pending');
      await fetch(
        'https://superchat-challenge-numbers.free.beeceptor.com/sum',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sum }),
        }
      );

      toast.success('Sum sent successfully!!');
    } catch (error) {
      toast.error('Error sending sum...');
    } finally {
      setRequestStatus('idle');
    }
  };

  const refreshNumbers = () => {
    selectedNumbers.current.clear();
    setNumbers(generateRandomNumbersList());

    setRequestStatus('idle');
  };

  useEffect(() => {
    setNumbers(generateRandomNumbersList);
  }, []);

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col justify-betweeny- items-center p-4">
      <Head>
        <title>Random nums</title>
        <meta name="description" content="Frontend challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
          Random Numbers List
        </h1>

        <p className="text-white mt-4 leading-8 hidden md:block">
          Click on a number&apos;s checkbox to select / deselect it.
          <br />
          You can delete all selected numbers or refresh the list.
        </p>

        <div className="w-full h-[1px] bg-gray-200 opacity-20 md:my-4 my-2" />

        <ul>
          {numbers.map(number => (
            <li className="text-white" key={number}>
              <NumberItem number={number} onToggle={handleToggleNumber} />
            </li>
          ))}
        </ul>

        <div className="flex flex-row items-center my-4">
          <button
            type="button"
            aria-label="Delete selected numbers"
            className="mr-2 inline-flex items-center px-2.5 py-1 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ease-in-out duration-250"
            onClick={() => setDeleteNumbersDialogOpen(true)}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-1 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            Delete
          </button>

          <button
            type="button"
            aria-label="Refresh selected numbers"
            className="inline-flex items-center px-2.5 py-1 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ease-in-out duration-250"
            onClick={refreshNumbers}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-1 w-6 h-6 hover:rotate-180 transition-transform duration-300 ease-in-out"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
            </svg>
            Refresh
          </button>
        </div>

        <div className="w-full flex flex-col align-middle">
          <p className=" text-white text-xl text-center">
            Current sum:{' '}
            <strong className="text-2xl">
              {numbers.reduce((acc, curr) => acc + curr, 0)}
            </strong>
          </p>

          <button
            type="button"
            disabled={requestStatus === 'pending'}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mx-auto mt-4"
            onClick={sendPostRequest}
          >
            {requestStatus === 'pending' ? 'Sending...' : 'Send to Superchat'}
          </button>
        </div>

        <footer className="bg-gray-700 text-center lg:text-left mt-10">
          <div className="text-white text-center p-4">
            Built with ❤️ by{' '}
            <a
              className="text-blue-500 underline"
              href="https://www.github.com/andrelfnavarro"
            >
              André Navarro
            </a>
          </div>
        </footer>
      </main>

      <DeleteNumbersDialog
        open={deleteNumbersDialogOpen}
        setOpen={setDeleteNumbersDialogOpen}
        onDelete={handleDeleteSelectedNumbers}
      />
    </div>
  );
}

const NumberItem: React.FC<{
  number: number;
  onToggle: (number: number) => void;
}> = ({ number, onToggle }) => {
  return (
    <div className="flex items-center py-2">
      <input
        className="h-5 w-5"
        onClick={() => onToggle(number)}
        type="checkbox"
      />
      <span className="ml-3">{number}</span>
    </div>
  );
};

const DeleteNumbersDialog: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
}> = ({ open, setOpen, onDelete }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete numbers
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete all the selected
                          numbers? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      onDelete();
                      setOpen(false);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

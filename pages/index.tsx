import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { DeleteDialog } from './Dialog';

const generateRandomNumbersList = () => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
};

export default function Home() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const selectedNumbers = useRef(new Set<number>());

  const handleToggleNumber = (number: number) => {
    if (selectedNumbers.current.has(number)) {
      selectedNumbers.current.delete(number);
    } else {
      selectedNumbers.current.add(number);
    }

    console.log(selectedNumbers.current);
  };

  const handleDeleteSelectedNumbers = () => {
    console.log(numbers.filter(number => !selectedNumbers.current.has(number)));
    setNumbers(prevNumbers =>
      prevNumbers.filter(number => !selectedNumbers.current.has(number))
    );

    selectedNumbers.current.clear();
  };

  useEffect(() => {
    setNumbers(generateRandomNumbersList);
  }, []);

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col justify-between items-center p-4">
      <Head>
        <title>Random nums</title>
        <meta name="description" content="Frontend challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl text-white font-bold">Random numbers list</h1>

        <p className="text-white mt-4">
          Click on a number&apos;s checkbox to select / deselect it.
          <br />
          Click on the button below to delete the selected numbers.
        </p>

        <button
          aria-label="Refresh selected numbers"
          className="my-4  rounded underline text-white"
          onClick={() => setNumbers(generateRandomNumbersList)}
        >
          Refresh
        </button>

        <ul>
          {numbers.map(number => (
            <li className="text-white" key={number}>
              <NumberItem number={number} onToggle={handleToggleNumber} />
            </li>
          ))}
        </ul>

        <p className="mt-4 text-white">
          Current sum: {numbers.reduce((acc, curr) => acc + curr, 0)}
        </p>

        <button
          aria-label="Delete selected numbers"
          className="my-4  rounded underline text-white"
          onClick={() => setOpen(true)}
        >
          Delete selected numbers
        </button>
      </main>

      <DeleteDialog
        open={open}
        setOpen={setOpen}
        onDelete={handleDeleteSelectedNumbers}
      />
    </div>
  );
}

interface NumberItemProps {
  number: number;
  onToggle: (number: number) => void;
}

const NumberItem: React.FC<NumberItemProps> = ({ number, onToggle }) => {
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

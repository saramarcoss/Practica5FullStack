import React, { useState } from 'react';
import { useQuery, useMutation, FetchResult } from '@apollo/client';
import { FC } from 'react';
import { GET_AVAILABLE_SLOTS, BOOK_SLOT } from './../gql.tsx';
import { Slot} from './../types.tsx';
import Link from 'next/link'

//Se utiliza el modo CSR para esta pagina ya que se necesita que los datos se actualicen constantemente, proporcionando una mejor experiencia de usuario altamente interactiva y dinámica para que se introduzcan los datos de los pacientes.
//Puede ser algo más lento para los motores de busqueda, pero en este caso no es un problema ya que no se necesita que los motores de busqueda indexen esta pagina.
const Patient: FC = () => {
  const now = new Date();
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [dni, setDni] = useState('');


  const { loading, error, data, refetch } = useQuery<{ availableSlots: Slot[] }>(
    GET_AVAILABLE_SLOTS,
    {
      variables: {
        day: day || null,
        month: month || null,
        year: year || null,
      },
      skip: !(day && month && year)
    }
  );
  

  const [bookSlot] = useMutation<{ bookSlot: Slot }>(BOOK_SLOT);

  const handleBook = async (day: number, month: number, year: number, hour: number, dni: string): Promise<void> => {
    if (!dni) {
      alert('Please enter your DNI');
      return;
    }
    try {
      const result:FetchResult<{ bookSlot: Slot }> = await bookSlot({
        variables: {
          day,
          month,
          year,
          hour,
          dni,
        },
      });
      console.log(result);
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Patient</h2>
      <h3>Enter a date to see available slots:</h3>
      <div>
        <label htmlFor="dayInput">day: </label>
        <input
          type="number"
          placeholder="Day"
          value={day}
          onChange={(e) => setDay(parseInt(e.target.value))}
          inputMode="numeric"
        />
        <br></br>
        <label htmlFor="monthInput">month:</label>
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        />
        <br></br>
        <label htmlFor="yearInput">year:</label>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
        <br></br>
        <button onClick={() => refetch()}>Search</button>
      </div>
      {data && data.availableSlots.length > 0 ? (
        <div>
          <h3>Available slots:</h3>
          {data.availableSlots.map((slot: Slot) => (
            <div key={slot.id}>
              {slot.day}/{slot.month}/{slot.year} at {slot.hour}:00h
            </div>
          ))}
  
          <h3>Introduce your DNI and select a slot to book:</h3>
          <div>
            <input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
          <div>
            <br></br>
            {data.availableSlots.map((slot: Slot) => (
              <div key={slot.id}>
                <button onClick={() => handleBook(slot.day, slot.month, slot.year, slot.hour, dni)}>

                  {slot.day}/{slot.month}/{slot.year} at {slot.hour}:00h
                </button>
              </div>
            ))}
          </div>
          <br></br>
          <Link href="http://localhost:3000/">Volver a la pagina principal</Link>
        </div>
      ) : (
        <p>No slots available for this date</p>
      )}
    </div>
  );
  
};

export default Patient;

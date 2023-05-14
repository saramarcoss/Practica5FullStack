import React, { useState } from 'react';
import { useQuery, useMutation, FetchResult } from '@apollo/client';
import { FC } from 'react';
import { GET_AVAILABLE_SLOTS, ADD_SLOT, REMOVE_SLOT } from './../gql.tsx';
import { Slot } from './../types.tsx';
import Link from 'next/link';


//Se utiliza el modo CSR para esta pagina ya que se necesita que los datos se actualicen constantemente, proporcionando una mejor experiencia de usuario altamente interactiva y dinámica para que se introduzcan los datos de los pacientes.
//Puede ser algo más lento para los motores de busqueda, pero en este caso no es un problema ya que no se necesita que los motores de busqueda indexen esta pagina.
const Doctor: FC = () => {
    const now = new Date();
    const [day, setDay] = useState(now.getDate());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [hour, setHour] = useState(now.getHours());
    const [mode, setMode] = useState<'add' | 'remove'>('add'); // Modo por defecto es "add"
    const [actionResult, setActionResult] = useState('');


    const { loading, error, refetch } = useQuery<{ availableSlots: Slot[] }>(
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
    const [addSlot] = useMutation<{ addSlot: Slot }>(ADD_SLOT);
    const [removeSlot] = useMutation<{ removeSlot: Slot }>(REMOVE_SLOT);

    const handleAdd:()=>Promise<void> = async () => {
        console.log(day, month, year, hour);
        if (day === 0 || month === 0 || year === 0 || hour === 0) {
            alert("Se deben introducir los cuatro campos");
            return;
        }
        try {
            const result:FetchResult<{ addSlot: Slot; }> = await addSlot({
                variables: {
                    day,
                    month,
                    year,
                    hour
                }
            });
            console.log(result);
            refetch();
            setActionResult(`The slot ${day}/${month}/${year} at ${hour} has been added`);
        } catch (e) {
            setActionResult('An error has occurred while adding the slot');
        }
    };

    const handleremove:()=>Promise<void> = async () => {
        console.log(day, month, year, hour);
        if (day === 0 || month === 0 || year === 0 || hour === 0) {
            alert("Se deben introducir los cuatro campos");
            return;
        }
        try {
            const result: FetchResult<{ removeSlot: Slot; }> = await removeSlot({
                variables: {
                    day,
                    month,
                    year,
                    hour
                }
            });    
            console.log(result);
            refetch();
            setActionResult(`The slot ${day}/${month}/${year} at ${hour} has been deleted`);
        } catch (e) {
            setActionResult('An error has occurred while deleting the slot');
        }

    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <div>
          <h2>Doctor</h2>
          <div>
            <button onClick={() => setMode('add')}>Add slot</button>
            <button onClick={() => setMode('remove')}>Remove slot</button>
          </div>
          {mode === 'add' ? (
            <div>
              <h3>Add slot:</h3>
              <div>
            <label htmlFor="dayInput">day:</label>
                <input
                  type="number"
                  placeholder="Day"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value))}
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
                <label htmlFor="hourInput">hour:</label>
                <input
                  type="number"
                  placeholder="Hour"
                  value={hour}
                  onChange={(e) => setHour(parseInt(e.target.value))}
                />
                <br></br>
                <button onClick={handleAdd}>Add</button>
              </div>
            </div>
          ) : mode === 'remove' ? (
            <div>
              <h3>Remove slot:</h3>
              <div>
                <label htmlFor="dayInput">day:</label>
                <input
                  type="number"
                  placeholder="Day"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value))}
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
                <label htmlFor="hourInput">hour:</label>
                <input
                  type="number"
                  placeholder="Hour"
                  value={hour}
                  onChange={(e) => setHour(parseInt(e.target.value))}
                />
                <br></br>
                <button onClick={handleremove}>Remove</button>
              </div>
            </div>
            
          ) : null}
            {actionResult && <p>{actionResult}</p>}
            <br></br>
            <Link href="http://localhost:3000/">Volver a la pagina principal</Link>
        </div>
      );
      
};

export default Doctor;
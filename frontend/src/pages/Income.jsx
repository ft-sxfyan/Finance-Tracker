import { useEffect, useMemo, useState } from 'react';

import IncomeForm from '../components/IncomeForm';
import IncomeTable from '../components/IncomeTable';

import {
  fetchIncome,
  createIncome,
  deleteIncomeById,
} from '../services/api.js';

function Income() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    const loadIncome = async () => {
      try {
        setError('');

        const data = await fetchIncome({
          date: selectedDate,
        });

        setIncome(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIncome();
  }, [selectedDate]);

  const addIncome = async (newIncome) => {
    try {
      setError('');

      const savedIncome = await createIncome({
        ...newIncome,
        date: selectedDate,
      });

      setIncome((previousIncome) => [
        savedIncome,
        ...previousIncome,
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteIncome = async (id) => {
    try {
      setError('');

      await deleteIncomeById(id);

      setIncome((previousIncome) =>
        previousIncome.filter(
          (entry) => (entry._id || entry.id) !== id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const totalReceived = useMemo(() => {
    return income.reduce(
      (total, entry) => total + Number(entry.amount || 0),
      0
    );
  }, [income]);

  return (
    <main className="page-content">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">INCOME CONTROL</span>

          <h1>Money Received</h1>

          <p>
            Track money received from family or other sources.
          </p>
        </div>

        <div className="date-control panel">
          <label htmlFor="income-date">
            ACTIVE DATE
          </label>

          <input
            id="income-date"
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
          />
        </div>
      </header>

      {error && (
        <section className="error-panel">
          <strong>SYSTEM ERROR</strong>
          <p>{error}</p>
        </section>
      )}

      <section className="income-overview panel">
        <div>
          <span className="eyebrow">
            TOTAL RECEIVED
          </span>

          <h2>
            Rs. {totalReceived.toLocaleString()}
          </h2>

          <p>
            Money received on {selectedDate}.
          </p>
        </div>
      </section>

      <section className="panel dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              INCOME INPUT
            </span>

            <h2>Record Money Received</h2>
          </div>

          <span className="system-badge">
            {selectedDate}
          </span>
        </div>

        <IncomeForm
          onAddIncome={addIncome}
          defaultDate={selectedDate}
        />
      </section>

      <section className="panel dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              RECEIVING HISTORY
            </span>

            <h2>Received Today</h2>
          </div>
        </div>

        {loading ? (
          <p className="panel-description">
            Loading income data...
          </p>
        ) : (
          <IncomeTable
            income={income}
            onDeleteIncome={deleteIncome}
          />
        )}
      </section>
    </main>
  );
}

export default Income;
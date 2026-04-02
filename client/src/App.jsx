import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000";
const ITEM_NAMES = ['Coke', 'Water', 'Sprite'];

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [insertedCoins, setInsertedCoins] = useState(0);
  const [lastChangeReturned, setLastChangeReturned] = useState(0);
  const [message, setMessage] = useState("Welcome to Vend-O-Matic");
  const [loading, setLoading] = useState(false);

  async function loadInventory() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`);
      const data = await response.json();
      console.log("loading inventory", data);
      setInventory(data);
    } catch (error) {
        console.log(error);
      setMessage("Failed to load inventory.");
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function insertQuarter() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ coin: 1 })
      });

      const coins = Number(response.headers.get("X-Coins") || 0);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not insert quarter.");
      }

      setInsertedCoins(coins);
      setLastChangeReturned(0);
      setMessage("Quarter inserted.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function returnCoins() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "DELETE"
      });

      const returnedCoins = Number(response.headers.get("X-Coins") || 0);

      if (!response.ok) {
        throw new Error("Could not return coins.");
      }

      setInsertedCoins(0);
      setLastChangeReturned(returnedCoins);
      setMessage(`Returned ${returnedCoins} quarter(s).`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function buyItem(id) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const coinsHeader = Number(response.headers.get("X-Coins") || 0);
      const remainingHeader = response.headers.get("X-Inventory-Remaining");

      if (!response.ok) {
        let errorMessage = "Purchase failed.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // no-op
        }

        if (response.status === 403) {
          setInsertedCoins(coinsHeader);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      setInsertedCoins(0);
      setLastChangeReturned(coinsHeader);

      setInventory((current) =>
        current.map((count, index) =>
          index === id ? Number(remainingHeader ?? count) : count
        )
      );

      setMessage(
        `Dispensed ${data.quantity} beverage. Change returned: ${coinsHeader} quarter(s).`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // I would make this UI SO FUN if I had more time. This is just place holder sadness.
  return (
    <div className="app-shell">
      <div className="card">
        <h1>Vend-O-Matic</h1>
        <p className="subtitle">Super ugly UI for vending machine</p>

        <div className="status-grid">
          <div className="status-box">
            <span className="label">Inserted Coins </span>
            <strong>{insertedCoins}</strong>
          </div>
          <div className="status-box">
            <span className="label">Last Change Returned </span>
            <strong>{lastChangeReturned}</strong>
          </div>
        </div>

        <div className="actions">
          <button onClick={insertQuarter} disabled={loading}>
            Insert Quarter
          </button>
          <button
            onClick={returnCoins}
            disabled={loading || insertedCoins === 0}
            className="secondary"
          >
            Return Coins
          </button>
        </div>

        <div className="message-box">
            {
                message.length > 0 ? (
                <div>
                    <h3>Message</h3>
                    <p>{message}</p>
                </div>
                ): <div> </div> 
            }
          
        </div>

        <h2>Inventory</h2>

        <div className="inventory-list">
          {inventory.map((count, index) => (
            <div className="inventory-item" key={index}>
              <div>
                <h3>Beverage: {ITEM_NAMES[index]}</h3>
                <p>Remaining: {count}</p>
                <p>Price: 2 quarters</p>
              </div>

              <button
                onClick={() => buyItem(index)}
                disabled={loading || count === 0}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
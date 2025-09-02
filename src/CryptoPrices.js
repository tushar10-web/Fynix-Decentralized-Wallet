import React, { useEffect, useState } from 'react';
import axios from 'axios';

const coinsToShow = ['bitcoin', 'ethereum', 'ripple'];

const CryptoPrices = ({ onDataLoaded }) => {
  const [coinsData, setCoinsData] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              ids: coinsToShow.join(','),
              order: 'market_cap_desc',
              per_page: coinsToShow.length,
              page: 1,
              sparkline: false,
            },
          }
        );
        const dataObj = {};
        response.data.forEach((coin) => {
          dataObj[coin.id] = coin;
        });
        setCoinsData(dataObj);

        if (onDataLoaded) {
          onDataLoaded();
        }
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [onDataLoaded]);

  return (
    <div style={{ display: 'flex', gap: '30px', marginTop: '20px', justifyContent: 'center' }}>
      {coinsToShow.map((coin) => {
        const coinData = coinsData[coin];
        return (
          <div
            key={coin}
            style={{
              border: '1px solid #ddd',
              padding: '15px 25px',
              borderRadius: '12px',
              textAlign: 'center',
              width: 180,
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9',
              cursor: 'default',
            }}
          >
            {coinData ? (
              <>
                <img src={coinData.image} alt={coin} style={{ width: 48, height: 48, marginBottom: 10 }} />
                <h3 style={{ margin: '6px 0', textTransform: 'capitalize' }}>{coinData.name}</h3>
                <p style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>
                  ${coinData.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p style={{ color: coinData.price_change_percentage_24h >= 0 ? 'green' : 'red', marginTop: 6 }}>
                  {coinData.price_change_percentage_24h.toFixed(2)}%
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CryptoPrices;

import React, { useState, useEffect } from 'react';
import { Wallet, getDefaultProvider, formatEther, parseUnits, Contract, isAddress } from 'ethers';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const ETHERSCAN_API_KEY = 'VKAPFTE4TUCVJ662DS9YEQPEK5DJ8BKV8N';

const Login = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);

  const [tokenContractAddress, setTokenContractAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenToAddress, setTokenToAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenTxStatus, setTokenTxStatus] = useState('');
  const [loadingTokenBalance, setLoadingTokenBalance] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    if (loggedIn && wallet) {
      refreshBalances();
      fetchTransactions();
    }
  }, [loggedIn, wallet]);

  const fetchTokenBalance = async () => {
    if (!wallet) {
      setError('Wallet not initialized.');
      return;
    }

    const trimmedContract = tokenContractAddress.trim();
    if (!isAddress(trimmedContract)) {
      setError('Invalid token contract address.');
      setTokenBalance(null);
      return;
    }

    try {
      setLoadingTokenBalance(true);
      const tokenContract = new Contract(trimmedContract, ERC20_ABI, wallet.provider);
      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(wallet.address),
        tokenContract.decimals(),
        tokenContract.symbol(),
      ]);
      const formattedBalance = Number(balance) / Math.pow(10, decimals);
      setTokenDecimals(decimals);
      setTokenSymbol(symbol);
      setTokenBalance(formattedBalance.toFixed(4));
      setError('');
    } catch {
      setError('Failed to fetch token balance.');
      setTokenBalance(null);
      setTokenSymbol('');
    }
    setLoadingTokenBalance(false);
  };

  const handleTokenTransfer = async (e) => {
    e.preventDefault();
    setTokenTxStatus('');

    if (!wallet) {
      setTokenTxStatus('Wallet not initialized.');
      return;
    }

    const trimmedContract = tokenContractAddress.trim();
    const trimmedTo = tokenToAddress.trim();

    if (!isAddress(trimmedContract)) {
      setTokenTxStatus('Invalid token contract address.');
      return;
    }
    if (!isAddress(trimmedTo)) {
      setTokenTxStatus('Invalid recipient address.');
      return;
    }
    if (!tokenAmount || Number(tokenAmount) <= 0) {
      setTokenTxStatus('Enter valid token amount.');
      return;
    }

    try {
      const tokenContract = new Contract(trimmedContract, ERC20_ABI, wallet);
      const amountBN = parseUnits(tokenAmount, tokenDecimals);
      setTokenTxStatus('Sending token transaction...');
      const tx = await tokenContract.transfer(trimmedTo, amountBN);
      setTokenTxStatus(`Transaction sent. Hash: ${tx.hash}`);
      await tx.wait();
      setTokenTxStatus(`Transaction confirmed! Hash: ${tx.hash}`);
      await fetchTokenBalance();
    } catch (err) {
      setTokenTxStatus(`Transaction failed: ${err.message}`);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const trimmedMnemonic = mnemonic.trim();

    if (trimmedMnemonic.split(' ').length < 12) {
      setError('Please enter a valid 12 or 24-word mnemonic phrase.');
      return;
    }

    try {
      const provider = getDefaultProvider();
      const userWallet = Wallet.fromPhrase(trimmedMnemonic).connect(provider);
      setWallet(userWallet);
      setError('');
      setLoggedIn(true);
    } catch {
      setError('Invalid mnemonic phrase.');
    }
  };

  const handleLogout = () => {
    setWallet(null);
    setLoggedIn(false);
    setMnemonic('');
    setError('');
    setEthBalance(null);
    setTokenBalance(null);
    setTokenSymbol('');
    setTokenContractAddress('');
    setTokenToAddress('');
    setTokenAmount('');
    setTokenTxStatus('');
    setTransactions([]);
  };

  const refreshBalances = async () => {
    if (!wallet) return;

    try {
      const ethBalBN = await wallet.provider.getBalance(wallet.address);
      setEthBalance(parseFloat(formatEther(ethBalBN)).toFixed(4));

      if (tokenContractAddress && isAddress(tokenContractAddress.trim())) {
        await fetchTokenBalance();
      }
    } catch (err) {
      console.error('Error refreshing balances', err);
    }
  };

  const fetchTransactions = async () => {
    if (!wallet) return;
    setTxLoading(true);
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet.address}` +
        `&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "1") {
        setTransactions(data.result);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    }
    setTxLoading(false);
  };

  if (loggedIn) {
    return (
      <div style={{ maxWidth: 700, margin: '20px auto', padding: 20 }}>
        <h2>Wallet Dashboard</h2>
        <p><strong>Wallet Address:</strong> {wallet.address}</p>

        <section style={{ marginTop: 20 }}>
          <h3>Your Balances</h3>
          <p><strong>ETH Balance:</strong> {ethBalance !== null ? `${ethBalance} ETH` : 'Loading...'}</p>
          {tokenBalance !== null && <p>Token Balance: {tokenBalance} {tokenSymbol}</p>}
          <button
            onClick={refreshBalances}
            style={{ padding: '8px 16px', marginTop: 10, backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}
          >
            Refresh Balances
          </button>
        </section>

        <section style={{ marginTop: 30 }}>
          <h3>ERC-20 Token Balance Checker</h3>
          <input
            type="text"
            placeholder="Token Contract Address"
            value={tokenContractAddress}
            onChange={(e) => setTokenContractAddress(e.target.value)}
            style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
          />
          <button onClick={fetchTokenBalance} style={{ padding: '8px 16px', marginBottom: 8, backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 6 }}>
            Check Balance
          </button>
          {loadingTokenBalance && <p>Loading token balance...</p>}
          {tokenBalance !== null && <p>Balance: {tokenBalance} {tokenSymbol}</p>}
        </section>

        <section style={{ marginTop: 30 }}>
          <h3>Send ERC-20 Token</h3>
          <form onSubmit={handleTokenTransfer}>
            <label>
              Token Contract Address:
              <input
                type="text"
                value={tokenContractAddress}
                onChange={(e) => setTokenContractAddress(e.target.value)}
                style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
                required
              />
            </label>
            <label>
              Recipient Address:
              <input
                type="text"
                value={tokenToAddress}
                onChange={(e) => setTokenToAddress(e.target.value)}
                style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
                required
              />
            </label>
            <label>
              Amount:
              <input
                type="number"
                step="any"
                min="0"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
                required
              />
            </label>
            <button
              type="submit"
              style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 6 }}
            >
              Send Token
            </button>
          </form>
          {tokenTxStatus && <p style={{ marginTop: 10 }}>{tokenTxStatus}</p>}
        </section>

        <section style={{ marginTop: 40 }}>
          <h3>Recent Transactions (Latest 10)</h3>
          {txLoading && <p>Loading transactions...</p>}
          {!txLoading && transactions.length === 0 && <p>No recent transactions found.</p>}
          <ul style={{ maxHeight: 300, overflowY: 'auto' }}>
            {transactions.map(tx => (
              <li key={tx.hash} style={{ marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 6 }}>
                <p><strong>Hash:</strong> <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">{tx.hash.slice(0, 20)}...</a></p>
                <p><strong>Block:</strong> {tx.blockNumber}</p>
                <p><strong>From:</strong> {tx.from}</p>
                <p><strong>To:</strong> {tx.to}</p>
                <p><strong>Value:</strong> {parseFloat(tx.value / 1e18).toFixed(6)} ETH</p>
                <p><strong>Time:</strong> {new Date(tx.timeStamp * 1000).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>

        <button
          onClick={handleLogout}
          style={{ marginTop: 20, padding: '10px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: 6 }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', padding: 20 }}>
      <h2>Login to Your Wallet</h2>
      <form onSubmit={handleLoginSubmit}>
        <label>
          Enter Your Mnemonic Phrase:
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, marginTop: 8, boxSizing: 'border-box' }}
            placeholder="Enter your 12 or 24-word mnemonic phrase here"
            required
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <br />
        <button
          type="submit"
          style={{ marginTop: 10, padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

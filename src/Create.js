import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { Wallet } from 'ethers';

const Create = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletCreated, setWalletCreated] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const generateWallet = () => {
    const newMnemonic = bip39.generateMnemonic();
    const wallet = Wallet.fromPhrase(newMnemonic);

    setMnemonic(newMnemonic);
    setWalletAddress(wallet.address);
    setWalletCreated(true);
    setShowMnemonic(false);
    setCopySuccess('');
  };

  const handleImport = (e) => {
    e.preventDefault();
    const inputMnemonic = e.target.mnemonic.value.trim();

    if (!bip39.validateMnemonic(inputMnemonic)) {
      alert('Invalid mnemonic phrase.');
      return;
    }

    const wallet = Wallet.fromPhrase(inputMnemonic);
    setMnemonic(inputMnemonic);
    setWalletAddress(wallet.address);
    setWalletCreated(true);
    setShowMnemonic(false);
    setCopySuccess('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic).then(() => {
      setCopySuccess('Mnemonic copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 3000);
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>Create or Import Wallet</h2>
      {!walletCreated ? (
        <>
          <button
            onClick={generateWallet}
            style={{ marginBottom: 20, padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Generate New Wallet
          </button>
          <form onSubmit={handleImport}>
            <label>
              Import Wallet (Enter Mnemonic Phrase):
              <textarea
                name="mnemonic"
                rows={4}
                style={{ width: '100%', padding: 8, marginTop: 8, boxSizing: 'border-box' }}
                placeholder="Enter your mnemonic phrase here"
              />
            </label>
            <br />
            <button
              type="submit"
              style={{ marginTop: 10, padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Import Wallet
            </button>
          </form>
        </>
      ) : (
        <div>
          <h3>Your Wallet Details</h3>
          <button
            onClick={() => setShowMnemonic(!showMnemonic)}
            style={{ marginBottom: 10, padding: '6px 12px', cursor: 'pointer', borderRadius: 6, border: '1px solid #3b82f6', backgroundColor: '#e0e7ff' }}
          >
            {showMnemonic ? 'Hide' : 'Show'} Mnemonic
          </button>
          {showMnemonic && (
            <p
              style={{
                backgroundColor: '#e0e7ff',
                padding: 20,
                borderRadius: 10,
                fontFamily: "'Courier New', Courier, monospace",
                userSelect: 'text',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {mnemonic}
            </p>
          )}
          <button
            onClick={copyToClipboard}
            style={{ marginTop: 10, padding: '8px 14px', borderRadius: 6, cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}
          >
            Copy Mnemonic
          </button>
          {copySuccess && <p style={{ color: 'green', marginTop: 8 }}>{copySuccess}</p>}
          <p style={{ marginTop: 10 }}>
            <strong>Wallet Address:</strong> {walletAddress}
          </p>
          <p style={{ marginTop: 10, color: '#555' }}>
            Please save your mnemonic phrase securely. It is the only way to recover your wallet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Create;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SkinCard from './components/SkinCard';
import NavBar from './components/NavBar';
import SkinDetails from './components/SkinDetails';
import BuyModal from './components/BuyModal';
import MetaMaskModal from './components/MetaMaskModal';
import skins from './skins.json';
import './App.css';

function App() {
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [showSkinDetails, setShowSkinDetails] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function connectToMetaMask() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const contractAddress = skins.networks[network.chainId].address;
        const contractABI = skins.abi;
        const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setProvider(provider);
        setContract(contract);
        setAccount(account);
      } else {
        setShowMetaMaskModal(true);
      }
    }
    connectToMetaMask();
  }, []);

  const handleSkinSelect = (skin) => {
    setSelectedSkin(skin);
    setShowSkinDetails(true);
  };

  const handleBuyClick = () => {
    if (account) {
      setShowBuyModal(true);
    } else {
      setShowMetaMaskModal(true);
    }
  };

  const handleBuyConfirm = async () => {
    const price = ethers.utils.parseEther(selectedSkin.price.toString());
    const tx = await contract.buySkin(selectedSkin.id, { value: price });
    await tx.wait();
    setShowBuyModal(false);
    setSelectedSkin(null);
    setShowSkinDetails(false);
  };

  return (
    <div className="App">
      <NavBar />
      {showSkinDetails && <SkinDetails skin={selectedSkin} onBuyClick={handleBuyClick} />}
      {showBuyModal && (
        <BuyModal
          skin={selectedSkin}
          onCancel={() => setShowBuyModal(false)}
          onConfirm={handleBuyConfirm}
          account={account}
        />
      )}
      {showMetaMaskModal && <MetaMaskModal onClose={() => setShowMetaMaskModal(false)} />}
      <div className="SkinList">
        {skins.map((skin) => (
          <SkinCard key={skin.id} skin={skin} onSelect={handleSkinSelect} />
        ))}
      </div>
    </div>
  );
}

export default App;
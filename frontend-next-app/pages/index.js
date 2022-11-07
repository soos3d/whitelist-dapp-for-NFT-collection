import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";

import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // maxWhitelistedAddresses tracks how many total addresses can be whitelisted
  const [maxWhitelistedAddresses, setMaxWhitelistedAddresses] = useState([]);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState([]);
  // whitelistSpotsLeft tracks how many spots available are left
  const [whitelistSpotsLeft, setWhitelistSpotsLeft] = useState([]);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getNumberOfWhitelisted:  gets the number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

   /**
   * getNumberOfSpotsLeft:  gets the number of spots remaining
   */
    const getNumberOfSpotsLeft = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // No need for the Signer here, as we are only reading state from the blockchain
        const provider = await getProviderOrSigner();
        // We connect to the Contract using a Provider, so we will only
        // have read-only access to the Contract
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          provider
        );
        // call the numAddressesWhitelisted from the contract
        const _whitelistSpotsLeft =
          await whitelistContract.whitelistSpotsLeft();
        setWhitelistSpotsLeft(_whitelistSpotsLeft);
      } catch (err) {
        console.error(err);
      }
    };

    /**
   * getMaxWhitelistedAddresses:  gets the number of spots remaining
   */
     const getMaxWhitelistedAddresses = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // No need for the Signer here, as we are only reading state from the blockchain
        const provider = await getProviderOrSigner();
        // We connect to the Contract using a Provider, so we will only
        // have read-only access to the Contract
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          provider
        );
        // call the numAddressesWhitelisted from the contract
        const _maxWhitelistedAddresses =
          await whitelistContract.maxWhitelistedAddresses();
          setMaxWhitelistedAddresses(_maxWhitelistedAddresses);
      } catch (err) {
        console.error(err);
      }
    };

  /**
   * checkIfAddressInWhitelist: Checks if the address is in whitelist
   */
  const checkIfAddressInWhitelist = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
      getNumberOfSpotsLeft();
      getMaxWhitelistedAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div className="bg-slate-600">

    <Head>
        <title>Amazing whitelist DApp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.png" />
    </Head>
    <div className='container mx-auto px-10 mb-8'>

        <div className='bg-white shadow-lg rounded-lg p-8 mb-8 bg-opacity-50'>
            <h3 className='text-3xl mb-8 text-center font-semibold  border-b border-amber-500 pb-4'>
                Welcome to your new whitelist DApp!
            </h3>

            <p className='text-lg text-amber-50'>
                This DApp allows whitelisting a certain number of addresses that will have free access to the NFT min. The purpose it to teach you how you can develop a DApp like this.
            </p>
            <p className='text-lg text-amber-50 border-b border-amber-50'>
                The development is divided in two stages:
            </p>
            <li className="indent-4 mt-4 text-amber-50">The smart contract.</li>
            <li className="indent-4 mb-4 text-amber-50">The front end.</li>
            <p className='text-lg text-amber-50 mt-4'>
                The smart contract is written in Solidity and deployed using Hardhat on the Goerli testnet. The frontend is made using Netx.js and Tailwind CSS.
            </p>

            <div className="grid place-items-center">
                <h2 className="mt-5 text-lg text-amber-50"> Find the complete repo on GitHub! </h2>
                <a href="https://github.com/soos3d/whitelist-dapp-for-NFT-collection" target="blank">
                    <span className='mt-5 transition duration-500 transform hover:-translate-y-2 inline-block bg-slate-900  font-medium rounded-full text-white px-8 py-3 cursor-pointer'>
                        GitHub repository
                    </span>
                </a>
            </div>
        </div>

    </div>
    <div className='container mx-auto px-10 mb-8'>
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8 mt-10 bg-opacity-50">
            <div>
                <div className="text-lg mb-10 grid place-items-center">
                    <h1 className="text-2xl mb-8 text-center font-semibold"> Whitelist tracker DApp for your NFT collection </h1>
                    <h2 className="text-xl mb-5 text-center font-semibold">SUMMARY</h2>

                    <p className="text-xg font-semibold text-amber-50 border-b border-amber-500 mb-2 mt-2">Max {maxWhitelistedAddresses} addresses can be whitelisted.</p>
                    <p className="text-lg text-amber-50 border-b border-amber-500 mb-2 mt-2">{numberOfWhitelisted} have already joined the whitelist.</p>
                    <p className="text-lg text-amber-50 border-b border-amber-500 mb-2 mt-2">{whitelistSpotsLeft} spots are left on the whitelist.</p>

                    <span className="mt-5 transition duration-500 transform hover:-translate-y-2 inline-block bg-amber-500 text-slate-900 font-medium rounded-full text-white px-8 py-3 cursor-pointer">{renderButton()}</span>
                </div>

            </div>

        </div>
    </div>
    <footer className={styles.footer}>
        <p className="mr-5">Made with &#10084; by me, find me on:</p>

        <div className="mb-5">

            <a href="https://twitter.com/web3Dav3" target="blank">
                <span className='transition duration-500 transform hover:-translate-y-2 inline-block bg-blue-500  font-medium rounded-full text-white px-8 py-3 cursor-pointer'>
                    Twitter
                </span>
            </a>
            <a href="https://github.com/soos3d" target="blank">
                <span className='transition duration-500 transform hover:-translate-y-2 inline-block bg-black  font-medium rounded-full text-white px-8 py-3 cursor-pointer ml-4'>
                    GitHub
                </span>
            </a>
            <a href="https://soosweb3.hashnode.dev/" target="blank">
                <span className='transition duration-500 transform hover:-translate-y-2 inline-block bg-blue-600  font-medium rounded-full text-white px-8 py-3 cursor-pointer ml-4'>
                    HashNode
                </span>
            </a>
        </div>
    </footer>
  </div>
  );
}
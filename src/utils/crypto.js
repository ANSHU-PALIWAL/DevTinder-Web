import { get, set } from "idb-keyval";
import axios from "axios";
import { API_BASE_URL } from "./constants";

const ALGO = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

// Export keys to string for network/storage
const exportPublicKey = async (key) => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exported));
  return btoa(exportedAsString);
};

const importPublicKey = async (pem) => {
  const binaryDerString = atob(pem);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
};

export const initializeCrypto = async (userId) => {
  try {
    const storedPrivateKey = await get(`privateKey_${userId}`);
    const storedPublicKey = await get(`publicKey_${userId}`);

    if (storedPrivateKey && storedPublicKey) {
      console.log("Keys loaded from IndexedDB");
      return; // Already initialized
    }

    console.log("Generating new RSA Key Pair for E2EE...");
    const keyPair = await window.crypto.subtle.generateKey(ALGO, true, ["encrypt", "decrypt"]);
    
    // Store private key object directly in IndexedDB (idb-keyval handles structured cloning)
    await set(`privateKey_${userId}`, keyPair.privateKey);
    
    const publicKeyStr = await exportPublicKey(keyPair.publicKey);
    await set(`publicKey_${userId}`, publicKeyStr);

    // Upload public key to backend
    await axios.post(
      `${API_BASE_URL}/chat/key`,
      { publicKey: publicKeyStr },
      { withCredentials: true }
    );
    console.log("Public key uploaded successfully.");

  } catch (err) {
    console.error("Failed to initialize crypto:", err);
  }
};

export const encryptMessage = async (text, receiverPublicKeyStr) => {
  try {
    const publicKey = await importPublicKey(receiverPublicKeyStr);
    const encoded = new TextEncoder().encode(text);
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      encoded
    );
    
    // Convert ArrayBuffer to Base64
    const ciphertextArr = new Uint8Array(ciphertext);
    const ciphertextStr = String.fromCharCode.apply(null, ciphertextArr);
    return btoa(ciphertextStr);
  } catch (err) {
    console.error("Encryption error:", err);
    throw err;
  }
};

export const decryptMessage = async (encryptedBase64, userId) => {
  try {
    const privateKey = await get(`privateKey_${userId}`);
    if (!privateKey) {
      return "[Message encrypted on another device]";
    }

    const binaryStr = atob(encryptedBase64);
    const ciphertextArr = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      ciphertextArr[i] = binaryStr.charCodeAt(i);
    }

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      ciphertextArr
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("Decryption error:", err);
    return "[Decryption Failed]";
  }
};

export const getMyPublicKey = async (userId) => {
  return await get(`publicKey_${userId}`);
};

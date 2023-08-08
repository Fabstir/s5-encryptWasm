import { Buffer } from "buffer";
import { blake3 } from "@noble/hashes/blake3";
import { encrypt_file_xchacha20 } from "../../encrypt_file/pkg/encrypt_file";
// Might want to add this for export from s5-utils-js
export const cidTypeEncrypted = 0xae;
export const mhashBlake3Default = 0x1f;
export const encryptionAlgorithmXChaCha20Poly1305 = 0xa6;
export const chunkSizeAsPowerOf2 = 18;
/**
 * Calculates the BLAKE3 hash of a file.
 * @param file - The file to calculate the hash from.
 * @returns A promise that resolves to a Buffer containing the BLAKE3 hash.
 */
export async function calculateB3hashFromFile(file) {
    // Create a hash object
    const hasher = await blake3.create({});
    // Define the chunk size (1 MB)
    const chunkSize = 1024 * 1024;
    // Initialize the position to 0
    let position = 0;
    // Process the file in chunks
    while (position <= file.size) {
        // Slice the file to extract a chunk
        const chunk = file.slice(position, position + chunkSize);
        const chunkArrayBuffer = await chunk.arrayBuffer();
        // Update the hash with the chunk's data
        hasher.update(Buffer.from(chunkArrayBuffer));
        // Move to the next position
        position += chunkSize;
    }
    // Obtain the final hash value
    const b3hash = hasher.digest();
    // Return the hash value as a Promise resolved to a Buffer
    return Buffer.from(b3hash);
}
/**
 * Calculates the BLAKE3 hash of a file after encrypting it with a given key.
 * @param {File} file - The file to hash.
 * @param {Uint8Array} encryptedKey - The key to use for encryption.
 * @returns {Promise<{ b3hash: Buffer; encryptedFileSize: number }>} A Promise that resolves to an object containing the hash value and the size of the encrypted file.
 */
export async function calculateB3hashFromFileEncrypt(file, encryptedKey) {
    // Create a hash object
    const hasher = await blake3.create({});
    // Define the chunk size (1 MB)
    const chunkSize = 262144; // 1024 * 1024;
    // Initialize the position to 0
    let position = 0;
    let encryptedFileSize = 0;
    let chunkIndex = 0;
    // Process the file in chunks
    while (position <= file.size) {
        // Slice the file to extract a chunk
        const chunk = file.slice(position, position + chunkSize);
        // Convert chunk's ArrayBuffer to hex string and log it
        const chunkArrayBuffer = await chunk.arrayBuffer();
        const chunkUint8Array = new Uint8Array(chunkArrayBuffer);
        const encryptedChunkUint8Array = encrypt_file_xchacha20(chunkUint8Array, encryptedKey, 0x0, chunkIndex);
        encryptedFileSize += encryptedChunkUint8Array.length;
        // Update the hash with the chunk's data
        hasher.update(encryptedChunkUint8Array);
        // Move to the next position
        position += chunkSize;
        chunkIndex++;
    }
    // Obtain the final hash value
    const b3hash = hasher.digest();
    // Return the hash value as a Promise resolved to a Buffer
    return { b3hash: Buffer.from(b3hash), encryptedFileSize };
}
const CID_TYPE_ENCRYPTED_LENGTH = 1;
const ENCRYPTION_ALGORITHM_LENGTH = 1;
const CHUNK_LENGTH_AS_POWEROF2_LENGTH = 1;
const ENCRYPTED_BLOB_HASH_LENGTH = 33;
const KEY_LENGTH = 32;
/**
 * Extracts the encryption key from an encrypted CID.
 * @param {string} encryptedCid - The encrypted CID to get the key from.
 * @returns {string} The encryption key from the CID.
 */
export function getKeyFromEncryptedCid(encryptedCid) {
    const extensionIndex = encryptedCid.lastIndexOf(".");
    let cidWithoutExtension;
    if (extensionIndex !== -1) {
        cidWithoutExtension = encryptedCid.slice(0, extensionIndex);
    }
    else {
        cidWithoutExtension = encryptedCid;
    }
    console.log("getKeyFromEncryptedCid: encryptedCid = ", encryptedCid);
    console.log("getKeyFromEncryptedCid: cidWithoutExtension = ", cidWithoutExtension);
    cidWithoutExtension = cidWithoutExtension.slice(1);
    const cidBytes = convertBase64urlToBytes(cidWithoutExtension);
    const startIndex = CID_TYPE_ENCRYPTED_LENGTH +
        ENCRYPTION_ALGORITHM_LENGTH +
        CHUNK_LENGTH_AS_POWEROF2_LENGTH +
        ENCRYPTED_BLOB_HASH_LENGTH;
    const endIndex = startIndex + KEY_LENGTH;
    const selectedBytes = cidBytes.slice(startIndex, endIndex);
    const key = convertBytesToBase64url(selectedBytes);
    return key;
}
/**
 * Removes the encryption key from an encrypted CID.
 * @param {string} encryptedCid - The encrypted CID to remove the key from.
 * @returns {string} The CID with the encryption key removed.
 */
export function removeKeyFromEncryptedCid(encryptedCid) {
    const extensionIndex = encryptedCid.lastIndexOf(".");
    const cidWithoutExtension = extensionIndex === -1 ? encryptedCid : encryptedCid.slice(0, extensionIndex);
    // remove 'u' prefix as well
    const cidWithoutExtensionBytes = convertBase64urlToBytes(cidWithoutExtension.slice(1));
    const part1 = cidWithoutExtensionBytes.slice(0, CID_TYPE_ENCRYPTED_LENGTH +
        ENCRYPTION_ALGORITHM_LENGTH +
        CHUNK_LENGTH_AS_POWEROF2_LENGTH +
        ENCRYPTED_BLOB_HASH_LENGTH);
    const part2 = cidWithoutExtensionBytes.slice(part1.length + KEY_LENGTH);
    const combinedBytes = new Uint8Array(cidWithoutExtensionBytes.length - KEY_LENGTH);
    combinedBytes.set(part1);
    combinedBytes.set(part2, part1.length);
    const cidWithoutKey = "u" + convertBytesToBase64url(combinedBytes);
    return cidWithoutKey;
}
/**
 * Combines an encryption key with an encrypted CID.
 * @param {string} key - The encryption key to combine with the encrypted CID.
 * @param {string} encryptedCidWithoutKey - The encrypted CID without the encryption key.
 * @returns {string} The encrypted CID with the encryption key combined.
 */
export function combineKeytoEncryptedCid(key, encryptedCidWithoutKey) {
    const extensionIndex = encryptedCidWithoutKey.lastIndexOf(".");
    const cidWithoutKeyAndExtension = extensionIndex === -1 ? encryptedCidWithoutKey : encryptedCidWithoutKey.slice(0, extensionIndex);
    const encryptedCidWithoutKeyBytes = convertBase64urlToBytes(cidWithoutKeyAndExtension.slice(1));
    const keyBytes = convertBase64urlToBytes(key);
    const combinedBytes = new Uint8Array(encryptedCidWithoutKeyBytes.length + keyBytes.length);
    const part1 = encryptedCidWithoutKeyBytes.slice(0, CID_TYPE_ENCRYPTED_LENGTH +
        ENCRYPTION_ALGORITHM_LENGTH +
        CHUNK_LENGTH_AS_POWEROF2_LENGTH +
        ENCRYPTED_BLOB_HASH_LENGTH);
    const part2 = encryptedCidWithoutKeyBytes.slice(part1.length);
    combinedBytes.set(part1);
    combinedBytes.set(keyBytes, part1.length);
    combinedBytes.set(part2, part1.length + keyBytes.length);
    const encryptedCid = `u` + convertBytesToBase64url(combinedBytes);
    return encryptedCid;
}
export function convertBytesToBase64url(hashBytes) {
    const mHash = Buffer.from(hashBytes);
    // Convert the hash Buffer to a Base64 string
    const hashBase64 = mHash.toString("base64");
    // Make the Base64 string URL-safe
    const hashBase64url = hashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace("=", "");
    return hashBase64url;
}
export function convertBase64urlToBytes(b64url) {
    // Convert the URL-safe Base64 string to a regular Base64 string
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    // Add missing padding
    while (b64.length % 4) {
        b64 += "=";
    }
    // Convert Base64 string to Buffer
    const buffer = Buffer.from(b64, "base64");
    // Convert Buffer to Uint8Array
    const mHash = Uint8Array.from(buffer);
    return mHash;
}
/**
 * Creates an encrypted Content Identifier (CID) from the provided parameters.
 * @param cidTypeEncrypted - The encrypted type of the CID.
 * @param encryptionAlgorithm - The encryption algorithm used.
 * @param chunkSizeAsPowerOf2 - The chunk size as a power of 2.
 * @param encryptedBlobHash - The encrypted hash of the blob.
 * @param encryptionKey - The encryption key used.
 * @param padding - Additional padding to be used.
 * @param originalCid - The original CID before encryption.
 * @returns A Uint8Array representing the encrypted CID.
 */
export function createEncryptedCid(cidTypeEncrypted, encryptionAlgorithm, chunkSizeAsPowerOf2, encryptedBlobHash, encryptionKey, padding, originalCid) {
    const result = [];
    result.push(cidTypeEncrypted);
    result.push(encryptionAlgorithm);
    result.push(chunkSizeAsPowerOf2);
    result.push(...Array.from(encryptedBlobHash));
    result.push(...Array.from(encryptionKey));
    result.push(...Array.from(new Uint8Array(new Uint32Array([padding]).buffer))); // convert padding to big-endian
    result.push(...Array.from(originalCid));
    return new Uint8Array(result);
}
/**
 * Encrypts a file using a specified encryption key and CID. This function
 * first reads the input file and converts it into a Uint8Array format.
 * It then initializes a WebAssembly (WASM) module and calls an encryption
 * function to encrypt the file content. The encrypted file content is then
 * converted back into a Blob and then into a File object.
 * It also computes the encrypted blob hash, constructs the encrypted CID,
 * and returns the encrypted file along with the encrypted CID.
 * @param {File} file - The file to be encrypted.
 * @param {string} filename - The name of the file.
 * @param {Uint8Array} encryptedKey - The encryption key to be used.
 * @param {string} cid - The Content Identifier of the file.
 * @returns {Promise<{ encryptedFile: File; encryptedCid: string }>} A promise that resolves with an object containing the encrypted file and the encrypted CID.
 */
export async function encryptFile(file, filename, encryptedKey, cid) {
    // Convert the File object to a Uint8Array
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    await new Promise((resolve) => {
        reader.onload = (event) => {
            resolve(event);
        };
    });
    const fileContents = new Uint8Array(reader.result);
    // Call the function to encrypt the file
    const encryptedFileBytes = encrypt_file_xchacha20(fileContents, encryptedKey, 0x0);
    // Convert Uint8Array to Blob
    const blob = new Blob([encryptedFileBytes], { type: "application/octet-stream" });
    // Convert Blob to File
    const encryptedFile = new File([blob], filename, { type: "application/octet-stream", lastModified: Date.now() });
    const b3hash = await calculateB3hashFromFile(encryptedFile);
    const encryptedBlobHash = Buffer.concat([Buffer.alloc(1, mhashBlake3Default), b3hash]);
    const padding = 0;
    const encryptedCidBytes = createEncryptedCid(cidTypeEncrypted, encryptionAlgorithmXChaCha20Poly1305, chunkSizeAsPowerOf2, encryptedBlobHash, encryptedKey, padding, cid);
    const encryptedCid = "u" + Buffer.from(encryptedCidBytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace("=", "");
    return {
        encryptedFile,
        encryptedCid,
    };
}
/**
 * Returns a ReadableStreamDefaultReader for a ReadableStream of encrypted data from the provided File object.
 * The data is encrypted using the XChaCha20-Poly1305 algorithm with the provided encryption key.
 * The encryption is done on-the-fly using a transformer function.
 * The input data is split into chunks of size 262144 bytes (256 KB) and each chunk is encrypted separately.
 * @param file The File object to read from.
 * @param encryptedKey The encryption key to use, as a Uint8Array.
 * @returns A ReadableStreamDefaultReader for a ReadableStream of encrypted data from the provided File object.
 */
export function getEncryptedStreamReader(file, encryptedKey) {
    // Creates a ReadableStream from a File object, encrypts the stream using a transformer,
    // and returns a ReadableStreamDefaultReader for the encrypted stream.
    const fileStream = file.stream();
    const transformerEncrypt = getTransformerEncrypt(encryptedKey);
    const encryptedFileStream = fileStream.pipeThrough(transformerEncrypt);
    const reader = encryptedFileStream.getReader();
    return reader;
}
/**
 * Returns a transformer function that encrypts the input data using the provided key.
 * The encryption is done using the XChaCha20-Poly1305 algorithm.
 * The input data is split into chunks of size 262144 bytes (256 KB) and each chunk is encrypted separately.
 * @param key The encryption key to use, as a Uint8Array.
 * @returns A TransformStream object that takes in Uint8Array chunks and outputs encrypted Uint8Array chunks.
 */
function getTransformerEncrypt(key) {
    let buffer = new Uint8Array(0);
    let chunkIndex = 0;
    const chunkSize = 262144; // Chunk size in bytes
    return new TransformStream({
        async transform(chunk, controller) {
            const newBuffer = new Uint8Array(buffer.length + chunk.length);
            newBuffer.set(buffer);
            newBuffer.set(chunk, buffer.length);
            buffer = newBuffer;
            while (buffer.length >= chunkSize) {
                const chunk = buffer.slice(0, chunkSize);
                const encryptedChunkUint8Array = Promise.resolve(encrypt_file_xchacha20(chunk, key, 0x0, chunkIndex));
                controller.enqueue(await encryptedChunkUint8Array);
                buffer = buffer.slice(chunkSize);
                console.log("encrypt: chunkIndex = ", chunkIndex);
                chunkIndex++;
            }
        },
        async flush(controller) {
            // Process remaining data in the buffer, if any
            while (buffer.length > 0) {
                const chunk = buffer.slice(0, Math.min(chunkSize, buffer.length));
                const encryptedChunkUint8Array = Promise.resolve(encrypt_file_xchacha20(chunk, key, 0x0, chunkIndex));
                controller.enqueue(await encryptedChunkUint8Array);
                buffer = buffer.slice(Math.min(chunkSize, buffer.length));
                console.log("encrypt: chunkIndex = ", chunkIndex);
                chunkIndex++;
            }
        },
    });
}

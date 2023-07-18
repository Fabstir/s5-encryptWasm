/// <reference types="node" />
import { Buffer } from "buffer";
export declare const cidTypeEncrypted = 174;
export declare const mhashBlake3Default = 31;
export declare const encryptionAlgorithmXChaCha20Poly1305 = 166;
export declare const chunkSizeAsPowerOf2 = 18;
/**
 * Calculates the BLAKE3 hash of a file.
 * @param file - The file to calculate the hash from.
 * @returns A promise that resolves to a Buffer containing the BLAKE3 hash.
 */
export declare function calculateB3hashFromFile(file: File): Promise<Buffer>;
/**
 * Calculates the BLAKE3 hash of a file after encrypting it with a given key.
 * @param {File} file - The file to hash.
 * @param {Uint8Array} encryptedKey - The key to use for encryption.
 * @returns {Promise<{ b3hash: Buffer; encryptedFileSize: number }>} A Promise that resolves to an object containing the hash value and the size of the encrypted file.
 */
export declare function calculateB3hashFromFileEncrypt(file: File, encryptedKey: Uint8Array): Promise<{
    b3hash: Buffer;
    encryptedFileSize: number;
}>;
/**
 * Removes the encryption key from an encrypted CID.
 * @param {string} encryptedCid - The encrypted CID to remove the key from.
 * @returns {string} The CID with the encryption key removed.
 */
export declare function removeKeyFromEncryptedCid(encryptedCid: string): string;
/**
 * Combines an encryption key with an encrypted CID.
 * @param {string} key - The encryption key to combine with the encrypted CID.
 * @param {string} encryptedCidWithoutKey - The encrypted CID without the encryption key.
 * @returns {string} The encrypted CID with the encryption key combined.
 */
export declare function combineKeytoEncryptedCid(key: string, encryptedCidWithoutKey: string): string;
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
export declare function createEncryptedCid(cidTypeEncrypted: number, encryptionAlgorithm: number, chunkSizeAsPowerOf2: number, encryptedBlobHash: Uint8Array, encryptionKey: Uint8Array, padding: number, originalCid: Uint8Array): Uint8Array;
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
export declare function encryptFile(file: File, filename: string, encryptedKey: Uint8Array, cid: Buffer): Promise<{
    encryptedFile: File;
    encryptedCid: string;
}>;
/**
 * Returns a ReadableStreamDefaultReader for a ReadableStream of encrypted data from the provided File object.
 * The data is encrypted using the XChaCha20-Poly1305 algorithm with the provided encryption key.
 * The encryption is done on-the-fly using a transformer function.
 * The input data is split into chunks of size 262144 bytes (256 KB) and each chunk is encrypted separately.
 * @param file The File object to read from.
 * @param encryptedKey The encryption key to use, as a Uint8Array.
 * @returns A ReadableStreamDefaultReader for a ReadableStream of encrypted data from the provided File object.
 */
export declare function getEncryptedStreamReader(file: File, encryptedKey: Uint8Array): ReadableStreamDefaultReader<Uint8Array>;
//# sourceMappingURL=encryptWasm.d.ts.map
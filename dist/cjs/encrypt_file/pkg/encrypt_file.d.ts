/* tslint:disable */
/* eslint-disable */
/**
* This function encrypts the input file using the XChaCha20 algorithm.
*
* @param input_file - The bytes of the file to be encrypted.
* @param padding - The size of the padding to be added to each chunk of the file.
* @param chunk_index - The index of the chunk being encrypted.
* @returns A Result that, if Ok, contains the encrypted file as a vector of bytes.
* @param {Uint8Array} input_file
* @param {Uint8Array} key
* @param {number} padding
* @param {number | undefined} chunk_index
* @returns {Uint8Array}
*/
export function encrypt_file_xchacha20(input_file: Uint8Array, key: Uint8Array, padding: number, chunk_index?: number): Uint8Array;
/**
* This function generates a key for XChaCha20Poly1305 encryption.
*
* @returns The generated key as a vector of bytes.
* @returns {Uint8Array}
*/
export function generate_key(): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly encrypt_file_xchacha20: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly generate_key: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

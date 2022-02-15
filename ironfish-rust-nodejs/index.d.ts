/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export class ExternalObject<T> {
  readonly '': {
    readonly '': unique symbol
    [K: symbol]: T
  }
}
export interface Key {
  spending_key: string
  incoming_view_key: string
  outgoing_view_key: string
  public_address: string
}
export function generateKey(): Key
export function generateNewPublicAddress(privateKey: string): Key
export interface MineHeaderNapiResult {
  randomness: number
  foundMatch: boolean
}
export function mineHeaderBatch(headerBytes: Buffer, initialRandomness: number, targetBuffer: Buffer, batchSize: number): MineHeaderNapiResult
export type NativeNoteEncrypted = NoteEncrypted
export class NoteEncrypted {
  constructor(bytes: Buffer)
  serialize(): Buffer
  equals(other: NoteEncrypted): boolean
  merkleHash(): Buffer
  /**
   * Hash two child hashes together to calculate the hash of the
   * new parent
   */
  static combineHash(depth: number, left: Buffer, right: Buffer): Buffer
  /** Returns undefined if the note was unable to be decrypted with the given key. */
  decryptNoteForOwner(incomingHexKey: string): NativeNote | undefined | null
  /** Returns undefined if the note was unable to be decrypted with the given key. */
  decryptNoteForSpender(outgoingHexKey: string): NativeNote | undefined | null
}
export type NativeNoteBuilder = NoteBuilder
export class NoteBuilder {
  /**
   * TODO: This works around a concurrency bug when using #[napi(factory)]
   * in worker threads. It can be merged into NativeNote once the bug is fixed.
   */
  constructor(owner: string, value: bigint, memo: string)
  serialize(): Buffer
}
export type NativeNote = Note
export class Note {
  constructor(bytes: Buffer)
  serialize(): Buffer
  /** Value this note represents. */
  value(): bigint
  /**
   * Arbitrary note the spender can supply when constructing a spend so the
   * receiver has some record from whence it came.
   * Note: While this is encrypted with the output, it is not encoded into
   * the proof in any way.
   */
  memo(): string
  /**
   * Compute the nullifier for this note, given the private key of its owner.
   *
   * The nullifier is a series of bytes that is published by the note owner
   * only at the time the note is spent. This key is collected in a massive
   * 'nullifier set', preventing double-spend.
   */
  nullifier(ownerPrivateKey: string, position: bigint): Buffer
}
export class NativeSpendProof {
  treeSize(): number
  rootHash(): Buffer
  nullifier(): Buffer
}
export type NativeTransactionPosted = TransactionPosted
export class TransactionPosted {
  constructor(bytes: Buffer)
  serialize(): Buffer
  verify(): boolean
  notesLength(): number
  getNote(index: number): Buffer
  spendsLength(): number
  getSpend(index: number): NativeSpendProof
  fee(): bigint
  transactionSignature(): Buffer
  hash(): Buffer
  expirationSequence(): number
}
export type NativeTransaction = Transaction
export class Transaction {
  constructor()
  /** Create a proof of a new note owned by the recipient in this transaction. */
  receive(spenderHexKey: string, note: Note): string
  /** Spend the note owned by spender_hex_key at the given witness location. */
  spend(spenderHexKey: string, note: Note, witness: object): string
  /**
   * Special case for posting a miners fee transaction. Miner fee transactions
   * are unique in that they generate currency. They do not have any spends
   * or change and therefore have a negative transaction fee. In normal use,
   * a miner would not accept such a transaction unless it was explicitly set
   * as the miners fee.
   */
  post_miners_fee(): TransactionPosted
  /**
   * Post the transaction. This performs a bit of validation, and signs
   * the spends with a signature that proves the spends are part of this
   * transaction.
   *
   * Transaction fee is the amount the spender wants to send to the miner
   * for mining this transaction. This has to be non-negative; sane miners
   * wouldn't accept a transaction that takes money away from them.
   *
   * sum(spends) - sum(outputs) - intended_transaction_fee - change = 0
   * aka: self.transaction_fee - intended_transaction_fee - change = 0
   */
  post(spenderHexKey: string, changeGoesTo?: string | undefined | null, intendedTransactionFee: bigint): TransactionPosted
  setExpirationSequence(expirationSequence: number): void
}
export type NativeSimpleTransaction = SimpleTransaction
export class SimpleTransaction {
  constructor(spenderHexKey: string, intendedTransactionFee: bigint)
  spend(note: Note, witness: object): string
  receive(note: Note): string
  post(): TransactionPosted
}

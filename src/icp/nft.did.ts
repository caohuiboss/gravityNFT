import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

export const idlFactory = () => {
  const {
    Null,
    Principal,
    Nat,
    Nat16,
    Nat32,
    Nat8,
    Nat64,
    Text,
    Vec,
    Record,
    Variant,
    Bool,
    Opt,
    Tuple,
    Service,
    Func,
  } = IDL;

  const ApiError = Variant({
    Unauthorized: Null,
    InvalidTokenId: Null,
    ZeroAddress: Null,
    Other: Null,
  });

  // type 区域
  const ApproveResult = Variant({
    Err: ApiError,
    Ok: Principal,
  });

  const OwnerResult = Variant({
    Err: ApiError,
    Ok: Principal,
  });

  const TxReceipt = Variant({
    Err: ApiError,
    Ok: Nat,
  });

  const InterfaceId = Variant({
    Approval: Null,
    TransactionHistory: Null,
    Mint: Null,
    Burn: Null,
    TransferNotification: Null,
  });

  const LogoResult = Record({
    logo_type: Text,
    data: Text,
  });

  const MetadataPurpose = Variant({
    Preview: Null,
    Rendered: Null,
  });

  const MetadataKeyVal = Record({});

  const MetadataPart = Record({
    purpose: MetadataPurpose,
    key_val_data: Vec(MetadataKeyVal),
    data: Text,
  });

  const MetadataDesc = Vec(MetadataPart);

  const ExtendedMetadataResult = Record({
    metadata_desc: MetadataDesc,
    token_id: Nat64,
  });

  const MetadataResult = Variant({
    Err: ApiError,
    Ok: MetadataDesc,
  });

  const MetadataVal = Variant({
    TextContent: Text,
    BlobContent: Text,
    NatContent: Nat,
    Nat8Content: Nat8,
    Nat16Content: Nat16,
    Nat32Content: Nat32,
    Nat64Content: Nat64,
  });

  const TransactionType = Variant({
    Transfer: Record({
      token_id: Nat64,
      from: Principal,
      to: Principal,
    }),
    TransferFrom: Record({
      token_id: Nat64,
      from: Principal,
      to: Principal,
    }),
    Approve: Record({
      token_id: Nat64,
      from: Principal,
      to: Principal,
    }),
    SetApprovalForAll: Record({
      from: Principal,
      to: Principal,
    }),
    Mint: Record({
      token_id: Nat64,
      to: Principal,
    }),
    Burn: Record({
      token_id: Nat64,
    }),
  });

  const TransactionResult = Record({
    fee: Nat,
    transaction_type: TransactionType,
  });

  const MintReceiptPart = Record({
    token_id: Nat64,
    id: Nat,
  });

  const MintReceipt = Variant({
    Err: ApiError,
    Ok: MintReceiptPart,
  });

  const Balance = Nat;
  const Memo = Text;
  const SubAccount = Vec(Nat8);
  const TokenIdentifier = Text;
  const TokenIndex = Nat32;
  const AccountIdentifier = Text;

  const User = Variant({
    address: AccountIdentifier,
    principal: Principal,
  });

  const TransferRequest = Record({
    amount: Balance,
    from: User,
    memo: Memo,
    notify: Bool,
    subaccount: Opt(SubAccount),
    to: User,
    token: TokenIdentifier,
  });

  const TransferResponse = Variant({
    Err: Variant({
      CannotNotify: AccountIdentifier,
      InsufficientBalance: Null,
      InvalidToken: TokenIdentifier,
      Other: Text,
      Rejected: Null,
      Unauthorized: AccountIdentifier,
    }),
    Ok: Balance,
  });

  const Value = Variant({
    text: Text,
    blob: Text,
    nat: Nat,
    nat8: Nat8,
  });

  const MetadataValue = Tuple(Text, Value);

  const MetadataContainer = Variant({
    data: Vec(MetadataValue),
    blob: Text,
    json: Text,
  });

  const MintRequest = Record({
    metadata: Opt(MetadataContainer),
    to: User,
  });

  const CommonError = Variant({
    InvalidToken: TokenIdentifier,
    Other: Text,
  });

  const AccountIdentifierReturn = Variant({
    Err: CommonError,
    Ok: AccountIdentifier,
  });

  const BalanceReturn = Variant({
    Err: CommonError,
    Ok: Balance,
  });

  const Metadata = Variant({
    fungible: Record({
      name: Text,
      symbol: Text,
      decimals: Nat8,
      metadata: Opt(MetadataContainer),
    }),
    nonfungible: Opt(MetadataContainer),
  });

  const MetadataReturn = Variant({
    Err: CommonError,
    Ok: Metadata,
  });

  const TokenMetadata = Record({
    account_identifier: AccountIdentifier,
    metadata: Metadata,
    token_identifier: TokenIdentifier,
    principal: Principal,
  });

  const TransactionId = Nat;
  const Date = Nat64;

  const Transaction = Record({
    txid: TransactionId,
    request: TransferRequest,
    date: Date,
  });

  const TransactionRequestFilter = Variant({
    txid: TransactionId,
    user: User,
    date: Tuple(Date, Date),
    page: Tuple(Nat, Nat),
  });

  const TransactionRequest = Record({
    query: TransactionRequestFilter,
    token: TokenIdentifier,
  });

  const TrasactionsResult = Record({
    Err: CommonError,
    Ok: Vec(Transaction),
  });

  return Service({
    name: Func([], [Text], ['query']),

    approveDip721: Func(
      [
        Record({
          spender: Principal,
          token_id: Nat64,
        }),
      ],
      [ApproveResult],
      [],
    ),
    balanceOfDip721: Func(
      [
        Record({
          user: Principal,
        }),
      ],
      [Nat64],
      ['query'],
    ),
    ownerOfDip721: Func(
      [
        Record({
          token_id: Nat64,
        }),
      ],
      [OwnerResult],
      ['query'],
    ),
    safeTransferFromDip721: Func(
      [
        Record({
          from: Principal,
          to: Principal,
          token_id: Nat64,
        }),
      ],
      [TxReceipt],
      [],
    ),
    transferFromDip721: Func(
      [
        Record({
          from: Principal,
          to: Principal,
          token_id: Nat64,
        }),
      ],
      [TxReceipt],
      [],
    ),
    supportedInterfacesDip721: Func([], [Vec(InterfaceId)], ['query']),
    logoDip721: Func([], [LogoResult], ['query']),
    nameDip721: Func([], [Text], ['query']),
    symbolDip721: Func([], [Text], ['query']),
    totalSupplyDip721: Func([], [Nat64], ['query']),
    getMetadataDip721: Func(
      [
        Record({
          toke_id: Nat64,
        }),
      ],
      [MetadataResult],
      ['query'],
    ),
    getMaxLimitDip721: Func([], [Nat16], ['query']),
    mintDip721: Func(
      [
        Record({
          to: Principal,
          metadata: MetadataDesc,
        }),
      ],
      [MintReceipt],
      [],
    ),
    getMetadataForUserDip721: Func(
      [
        Record({
          user: Principal,
        }),
      ],
      [Vec(ExtendedMetadataResult)],
      [],
    ),
    getTokenIdsForUserDip721: Func(
      [
        Record({
          user: Principal,
        }),
      ],
      [Vec(Nat64)],
      ['query'],
    ),

    transfer: Func([TransferRequest], [TransferResponse], []),
    bearer: Func([TokenIdentifier], [AccountIdentifierReturn], ['query']),
    getAllMetadataForUser: Func([User], [Vec(TokenMetadata)], ['query']),
    supply: Func([TokenIdentifier], [BalanceReturn], ['query']),
    metadata: Func([TokenIdentifier], [MetadataReturn], ['query']),
    add: Func([TransferRequest], [TransactionId], []),
  });
};

export const erc721_token = () => {
  return [];
};

import type { AST_NODE_TYPES, AST_TOKEN_TYPES, TSESTree } from '../ts-estree';

type ObjectEntry<BaseType> = BaseType extends unknown
  ? [keyof BaseType, BaseType[keyof BaseType]]
  : never;
type ObjectEntries<BaseType> = ObjectEntry<BaseType>[];

export const isNodeOfType =
  <NodeType extends AST_NODE_TYPES>(nodeType: NodeType) =>
  (
    node: TSESTree.Node | null | undefined,
  ): node is Extract<TSESTree.Node, { type: NodeType }> =>
    node?.type === nodeType;

export const isNodeOfTypes =
  <NodeTypes extends readonly AST_NODE_TYPES[]>(nodeTypes: NodeTypes) =>
  (
    node: TSESTree.Node | null | undefined,
  ): node is Extract<TSESTree.Node, { type: NodeTypes[number] }> =>
    !!node && nodeTypes.includes(node.type);

export const isNodeOfTypeWithConditions = <
  NodeType extends AST_NODE_TYPES,
  ExtractedNode extends Extract<TSESTree.Node, { type: NodeType }>,
  Conditions extends Partial<ExtractedNode>,
>(
  nodeType: NodeType,
  conditions: Conditions,
): ((
  node: TSESTree.Node | null | undefined,
) => node is Conditions & ExtractedNode) => {
  const entries = Object.entries(conditions) as ObjectEntries<TSESTree.Node>;

  return (
    node: TSESTree.Node | null | undefined,
  ): node is Conditions & ExtractedNode =>
    node?.type === nodeType &&
    entries.every(([key, value]) => node[key as keyof TSESTree.Node] === value);
};

export const isTokenOfTypeWithConditions = <
  TokenType extends AST_TOKEN_TYPES,
  // This is technically unsafe, but we find it useful to extract out the type
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  ExtractedToken extends Extract<TSESTree.Token, { type: TokenType }>,
  Conditions extends Partial<{ type: TokenType } & TSESTree.Token>,
>(
  tokenType: TokenType,
  conditions: Conditions,
): ((
  token: TSESTree.Token | null | undefined,
) => token is Conditions & ExtractedToken) => {
  const entries = Object.entries(conditions) as ObjectEntries<TSESTree.Token>;

  return (
    token: TSESTree.Token | null | undefined,
  ): token is Conditions & ExtractedToken =>
    token?.type === tokenType &&
    entries.every(
      ([key, value]) => token[key as keyof TSESTree.Token] === value,
    );
};

export const isNotTokenOfTypeWithConditions =
  <
    TokenType extends AST_TOKEN_TYPES,
    ExtractedToken extends Extract<TSESTree.Token, { type: TokenType }>,
    Conditions extends Partial<ExtractedToken>,
  >(
    tokenType: TokenType,
    conditions: Conditions,
  ): ((
    token: TSESTree.Token | null | undefined,
  ) => token is Exclude<TSESTree.Token, Conditions & ExtractedToken>) =>
  (token): token is Exclude<TSESTree.Token, Conditions & ExtractedToken> =>
    !isTokenOfTypeWithConditions(tokenType, conditions)(token);

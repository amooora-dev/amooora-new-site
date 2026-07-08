export const PRODUTO_ESGOTADO_LABEL = 'Produto esgotado';

export function isProdutoEsgotado(produto: { esgotado?: boolean }): boolean {
  return Boolean(produto.esgotado);
}

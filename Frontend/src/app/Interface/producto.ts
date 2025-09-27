export interface Producto {
  idProducto: number;
  codigoBarra: string;
  descripcion: string;
  idCatagoria: number;
  categoriaDescripcion: string;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  estado: string;
}

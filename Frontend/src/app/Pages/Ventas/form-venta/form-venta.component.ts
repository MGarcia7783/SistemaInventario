import { Producto } from './../../../Interface/producto';
import { Component, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../Services/producto.service';
import { FormsModule } from '@angular/forms';
import { DetalleVenta } from '../../../Interface/detalleventa';
import { Venta } from '../../../Interface/venta';
import { VentaService } from '../../../Services/venta.service';

@Component({
  selector: 'app-form-venta',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './form-venta.component.html',
  styleUrl: './form-venta.component.css'
})
export class FormVentaComponent implements OnInit {
  listaProductos: boolean = false;
  productos: Producto[] = [];
  productoFiltro: string = '';
  productosFiltrados: Producto[] = [];
  codigoProducto: string = '';

  venta: Venta = { idVenta: 0, dni: 'Sin identificación', cliente: 'Cliente mostrador', descuento: 0, total: 0, idUsuario: 3 };

  detalleVentas: DetalleVenta[] = [];
  subtotal: number = 0;
  descuentoTotal: number = 0;
  totalGeneral: number = 0;

  botonGuardarActivo: boolean = false;
  formBloqueado: boolean = false;

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();

    setTimeout(() => {
      const inputIdentificacion = document.getElementById('identificacion') as HTMLInputElement;
      if(inputIdentificacion) {
        inputIdentificacion.focus()
      }
    }, 100);
  }


  //Pasar focus al presionar la tecla enter
  moverFocus(siguienteId: string) {
    setTimeout(() => {
      const siguienteInput = document.getElementById(siguienteId) as HTMLInputElement;
      if(siguienteInput) {
        siguienteInput.focus();
      }
    }, 100);
  }

  //Cargar listado de productos
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (response) => {
        if(response && Array.isArray(response)) {
          this.productos = response;
          this.productosFiltrados = response;
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }


  //Filtrar productos
  fitrarProducto() {
    this.listaProductos = this.productoFiltro.length > 0;  //Solo se mostrar si hay texto en el input
    this.productosFiltrados = this.productos.filter(producto =>
      producto.descripcion.toLocaleLowerCase().includes(this.productoFiltro.toLocaleLowerCase())
    );
  }


  //Seleccionar producto
  seleccionarProducto(producto: Producto) {
    this.productoFiltro = producto.descripcion;
    this.codigoProducto = producto.codigoBarra;
    this.listaProductos = false;

    //Pasar focus al input producto despues de seleccionar un elemento de la lista
    setTimeout(() => {
      const inputProducto = document.querySelector('input[name="producto"]') as HTMLInputElement;
      if(inputProducto) {
        inputProducto.focus();
      }
    }, 500);
  }


  //Buscar producto por código
    buscarProductoCodigo(): void {
      const productoEncontrado = this.productos.find(producto => producto.codigoBarra === this.codigoProducto);
      if(productoEncontrado) {
        this.productoFiltro = productoEncontrado.descripcion;
        this.listaProductos = false;
        setTimeout(() => {
        const inputProducto = document.querySelector('input[name="producto"]') as HTMLInputElement;
        if(inputProducto) {
          inputProducto.focus();
        }
      }, 100);
      } else {
        window.alert('Producto no encontrado.');
        this.productoFiltro = '';  // Limpiar el input del producto si no se encuentra unregistro
      }
    }


  //Agregar al detalle de la venta
  agregarProductoTabla(): void {
    if(this.productoFiltro.trim()) {
      const productoSeleccionado = this.productos.find(producto => producto.descripcion === this.productoFiltro);

      if(productoSeleccionado) {
        if(productoSeleccionado.stock <= 0) {
          window.alert('El producto no está disponible: "stock = 0".');
          return;
        }

        const productoRepetido = this.detalleVentas.some(detalle => detalle.idProducto === productoSeleccionado.idProducto);
        if(productoRepetido) {
          window.alert('El producto ya se encuentra en la lista.');
          return;
        }

        const detalleVenta: DetalleVenta = {
          idDetalleVenta: 0,
          idVenta: 0,
          idProducto: productoSeleccionado.idProducto,
          nombreProducto: productoSeleccionado.descripcion,
          precio: productoSeleccionado.precioVenta,
          cantidad: 1,
          descuento: 0,
          total: 0
        };
        this.detalleVentas.push(detalleVenta);
        this.caclularTotalFila(detalleVenta);

        this.botonGuardarActivo = this.detalleVentas.length > 0;

        this.codigoProducto = '';
        this.productoFiltro = '';

        //Pasar el focus al input código del producto
        setTimeout(() => {
          const inputCodigo = document.querySelector('input[name="codigo"]') as HTMLFormElement;
          if(inputCodigo) {
            inputCodigo.focus();
          }
        }, 100);
      }
    }
  }


  //Eliminar una fila de la tabla
  eliminarProducto(detalle: DetalleVenta): void {
    const confirmar = confirm(`¿Está seguro que desea eliminar el producto: "${detalle.nombreProducto}"?`);
    if(!confirmar) {
      return;
    }

    this.detalleVentas = this.detalleVentas.filter(fila => fila.idProducto !== detalle.idProducto);
    this.sumaTotalGeneral();
    this.botonGuardarActivo = this.detalleVentas.length > 0;
  }


  //Calcular total por fila de la tabla
  caclularTotalFila(detalle: DetalleVenta): void {
    const cantidad = Number(detalle.cantidad) || 0;
    const precio = Number(detalle.precio) || 0;
    const descuento = Number(detalle.descuento) || 0;

    detalle.total = (cantidad * precio) - descuento;
    this.sumaTotalGeneral();
  }


  //Calcular el total general de la venta
  sumaTotalGeneral(): void {
    const subtotal = this.detalleVentas.reduce((sum, item) => sum +(item.precio * item.cantidad), 0);
    const descuento = this.detalleVentas.reduce((sum, item ) => sum + item.descuento, 0);
    const totalGeneral = subtotal - descuento;

    this.subtotal = subtotal;
    this.descuentoTotal = descuento;
    this.totalGeneral = totalGeneral;
  }


  //Editar la cantidad vendida
  validarCantidad(detalle: DetalleVenta): void {
    const productoSeleccionado = this.productos.find(producto => producto.idProducto === detalle.idProducto);

    if(productoSeleccionado) {
      //Validar que la cantidad no sea nula, vacia o menor o igua a cero
      if(detalle.cantidad == null || detalle.cantidad <= 0 || isNaN(detalle.cantidad)) {
        window.alert('Debe ingresar una cantidad válida mayor a cero.');
        detalle.cantidad = 1;
        return;
      }

      //Validar que la cantidad no exceda el stock
      if(detalle.cantidad > productoSeleccionado.stock) {
        window.alert('La cantidad no puede ser mayor que el stock disponible. Disponibilidd en inventario: ' + productoSeleccionado.stock + '.');
        detalle.cantidad = productoSeleccionado.stock;
      } else {
        detalle.editarCantidad = false;
        this.caclularTotalFila(detalle);
      }
    }
  }


  //Editar el descuento de la venta
  validarDescuento(detalle: DetalleVenta): void {
    const productoSeleccionado = this.productos.find(producto => producto.idProducto === detalle.idProducto);

    if(productoSeleccionado) {

      if(detalle.descuento == null || detalle.descuento < 0 || isNaN(detalle.descuento)) {
        window.alert('Debe ingresar un descuento válido mayor o igual a cero.');
        detalle.descuento = 0;
        return;
      }

      //Validar que el descuento no exceda el precio de venta
      if(detalle.descuento > productoSeleccionado.precioVenta) {
        window.alert('el descuento no puede ser mayor que el precio de la venta.');
        detalle.descuento = 0;
      } else {
        detalle.editarDescuento = false;
        this.caclularTotalFila(detalle);
      }
    }
  }


  //Cerrar input de edición
  cerrarInput(detalle: DetalleVenta, event: MouseEvent): void {
    //Convierte el objeto del evento en un elemneto HTML
    const inputElement = (event.target as HTMLElement);

    if(inputElement.tagName.toLowerCase() != 'input') {
      this.validarCantidad(detalle);
      this.validarDescuento(detalle);
    }
  }


  mostrarListaProductos() {
    this.listaProductos = true;
  }


  cerrarListaProductos() {
    setTimeout(() => {
      this.listaProductos = false;
    }, 150)
  }


  //Método para guardar una nueva venta
  guardarVenta(): void {
    if(!this.venta.dni?.trim() || !this.venta.cliente?.trim()) {
      window.alert('Debe completar todos los campos requeridos.');
      return;
    }

    if(this.detalleVentas.length === 0) {
      window.alert('Debe agregar al menos un producto antes de guardar la venta.');
      return;
    }

    //Llenar los datos de la venta antes de guardar
    this.venta.descuento = this.descuentoTotal;
    this.venta.total = this.totalGeneral;
    this.venta.idUsuario = 3;
    this.venta.detalleVentas = this.detalleVentas;

    this.ventaService.createVenta(this.venta).subscribe({
      next:(response: any) => {
        if(response && response.data) {
          this.venta = response.data;
          window.alert('La venta se ha registrado satisfactoriamente.');

          this.botonGuardarActivo = false;
          this.formBloqueado = true;
        }
      },
      error: (error) => {
        window.alert('Error al guardar la venta: ' + error.message);
      }
    });
  }

  //Nueva venta
  nuevaVenta(): void {
    this.codigoProducto = '';
    this.productoFiltro = '';
    this.detalleVentas = [];

    this.subtotal = 0;
    this.descuentoTotal = 0;
    this.totalGeneral = 0;
    this.botonGuardarActivo = false;
    this.formBloqueado = false;

    setTimeout(() =>{
      const inputIdentificacion = document.getElementById('identificacion') as HTMLInputElement;
      if(inputIdentificacion) {
        inputIdentificacion.value = 'Sin identificación';
        inputIdentificacion.focus();
      }

      const inputCliente = document.getElementById('cliente') as HTMLInputElement;
      if(inputCliente) {
        inputCliente.value = 'Cliente mostrador';
      }

      const inputCodigo = document.getElementById('codigo') as HTMLInputElement;
      if(inputCodigo) {
        inputCodigo.value = '';
      }
    }, 100);
  }
}

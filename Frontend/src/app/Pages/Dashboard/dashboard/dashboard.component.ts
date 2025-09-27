import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts'
import { ChartData, ChartOptions } from 'chart.js'
import { VentasUltimaSemanaService } from '../../../Services/ventas-ultima-semana.service';
import { TotalProductosVendidosService } from '../../../Services/total-productos-vendidos.service';
import { IngresosUltimaSemanaService } from '../../../Services/ingresos-ultima-semana.service';
import { ProductosMasVendidosService } from '../../../Services/productos-mas-vendidos.service';
import { ProductosPorAgotarService } from '../../../Services/productos-por-agotar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  // Variables para el gráfico de línea: ventas de la última semana
  ventasChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Ventas diarias',
        data: [],
        fill: true,
        borderColor: '#007bff',
        tension: 0.3
      }
    ]
  };

  ventasChartOptions: ChartOptions<'line'> = {
    responsive: true,  // hace que el grafico se ajuste al tamaño del contenedor
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  productosChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Cantidad vendida',
        data: [],
        backgroundColor: '#28a745'
      }
    ]
  };
  productosChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  //Variables
  ventasUltimaSemana: any[] = [];
  totalVentas: number = 0;
  totalProductosVendidos: any[] = [];
  totalProductos: number = 0;
  ingresosUltimaSemana: any[] = [];
  totalIngresos: number = 0;
  productosPorAgotar: any[] = [];

  constructor(
    private ventasUltimaSemanaService: VentasUltimaSemanaService,
    private totalProductosVendidosService: TotalProductosVendidosService,
    private ingresosUltimaSemanaService: IngresosUltimaSemanaService,
    private productosMasVendidosService: ProductosMasVendidosService,
    private productosPorAgotarseService: ProductosPorAgotarService
  ) {}

  ngOnInit(): void {
      this.obtenerVentasUltimaSemana();
      this.obtenerTotaProductosVendidos();
      this.obtenerIngresosUltimaSemana();
      this.obtenerVentas();
      this.obtenerProductosMasvendidos();
      this.obtenerProductosPorAgotar();
  }

  obtenerVentasUltimaSemana(): void {
    this.ventasUltimaSemanaService.getVentasUltimaSemana().subscribe({
      next: (ventas) => {
        if( ventas && ventas.length > 0) {
          this.totalVentas = ventas.reduce((totalAcumulado, registroVenta) => totalAcumulado + registroVenta.totalVentas, 0);
        } else {
          this.totalVentas = 0;
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  obtenerTotaProductosVendidos(): void {
    this.totalProductosVendidosService.getTotalProductosVendidos().subscribe({
      next: (productos) => {
        if( productos && productos.length > 0) {
          this.totalProductos = productos.reduce((totalAcumulado, productoVendido) => totalAcumulado + productoVendido.totalProductos , 0);
        } else {
          this.totalProductos = 0;
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  obtenerIngresosUltimaSemana(): void {
    this.ingresosUltimaSemanaService.getIngresosVentasUltimaSemana().subscribe({
      next: (ingresos) => {
        if( ingresos && ingresos.length > 0) {
          this.totalIngresos = ingresos.reduce((totalAcumulado, ingresoRegistrado) => totalAcumulado + ingresoRegistrado.totalIngresos , 0);
        } else {
          this.totalIngresos = 0;
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  //Formtaear números con decimales
  formatearNumero(valor: number | null | undefined): string {
    return (valor ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  obtenerVentas(): void {
    this.ventasUltimaSemanaService.getVentasUltimaSemana().subscribe({
      next: (ventas) => {
        if(ventas && Array.isArray(ventas)) {
          const fechas = ventas.map((item: any) => item.fecha);
          const totales = ventas.map((item: any) => item.totalVentas);

          this.ventasChartData = {
            labels: fechas,
            datasets: [
              {
                label: 'Ventas diarias',
                data: totales,
                fill: true,
                borderColor: '#007bff',
                tension: 0.3
              }
            ]
          };
        } else {
          this.ventasChartData = {
            labels: [],
            datasets: [
              {
                label: 'Ventas diarias',
                data: [],
                fill: false,
                borderColor: '#007bff',
                tension: 0.3
              }
            ]
          };
        }
      },
      error: (error) => {
        window.alert(error.message);
        this.ventasChartData = {
          labels: [],
            datasets: [
              {
                label: 'Ventas diarias',
                data: [],
                fill: false,
                borderColor: '#007bff',
                tension: 0.3
              }
            ]
        };
      }
    });
  }

  obtenerProductosMasvendidos(): void {
    this.productosMasVendidosService.getProductosMasVendidos().subscribe({
      next: (productos) => {
        if(productos && Array.isArray(productos)) {
          const nombre = productos.map((item: any) => item.producto);
          const cantidad = productos.map((item: any) => item.cantidadVendida);

          //Arreglo de colores
          const colores = [
            '#007bff', '#28a745', '#dc3545'
          ];

          const colorBarra = cantidad.map((_, i) => colores[i % colores.length]);

          this.productosChartData = {
            labels: nombre,
            datasets: [
              {
                label: 'Cantidad vendida',
                data: cantidad,
                backgroundColor: colorBarra
              }
            ]
          };
        } else {
          this.productosChartData = {
            labels: [],
            datasets: [
              {
                label: 'Cantidad vendida',
                data: [],
                backgroundColor: []
              }
            ]
          };
        }
      },
      error: (error) => {
        window.alert(error.message);
        this.productosChartData = {
          labels: [],
          datasets: [
            {
              label: 'Cantidad vendida',
              data: [],
              backgroundColor: []
            }
          ]
        };
      }
    });
  }

  obtenerProductosPorAgotar(): void {
    this.productosPorAgotarseService.getProductosPorAgotar().subscribe({
      next: (prodcutos) => {
        if(prodcutos && Array.isArray(prodcutos)) {
          this.productosPorAgotar = prodcutos;
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }
}

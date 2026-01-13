/**
 * Excel Exporter Utility
 * Export price comparisons, shopping lists, and inflation reports to Excel
 */

import * as XLSX from 'xlsx';

interface Product {
  ean?: string;
  name: string;
  price: number;
  store?: string;
  territory?: string;
  [key: string]: any;
}

export class ExcelExporter {
  /**
   * Export price comparison to Excel
   */
  exportPriceComparison(products: Product[]): Blob {
    const worksheet = XLSX.utils.json_to_sheet(
      products.map(p => ({
        'Code EAN': p.ean || 'N/A',
        'Produit': p.name,
        'Prix (€)': p.price.toFixed(2),
        'Magasin': p.store || 'N/A',
        'Territoire': p.territory || 'N/A'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparaison Prix');

    // Add summary statistics
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));

    const summaryData = [
      { Statistique: 'Prix Minimum', Valeur: `${minPrice.toFixed(2)}€` },
      { Statistique: 'Prix Maximum', Valeur: `${maxPrice.toFixed(2)}€` },
      { Statistique: 'Prix Moyen', Valeur: `${avgPrice.toFixed(2)}€` },
      { Statistique: 'Écart', Valeur: `${(maxPrice - minPrice).toFixed(2)}€` }
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Statistiques');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Export shopping list to Excel
   */
  exportShoppingList(list: any): Blob {
    const worksheet = XLSX.utils.json_to_sheet(
      list.items.map((item: any) => ({
        'Produit': item.productName,
        'Code EAN': item.productEAN,
        'Quantité': item.quantity,
        'Catégorie': item.category,
        'Priorité': item.priority,
        'Notes': item.notes || ''
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Liste de Courses');

    // Add optimization results if available
    if (list.optimization) {
      const opt = list.optimization;
      const optData = opt.stores.map((store: any) => ({
        'Magasin': store.storeName,
        'Nombre d\'articles': store.items.length,
        'Sous-total (€)': store.subtotal.toFixed(2)
      }));

      const optSheet = XLSX.utils.json_to_sheet(optData);
      XLSX.utils.book_append_sheet(workbook, optSheet, 'Optimisation');
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Export inflation report to Excel
   */
  exportInflationReport(data: any): Blob {
    const workbook = XLSX.utils.book_new();

    // Overview sheet
    const overviewData = data.territories.map((t: any) => ({
      'Territoire': t.territoryName,
      'Taux d\'inflation (%)': t.overallInflationRate.toFixed(2),
      'Écart métropole (%)': t.comparedToMetropole?.toFixed(2) || 'N/A',
      'Dernière mise à jour': new Date(t.lastUpdated).toLocaleDateString('fr-FR')
    }));

    const overviewSheet = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Vue d\'ensemble');

    // Category details for each territory
    data.territories.forEach((territory: any) => {
      const categoryData = territory.categories.map((cat: any) => ({
        'Catégorie': cat.category,
        'Prix Moyen Actuel (€)': cat.currentAverage.toFixed(2),
        'Prix Moyen Précédent (€)': cat.previousAverage.toFixed(2),
        'Taux d\'inflation (%)': cat.inflationRate.toFixed(2),
        'Changement (€)': cat.priceChange.toFixed(2)
      }));

      const categorySheet = XLSX.utils.json_to_sheet(categoryData);
      const sheetName = territory.territoryName.substring(0, 31); // Excel limit
      XLSX.utils.book_append_sheet(workbook, categorySheet, sheetName);
    });

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Trigger download of Excel file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const excelExporter = new ExcelExporter();

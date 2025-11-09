// ProductsController.ts - Controller for product search API
// Searches products using Open Food Facts API

interface Product {
  name: string;
  brand: string;
  ean: string;
  image: string | null;
}

class ProductsController {
  /**
   * GET /api/products/search
   * Search products by name/keyword
   */
  async search({ request, response }) {
    try {
      const q = (request.qs().q || '').trim();
      
      if (q.length < 3) {
        return response.ok([]);
      }

      const territory = request.qs().territory || 'Guadeloupe';

      try {
        // Search Open Food Facts
        const results = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=15`
        ).then((r) => r.json());

        const items = (results.products || [])
          .map((p: any) => ({
            name: p.product_name || p.generic_name || 'Produit inconnu',
            brand: p.brands || '—',
            ean: p.code,
            image: p.image_small_url || p.image_url || null,
          }))
          .filter((p: any) => p.ean)
          .slice(0, 15);

        return response.ok(items);
      } catch (err) {
        console.error('Erreur API produits :', err);
        return response.status(500).send({ error: 'Erreur lors de la recherche de produits' });
      }
    } catch (error) {
      return response.internalServerError({
        error: 'Error searching products',
        message: error.message
      });
    }
  }
}

export default ProductsController;

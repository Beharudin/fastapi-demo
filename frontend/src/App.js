import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import { useProductModalStore } from './store/useProductModal';

const API_BASE = 'http://localhost:8000';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    isAddProductOpen,
    isEditProductOpen,
    isDeleteWarningOpen,
    selectedProduct,
    newProduct,
    setAddProductOpen,
    setEditProductOpen,
    setDeleteWarningOpen,
    setSelectedProduct,
    setNewProduct,
    resetNewProduct,
    resetSelectedProduct,
  } = useProductModalStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const openAddModal = () => {
    resetNewProduct();
    resetSelectedProduct();
    setAddProductOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
    });
    setEditProductOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteWarningOpen(true);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(newProduct.id, 10),
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
        }),
      });
      if (response.ok) {
        await fetchProducts();
        resetNewProduct();
        setAddProductOpen(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    const updatedProduct = {
      id: parseInt(newProduct.id, 10),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity, 10),
    };

    try {
      const response = await fetch(`${API_BASE}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        setProducts((current) => current.map((product) => (product.id === selectedProduct.id ? updatedProduct : product)));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setProducts((current) => current.map((product) => (product.id === selectedProduct.id ? updatedProduct : product)));
    } finally {
      setEditProductOpen(false);
      resetSelectedProduct();
      resetNewProduct();
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        setProducts((current) => current.filter((product) => product.id !== selectedProduct.id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setProducts((current) => current.filter((product) => product.id !== selectedProduct.id));
    } finally {
      setDeleteWarningOpen(false);
      resetSelectedProduct();
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground mt-2">View inventory and manage products with edit/delete modals.</p>
          </div>
          <Button type="button" onClick={openAddModal}>
            Add Product
          </Button>
        </div>

        <Dialog.Root open={isAddProductOpen} onOpenChange={setAddProductOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(95%,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-xl font-semibold">Add New Product</Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" type="button">
                    ✕
                  </Button>
                </Dialog.Close>
              </div>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-id">ID</Label>
                    <Input
                      id="add-id"
                      type="number"
                      value={newProduct.id}
                      onChange={(e) => setNewProduct({ id: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-name">Name</Label>
                    <Input
                      id="add-name"
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="add-description">Description</Label>
                    <Input
                      id="add-description"
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-price">Price</Label>
                    <Input
                      id="add-price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-quantity">Quantity</Label>
                    <Input
                      id="add-quantity"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Dialog.Close asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root open={isEditProductOpen} onOpenChange={setEditProductOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(95%,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-xl font-semibold">Edit Product</Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" type="button">
                    ✕
                  </Button>
                </Dialog.Close>
              </div>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-id">ID</Label>
                    <Input
                      id="edit-id"
                      type="number"
                      value={newProduct.id}
                      onChange={(e) => setNewProduct({ id: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                      id="edit-quantity"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Dialog.Close asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root open={isDeleteWarningOpen} onOpenChange={setDeleteWarningOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(95%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-2xl">
              <div className="mb-4">
                <Dialog.Title className="text-xl font-semibold">Delete Product</Dialog.Title>
                <p className="text-sm text-muted-foreground mt-2">
                  Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </Dialog.Close>
                <Button type="button" variant="destructive" onClick={handleDeleteProduct} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="mb-6">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">All Products</h2>
          <Table>
            <TableCaption>A list of all products in the inventory.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(product)}>
                        Edit
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => openDeleteModal(product)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default App;

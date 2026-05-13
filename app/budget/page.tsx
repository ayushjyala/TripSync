'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, X, Download } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
}

const CATEGORIES = [
  'Accommodation',
  'Food & Dining',
  'Transportation',
  'Activities & Attractions',
  'Shopping',
  'Miscellaneous'
];

const COLORS = [
  '#4F8FBA', // Primary teal
  '#A67C28', // Saffron-ish
  '#6B5B95', // Purple
  '#88B0D3', // Light blue
  '#C7A574', // Tan
  '#A8A8A8'  // Gray
];

export default function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Accommodation', amount: 2000 },
    { id: '2', category: 'Food & Dining', amount: 1500 },
    { id: '3', category: 'Transportation', amount: 1000 }
  ]);

  const [newCategory, setNewCategory] = useState('Accommodation');
  const [newAmount, setNewAmount] = useState('');

  const addItem = () => {
    if (newAmount && parseFloat(newAmount) > 0) {
      setBudgetItems(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          category: newCategory,
          amount: parseFloat(newAmount)
        }
      ]);
      setNewAmount('');
    }
  };

  const removeItem = (id: string) => {
    setBudgetItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, amount: number) => {
    setBudgetItems(prev =>
      prev.map(item => item.id === id ? { ...item, amount } : item)
    );
  };

  // Calculate totals
  const totalBudget = useMemo(() => {
    return budgetItems.reduce((sum, item) => sum + item.amount, 0);
  }, [budgetItems]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    budgetItems.forEach(item => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [budgetItems]);

  const downloadBudget = () => {
    const content = `
TripSync Budget Breakdown
=========================

Total Budget: ₹${totalBudget.toLocaleString()}

Category-wise Breakdown:
${categoryTotals
  .sort((a, b) => b.value - a.value)
  .map(cat => `${cat.name}: ₹${cat.value.toLocaleString()} (${((cat.value / totalBudget) * 100).toFixed(1)}%)`)
  .join('\n')}

Itemized Budget:
${budgetItems
  .sort((a, b) => b.amount - a.amount)
  .map(item => `${item.category}: ₹${item.amount.toLocaleString()}`)
  .join('\n')}

Plan your trip at TripSync!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'budget-breakdown.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Trip Budget Calculator</h1>
            <p className="text-muted-foreground">
              Plan your trip budget with detailed category breakdown
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Add Items */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Add Budget Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 mt-1 border border-border rounded-md bg-background text-foreground"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Amount (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={addItem}
                    disabled={!newAmount || parseFloat(newAmount) <= 0}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>

                  <Button
                    onClick={downloadBudget}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Budget
                  </Button>

                  {/* Total Summary */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Budget:</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {budgetItems.length} items
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Charts and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Charts */}
              {categoryTotals.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryTotals}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${((entry.value / totalBudget) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryTotals.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">By Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryTotals.sort((a, b) => b.value - a.value)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                          <Bar dataKey="value" fill="#4F8FBA" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Category Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryTotals
                      .sort((a, b) => b.value - a.value)
                      .map((cat, idx) => (
                        <div key={cat.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[budgetItems.findIndex(item => item.category === cat.name) % COLORS.length] }}
                            />
                            <span className="text-foreground">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              ₹{cat.value.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {((cat.value / totalBudget) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Itemized List */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {budgetItems.length > 0 ? (
                    <div className="space-y-2">
                      {budgetItems
                        .sort((a, b) => b.amount - a.amount)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{item.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                step="100"
                                value={item.amount}
                                onChange={(e) => updateItem(item.id, parseFloat(e.target.value) || 0)}
                                className="w-24 text-right"
                              />
                              <span className="text-foreground font-medium min-w-fit">₹{item.amount.toLocaleString()}</span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No budget items added yet. Start by adding your first item!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

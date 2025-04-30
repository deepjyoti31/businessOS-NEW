
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FinanceTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock transactions
  const transactions = [
    {
      id: "TR-001",
      date: "2025-03-25",
      type: "Income",
      description: "Client payment - ABC Corp",
      amount: 12500,
    },
    {
      id: "TR-002",
      date: "2025-03-24",
      type: "Expense",
      description: "Office rent payment",
      amount: -3500,
    },
    {
      id: "TR-003",
      date: "2025-03-23",
      type: "Expense",
      description: "Software subscription",
      amount: -299,
    },
    {
      id: "TR-004",
      date: "2025-03-22",
      type: "Income",
      description: "Client payment - XYZ Ltd",
      amount: 9750,
    },
    {
      id: "TR-005",
      date: "2025-03-21",
      type: "Expense",
      description: "Marketing expenses",
      amount: -1250,
    },
  ];

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Transactions</h1>
        <p className="text-muted-foreground">
          Manage and track all your financial transactions
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Transaction
        </Button>
      </div>
          
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.type === "Income"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No transactions found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm">Previous</Button>
        <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Transaction Assistant</CardTitle>
          <CardDescription>
            Get help analyzing your transactions with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Ask our AI to help you categorize transactions, find patterns, or reconcile accounts:
          </p>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about your transactions..."
              className="w-full pr-24"
            />
            <Button className="absolute right-1 top-1">
              Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceTransactions;

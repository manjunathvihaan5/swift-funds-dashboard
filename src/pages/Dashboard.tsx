import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  FileCheck, 
  Clock, 
  ArrowRight, 
  Building2, 
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  bankAccount: string;
  status: "pending" | "kyc_required" | "processing" | "completed" | "failed";
  date: string;
  senderName: string;
  purpose: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    amount: 5000,
    currency: "USD",
    bankAccount: "HDFC Bank - ***4521",
    status: "kyc_required",
    date: "2024-01-15",
    senderName: "Global Tech Corp",
    purpose: "Software Services"
  },
  {
    id: "TXN002",
    amount: 2500,
    currency: "USD",
    bankAccount: "ICICI Bank - ***7890",
    status: "pending",
    date: "2024-01-14",
    senderName: "Digital Solutions Ltd",
    purpose: "Consulting Fees"
  },
  {
    id: "TXN003",
    amount: 7500,
    currency: "USD",
    bankAccount: "SBI - ***1234",
    status: "processing",
    date: "2024-01-13",
    senderName: "Innovation Inc",
    purpose: "Project Payment"
  }
];

const Dashboard = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const navigate = useNavigate();

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "kyc_required":
        return <Badge variant="destructive" className="bg-neon-pink/20 text-neon-pink border-neon-pink/30">KYC Required</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">Pending</Badge>;
      case "processing":
        return <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">Processing</Badge>;
      case "completed":
        return <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "kyc_required":
        return <FileCheck className="w-4 h-4 text-neon-pink" />;
      case "pending":
        return <Clock className="w-4 h-4 text-neon-blue" />;
      case "processing":
        return <Progress value={60} className="w-16 h-2" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const totalPending = transactions
    .filter(t => t.status === "pending" || t.status === "kyc_required")
    .reduce((sum, t) => sum + t.amount, 0);

  const kycRequired = transactions.filter(t => t.status === "kyc_required").length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Fund Transfer Dashboard
          </h1>
          <p className="text-muted-foreground">Track your international transfers and complete KYC</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pending</p>
                  <p className="text-2xl font-bold text-primary">${totalPending.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg shadow-neon-pink/10 hover:shadow-neon-pink/20 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">KYC Required</p>
                  <p className="text-2xl font-bold text-neon-pink">{kycRequired}</p>
                </div>
                <FileCheck className="w-8 h-8 text-neon-pink/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Transfers</p>
                  <p className="text-2xl font-bold text-accent">{transactions.length}</p>
                </div>
                <ArrowRight className="w-8 h-8 text-accent/70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Pending Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/70 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{transaction.senderName}</h3>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.purpose}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      ${transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.bankAccount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transaction.status)}
                    <span className="text-sm text-muted-foreground">
                      Transaction ID: {transaction.id}
                    </span>
                  </div>

                  {transaction.status === "kyc_required" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/kyc/individual/${transaction.id}`)}
                        className="border-border/50 hover:bg-secondary/50"
                      >
                        <User className="w-4 h-4 mr-1" />
                        Individual KYC
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/kyc/company/${transaction.id}`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                      >
                        <Building2 className="w-4 h-4 mr-1" />
                        Company KYC
                      </Button>
                    </div>
                  )}

                  {transaction.status === "processing" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/tracking/${transaction.id}`)}
                      className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                    >
                      Track Status
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
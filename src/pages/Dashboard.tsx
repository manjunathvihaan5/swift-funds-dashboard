import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  IndianRupee, 
  FileCheck, 
  Clock, 
  ArrowRight, 
  Building2, 
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  Sparkles
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  bankAccount: string;
  accountNumber: string;
  ifscCode: string;
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
    bankAccount: "HDFC Bank",
    accountNumber: "****4521",
    ifscCode: "HDFC0000123",
    status: "kyc_required",
    date: "2024-01-15",
    senderName: "Global Tech Corp",
    purpose: "Software Services"
  },
  {
    id: "TXN002",
    amount: 2500,
    currency: "USD",
    bankAccount: "ICICI Bank",
    accountNumber: "****7890",
    ifscCode: "ICIC0000456",
    status: "pending",
    date: "2024-01-14",
    senderName: "Digital Solutions Ltd",
    purpose: "Consulting Fees"
  },
  {
    id: "TXN003",
    amount: 7500,
    currency: "USD",
    bankAccount: "SBI",
    accountNumber: "****1234",
    ifscCode: "SBIN0000789",
    status: "processing",
    date: "2024-01-13",
    senderName: "Innovation Inc",
    purpose: "Project Payment"
  },
  {
    id: "TXN004",
    amount: 3000,
    currency: "USD",
    bankAccount: "Axis Bank",
    accountNumber: "****5678",
    ifscCode: "UTIB0000321",
    status: "completed",
    date: "2024-01-12",
    senderName: "Tech Innovations",
    purpose: "Development Work"
  },
  {
    id: "TXN005",
    amount: 1200,
    currency: "USD",
    bankAccount: "Kotak Bank",
    accountNumber: "****9876",
    ifscCode: "KKBK0000654",
    status: "failed",
    date: "2024-01-11",
    senderName: "Software Corp",
    purpose: "Maintenance Services"
  }
];

const Dashboard = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "kyc">("all");
  const navigate = useNavigate();

  const filteredTransactions = transactions.filter(transaction => {
    switch (filter) {
      case "active":
        return ["pending", "kyc_required", "processing"].includes(transaction.status);
      case "pending":
        return transaction.status === "pending";
      case "kyc":
        return transaction.status === "kyc_required";
      default:
        return true; // Show all transactions
    }
  });

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "kyc_required":
        return <Badge className="bg-gradient-to-r from-warning to-brand-tertiary text-white border-0 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">KYC Required</Badge>;
      case "pending":
        return <Badge className="bg-gradient-to-r from-info to-brand-quaternary text-white border-0 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Pending</Badge>;
      case "processing":
        return <Badge className="bg-gradient-to-r from-brand-primary to-neon-purple text-white border-0 px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-glow-pulse">Processing</Badge>;
      case "completed":
        return <Badge className="bg-gradient-to-r from-success to-brand-secondary text-white border-0 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Completed</Badge>;
      case "failed":
        return <Badge className="bg-gradient-to-r from-error to-destructive text-white border-0 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Failed</Badge>;
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "kyc_required":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-warning to-brand-tertiary rounded-full">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-warning">Identity verification required</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-info to-brand-quaternary rounded-full">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-info">Awaiting processing</span>
          </div>
        );
      case "processing":
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-brand-primary to-neon-purple rounded-full animate-glow-pulse">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-brand-primary">Processing transfer</span>
              <Progress value={60} className="w-20 h-2 bg-muted" />
            </div>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-success to-brand-secondary rounded-full">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-success">Transfer completed</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-error to-destructive rounded-full">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-error">Transfer failed</span>
          </div>
        );
    }
  };

  const totalPending = transactions
    .filter(t => t.status === "pending" || t.status === "kyc_required")
    .reduce((sum, t) => sum + t.amount, 0);

  const kycRequired = transactions.filter(t => t.status === "kyc_required").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-brand animate-glow-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-brand-tertiary animate-bounce-gentle" />
          </div>
          <h1 className="text-5xl font-bold gradient-text leading-tight">
            Fund Transfer Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, fast, and transparent international money transfers with real-time tracking
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="lg"
            onClick={() => setFilter("all")}
            className={`${filter === "all" 
              ? "bg-gradient-primary text-white shadow-brand border-0 btn-glow" 
              : "border-2 border-border bg-card hover:bg-gradient-primary hover:text-white hover:border-transparent"} 
              px-8 py-3 text-base font-semibold rounded-2xl transition-all`}
          >
            All Transfers
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="lg"
            onClick={() => setFilter("active")}
            className={`${filter === "active" 
              ? "bg-gradient-secondary text-white shadow-lg shadow-accent/30 border-0 btn-glow" 
              : "border-2 border-border bg-card hover:bg-gradient-secondary hover:text-white hover:border-transparent"} 
              px-8 py-3 text-base font-semibold rounded-2xl transition-all`}
          >
            Active Transfers
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="lg"
            onClick={() => setFilter("pending")}
            className={`${filter === "pending" 
              ? "bg-info text-white shadow-lg shadow-info/30 border-0 btn-glow" 
              : "border-2 border-border bg-card hover:bg-info hover:text-white hover:border-transparent"} 
              px-8 py-3 text-base font-semibold rounded-2xl transition-all`}
          >
            Pending
          </Button>
          <Button
            variant={filter === "kyc" ? "default" : "outline"}
            size="lg"
            onClick={() => setFilter("kyc")}
            className={`${filter === "kyc" 
              ? "bg-warning text-white shadow-lg shadow-warning/30 border-0 btn-glow" 
              : "border-2 border-border bg-card hover:bg-warning hover:text-white hover:border-transparent"} 
              px-8 py-3 text-base font-semibold rounded-2xl transition-all`}
          >
            KYC Required
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group border-0 bg-gradient-to-br from-white to-info/5 shadow-xl hover:shadow-2xl hover:shadow-info/20 transition-all cursor-pointer transform hover:-translate-y-1 rounded-3xl overflow-hidden"
                onClick={() => setFilter("pending")}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-info to-brand-quaternary rounded-2xl shadow-lg group-hover:shadow-info/30 transition-all">
                  <IndianRupee className="w-8 h-8 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-info opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pending</p>
                <p className="text-4xl font-bold text-info">₹{totalPending.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Awaiting processing</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white to-warning/5 shadow-xl hover:shadow-2xl hover:shadow-warning/20 transition-all cursor-pointer transform hover:-translate-y-1 rounded-3xl overflow-hidden"
                onClick={() => setFilter("kyc")}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-warning to-brand-tertiary rounded-2xl shadow-lg group-hover:shadow-warning/30 transition-all">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <Shield className="w-6 h-6 text-warning opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">KYC Required</p>
                <p className="text-4xl font-bold text-warning">{kycRequired}</p>
                <p className="text-sm text-muted-foreground">Identity verification needed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white to-success/5 shadow-xl hover:shadow-2xl hover:shadow-success/20 transition-all cursor-pointer transform hover:-translate-y-1 rounded-3xl overflow-hidden"
                onClick={() => setFilter("active")}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-success to-brand-secondary rounded-2xl shadow-lg group-hover:shadow-success/30 transition-all">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-success opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Transfers</p>
                <p className="text-4xl font-bold text-success">{transactions.filter(t => ["pending", "kyc_required", "processing"].includes(t.status)).length}</p>
                <p className="text-sm text-muted-foreground">In progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="border-0 bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/10 p-8">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <div className="p-3 bg-gradient-primary rounded-2xl shadow-lg">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <span className="gradient-text font-bold">
                  {filter === "all" ? "All Transactions" : 
                   filter === "active" ? "Active Transactions" :
                   filter === "pending" ? "Pending Transactions" : "KYC Required"}
                </span>
                <Badge variant="secondary" className="ml-4 px-4 py-2 text-base font-semibold rounded-full bg-gradient-to-r from-secondary to-muted">
                  {filteredTransactions.length}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="group p-6 rounded-2xl border-2 border-border/20 bg-gradient-to-r from-white to-card/50 hover:from-card to-white hover:border-primary/30 hover:shadow-xl transition-all duration-300 animate-slide-up transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{transaction.senderName}</h3>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-medium">{transaction.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full inline-block">
                      {transaction.purpose}
                    </p>
                  </div>
                  <div className="text-right space-y-3">
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted/30 rounded-lg border border-border/20">
                        <p className="font-bold text-foreground">{transaction.bankAccount}</p>
                        <p className="text-muted-foreground">A/c: {transaction.accountNumber}</p>
                        <p className="text-muted-foreground">IFSC: {transaction.ifscCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(transaction.status)}
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Transaction ID: {transaction.id}
                      </span>
                    </div>
                  </div>

                  {transaction.status === "kyc_required" && (
                    <div className="flex gap-3">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate(`/kyc/individual/${transaction.id}`)}
                        className="border-2 border-border bg-card hover:bg-gradient-to-r hover:from-info hover:to-brand-quaternary hover:text-white hover:border-transparent px-6 py-3 rounded-xl transition-all btn-glow"
                      >
                        <User className="w-5 h-5 mr-2" />
                        Individual KYC
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => navigate(`/kyc/company/${transaction.id}`)}
                        className="bg-gradient-primary text-white shadow-brand hover:shadow-2xl hover:shadow-primary/40 px-6 py-3 rounded-xl transition-all btn-glow"
                      >
                        <Building2 className="w-5 h-5 mr-2" />
                        Company KYC
                      </Button>
                    </div>
                  )}

                  {transaction.status === "processing" && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate(`/tracking/${transaction.id}`)}
                      className="border-2 border-info bg-card hover:bg-info hover:text-white hover:border-transparent px-6 py-3 rounded-xl transition-all btn-glow"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
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
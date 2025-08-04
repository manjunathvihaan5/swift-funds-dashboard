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
  Lock,
  CheckCircle
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
  bankUTR?: string;
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
    purpose: "Development Work",
    bankUTR: "HDFC240112UTR001234"
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
  const [isKYCCompleted] = useState(true); // Mock KYC status
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
        return <Badge className="bg-action-warning text-white px-3 py-1 rounded-md text-sm font-medium">KYC Required</Badge>;
      case "pending":
        return <Badge className="bg-trust text-white px-3 py-1 rounded-md text-sm font-medium">Pending</Badge>;
      case "processing":
        return <Badge className="bg-trust text-white px-3 py-1 rounded-md text-sm font-medium">Processing</Badge>;
      case "completed":
        return <Badge className="bg-safety text-white px-3 py-1 rounded-md text-sm font-medium">Completed</Badge>;
      case "failed":
        return <Badge className="bg-error text-white px-3 py-1 rounded-md text-sm font-medium">Failed</Badge>;
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "kyc_required":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-action-warning rounded-md">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-action-warning">Identity verification required</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-trust rounded-md">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-trust">Awaiting processing</span>
          </div>
        );
      case "processing":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-trust rounded-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-trust">Processing transfer</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-safety rounded-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-safety">Transfer completed</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-error rounded-md">
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Professional Header with Trust Elements */}
        <div className="bg-white border-b border-border py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary rounded-lg shadow-md">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Fund Transfer Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Track your remittances and complete KYC
            </p>

            {/* Trust & Safety Indicators */}
            <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground mt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-trust" />
                <span>Secure Transfers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-safety" />
                <span>Licensed Provider</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-trust" />
                <span>Data Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Profile Section */}
        {isKYCCompleted && (
          <Card className="border-2 border-safety shadow-lg bg-gradient-to-r from-safety/5 to-trust/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-safety rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-foreground">KYC Profile</span>
                <Badge className="bg-safety text-white px-3 py-1">Verified</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Personal Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PAN:</span>
                      <span className="font-medium">ABCDE1234F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aadhaar:</span>
                      <span className="font-medium">****-****-9012</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Connected Companies</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Primary:</span>
                      <span className="font-medium">Tech Innovations Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className="bg-safety text-white px-2 py-0 text-xs">Verified</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clean Filter Buttons */}
        <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
              filter === "all" 
                ? "bg-primary text-white border-primary shadow-sm" 
                : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            All Transfers
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
              filter === "pending" 
                ? "bg-primary text-white border-primary shadow-sm" 
                : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            Pending
          </Button>
          <Button
            variant={filter === "kyc" ? "default" : "outline"}
            onClick={() => setFilter("kyc")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
              filter === "kyc" 
                ? "bg-action-warning text-white border-action-warning shadow-sm" 
                : "bg-white text-foreground border-border hover:border-action-warning hover:text-action-warning"
            }`}
          >
            KYC Required
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-border shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setFilter("pending")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-accent rounded-lg">
                  <IndianRupee className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Pending</p>
                <p className="text-2xl font-bold text-foreground">₹{totalPending.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-action-warning shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setFilter("kyc")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-action-warning" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">KYC Required</p>
                <p className="text-2xl font-bold text-action-warning">{kycRequired}</p>
                <p className="text-xs text-muted-foreground">Identity verification needed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setFilter("active")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-safety" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Transfers</p>
                <p className="text-2xl font-bold text-safety">{transactions.filter(t => ["pending", "kyc_required", "processing"].includes(t.status)).length}</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-md hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{transactions.filter(t => t.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">Successfully transferred</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="border-2 border-border shadow-lg">
          <CardHeader className="bg-muted/30 border-b border-border p-6">
            <CardTitle className="flex items-center gap-4 text-xl">
              <div className="p-2 bg-primary rounded-lg">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-foreground font-bold">
                  {filter === "all" ? "All Transactions" : 
                   filter === "active" ? "Active Transactions" :
                   filter === "pending" ? "Pending Transactions" : "KYC Required"}
                </span>
                <Badge variant="secondary" className="ml-4 px-3 py-1 text-sm font-medium rounded-md bg-secondary">
                  {filteredTransactions.length}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 rounded-lg border-2 border-border bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-foreground">{transaction.senderName}</h3>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-medium">{transaction.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md inline-block">
                      {transaction.purpose}
                    </p>
                  </div>
                  <div className="text-right space-y-3">
                    <p className="text-2xl font-bold text-foreground">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="font-bold text-foreground">{transaction.bankAccount}</p>
                        <p className="text-muted-foreground">A/c: {transaction.accountNumber}</p>
                        <p className="text-muted-foreground">IFSC: {transaction.ifscCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(transaction.status)}
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Transaction ID: {transaction.id}
                      </span>
                      {transaction.bankUTR && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          Bank UTR: {transaction.bankUTR}
                        </span>
                      )}
                    </div>
                  </div>

                  {transaction.status === "kyc_required" && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/kyc/individual/${transaction.id}`)}
                        className="border-2 border-action-warning text-action-warning hover:bg-action-warning hover:text-white font-bold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Complete Individual KYC
                      </Button>
                      <Button
                        onClick={() => navigate(`/kyc/company/${transaction.id}`)}
                        className="bg-action-warning hover:bg-action-warning/90 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Complete Company KYC
                      </Button>
                    </div>
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
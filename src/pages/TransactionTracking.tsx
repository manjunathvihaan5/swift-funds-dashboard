import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Building2, 
  CreditCard, 
  Banknote,
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "failed";
  timestamp?: string;
  estimatedTime?: string;
}

const TransactionTracking = () => {
  const [steps, setSteps] = useState<TrackingStep[]>([
    {
      id: "kyc-verified",
      title: "KYC Verified",
      description: "Your identity verification has been completed successfully",
      status: "completed",
      timestamp: "2024-01-15 10:30 AM"
    },
    {
      id: "processing",
      title: "Processing Transfer",
      description: "Your transaction is being processed by our banking partners",
      status: "current",
      estimatedTime: "2-4 hours"
    },
    {
      id: "bank-approval",
      title: "Bank Approval",
      description: "Awaiting approval from your destination bank",
      status: "pending",
      estimatedTime: "4-6 hours"
    },
    {
      id: "funds-credited",
      title: "Funds Credited",
      description: "Funds will be credited to your account",
      status: "pending",
      estimatedTime: "6-24 hours"
    }
  ]);
  
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const mockTransactionDetails = {
    amount: 5000,
    currency: "USD",
    bankAccount: "HDFC Bank - ***4521",
    senderName: "Global Tech Corp",
    purpose: "Software Services",
    exchangeRate: "83.25 INR",
    fees: "25 USD",
    netAmount: "4,975 USD"
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly advance the status (simulation)
      if (Math.random() > 0.8) {
        setSteps(prevSteps => {
          const currentIndex = prevSteps.findIndex(step => step.status === "current");
          if (currentIndex < prevSteps.length - 1) {
            const newSteps = [...prevSteps];
            newSteps[currentIndex].status = "completed";
            newSteps[currentIndex].timestamp = new Date().toLocaleString();
            newSteps[currentIndex + 1].status = "current";
            return newSteps;
          }
          return prevSteps;
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastUpdated(new Date());
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStepIcon = (status: TrackingStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-neon-green" />;
      case "current":
        return <Clock className="w-5 h-5 text-neon-blue animate-pulse" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getProgressValue = () => {
    const completedSteps = steps.filter(step => step.status === "completed").length;
    const currentStep = steps.find(step => step.status === "current") ? 0.5 : 0;
    return ((completedSteps + currentStep) / steps.length) * 100;
  };

  const isCompleted = steps.every(step => step.status === "completed");

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="border-border/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Transaction Status</h1>
            <p className="text-sm text-muted-foreground">ID: {transactionId}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-border/50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Transfer Progress</h3>
                {isCompleted ? (
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    Completed
                  </Badge>
                ) : (
                  <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                    In Progress
                  </Badge>
                )}
              </div>
              <Progress value={getProgressValue()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-primary" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-semibold text-primary">{mockTransactionDetails.amount} {mockTransactionDetails.currency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Exchange Rate</p>
                <p className="font-medium">{mockTransactionDetails.exchangeRate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">From</p>
                <p className="font-medium">{mockTransactionDetails.senderName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">To</p>
                <p className="font-medium">{mockTransactionDetails.bankAccount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="font-medium">{mockTransactionDetails.purpose}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Net Amount</p>
                <p className="font-semibold text-accent">{mockTransactionDetails.netAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Steps */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-primary" />
              Status Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-2.5 top-8 w-px h-16 bg-border/50" />
                )}
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-medium ${
                        step.status === "completed" ? "text-neon-green" :
                        step.status === "current" ? "text-neon-blue" :
                        step.status === "failed" ? "text-destructive" :
                        "text-muted-foreground"
                      }`}>
                        {step.title}
                      </h4>
                      {step.status === "current" && step.estimatedTime && (
                        <Badge variant="outline" className="text-xs border-neon-blue/30 text-neon-blue">
                          ETA: {step.estimatedTime}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    
                    {step.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {step.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isCompleted && (
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-medium shadow-lg shadow-neon-green/30"
            >
              <Banknote className="w-4 h-4 mr-2" />
              View Receipt
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full border-border/50 hover:bg-secondary/50"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTracking;
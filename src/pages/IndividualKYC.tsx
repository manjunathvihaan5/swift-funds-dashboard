import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, User, FileText, Shield, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const IndividualKYC = () => {
  const [step, setStep] = useState<"pan" | "aadhaar" | "aadhaar-otp" | "processing" | "success" | "failed">("pan");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pan.length === 10) {
      setStep("aadhaar");
      toast({
        title: "PAN Verified",
        description: "Please enter your Aadhaar number",
      });
    }
  };

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length === 12) {
      setStep("aadhaar-otp");
      toast({
        title: "Aadhaar Verified",
        description: "OTP sent to your registered mobile number",
      });
    }
  };

  const handleAadhaarOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarOtp.length === 6) {
      setIsSubmitting(true);
      setStep("processing");
      
      // Simulate processing
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        if (success) {
          setStep("success");
          toast({
            title: "KYC Completed Successfully",
            description: "Your transaction will now be processed",
          });
        } else {
          setStep("failed");
          toast({
            title: "KYC Verification Failed",
            description: "Please check your details and try again",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const getStepIcon = (currentStep: string) => {
    switch (currentStep) {
      case "pan":
        return <FileText className="w-6 h-6" />;
      case "aadhaar":
        return <User className="w-6 h-6" />;
      case "aadhaar-otp":
        return <Shield className="w-6 h-6" />;
      case "processing":
        return <User className="w-6 h-6" />;
      default:
        return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  const getProgressValue = () => {
    switch (step) {
      case "pan": return 20;
      case "aadhaar": return 40;
      case "aadhaar-otp": return 60;
      case "processing": return 80;
      case "success": return 100;
      case "failed": return 60;
      default: return 0;
    }
  };

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
          <div>
            <h1 className="text-xl font-bold text-foreground">Individual KYC</h1>
            <p className="text-sm text-muted-foreground">Transaction: {transactionId}</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                {getStepIcon(step)}
              </div>
              <span className="text-sm font-medium text-foreground">
                {step === "pan" && "PAN Verification"}
                {step === "aadhaar" && "Aadhaar Number"}
                {step === "aadhaar-otp" && "Aadhaar OTP"}
                {step === "processing" && "Processing KYC"}
                {step === "success" && "KYC Completed"}
                {step === "failed" && "Verification Failed"}
              </span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Individual KYC Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "pan" && (
              <form onSubmit={handlePanSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-foreground/90">
                    PAN Card Number
                  </Label>
                  <Input
                    id="pan"
                    type="text"
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="bg-input/50 border-border/50 focus:border-primary transition-colors"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 10-digit PAN card number
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/30"
                  disabled={pan.length !== 10}
                >
                  Verify PAN
                </Button>
              </form>
            )}

            {step === "aadhaar" && (
              <form onSubmit={handleAadhaarSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar" className="text-foreground/90">
                    Aadhaar Number
                  </Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="1234 5678 9012"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    className="bg-input/50 border-border/50 focus:border-primary transition-colors"
                    maxLength={12}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 12-digit Aadhaar number
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("pan")}
                    className="flex-1 border-border/50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/30"
                    disabled={aadhaar.length !== 12}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {step === "aadhaar-otp" && (
              <form onSubmit={handleAadhaarOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground/90">
                    Enter Aadhaar OTP
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={aadhaarOtp}
                      onChange={setAadhaarOtp}
                      className="gap-2"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-border/50" />
                        <InputOTPSlot index={1} className="border-border/50" />
                        <InputOTPSlot index={2} className="border-border/50" />
                        <InputOTPSlot index={3} className="border-border/50" />
                        <InputOTPSlot index={4} className="border-border/50" />
                        <InputOTPSlot index={5} className="border-border/50" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    OTP sent to your Aadhaar registered mobile number
                  </p>
                  <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      By proceeding, I consent to the use of my Aadhaar number for KYC verification as per the regulations of UIDAI and RBI guidelines for international fund transfers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("aadhaar")}
                    className="flex-1 border-border/50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-lg shadow-accent/30"
                    disabled={aadhaarOtp.length !== 6}
                  >
                    Verify OTP
                  </Button>
                </div>
              </form>
            )}

            {step === "processing" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-neon-pulse">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verifying KYC Details</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we process your information...</p>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}

            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-green">KYC Verification Successful!</h3>
                  <p className="text-sm text-muted-foreground">Your transaction will now be processed</p>
                </div>
                <Button
                  onClick={() => navigate(`/tracking/${transactionId}`)}
                  className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-medium shadow-lg shadow-neon-green/30"
                >
                  Track Transaction Status
                </Button>
              </div>
            )}

            {step === "failed" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">KYC Verification Failed</h3>
                  <p className="text-sm text-muted-foreground">Please check your details and try again</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 border-border/50"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      setStep("pan");
                      setPan("");
                      setAadhaar("");
                      setAadhaarOtp("");
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndividualKYC;
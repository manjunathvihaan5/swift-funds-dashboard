import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Building2, FileText, Shield, CheckCircle2, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyKYCData {
  companyPan: string;
  gst: string;
  cin: string;
  signatoryPan: string;
  signatoryAadhaar: string;
  aadhaarOtp: string;
  isNRE: boolean;
  declarationAccepted: boolean;
  isPanPrefilled?: boolean;
  isAadhaarPrefilled?: boolean;
}

const CompanyKYC = () => {
  const [step, setStep] = useState<"company-details" | "signatory" | "aadhaar-otp" | "processing" | "success" | "failed">("company-details");
  const [formData, setFormData] = useState<CompanyKYCData>({
    companyPan: "ABCDE1234F", // Prefilled
    gst: "",
    cin: "",
    signatoryPan: "FGHIJ5678K", // Prefilled  
    signatoryAadhaar: "123456789012", // Prefilled
    aadhaarOtp: "",
    isNRE: false,
    declarationAccepted: false,
    isPanPrefilled: true,
    isAadhaarPrefilled: true
  });
  const [showErrorFlow, setShowErrorFlow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCompanyDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyPan.length === 10 && formData.gst.length === 15 && formData.cin.length >= 15) {
      setStep("signatory");
      toast({
        title: "Company Details Verified",
        description: "Please provide authorized signatory details",
      });
    }
  };

  const handleSignatorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.signatoryPan.length === 10 && formData.signatoryAadhaar.length === 12 && formData.declarationAccepted) {
      setStep("aadhaar-otp");
      toast({
        title: "Signatory Details Verified",
        description: "Aadhaar OTP sent to registered mobile number",
      });
    }
  };

  const handleAadhaarOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.aadhaarOtp.length === 6) {
      setIsSubmitting(true);
      setStep("processing");
      
      // Simulate processing
      setTimeout(() => {
        const success = Math.random() > 0.25; // 75% success rate
        if (success) {
          setStep("success");
          toast({
            title: "Company KYC Completed Successfully",
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
      }, 4000);
    }
  };

  const updateFormData = (field: keyof CompanyKYCData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStepIcon = (currentStep: string) => {
    switch (currentStep) {
      case "company-details":
        return <Building2 className="w-6 h-6" />;
      case "signatory":
        return <User className="w-6 h-6" />;
      case "aadhaar-otp":
        return <Shield className="w-6 h-6" />;
      case "processing":
        return <FileText className="w-6 h-6" />;
      default:
        return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  const getProgressValue = () => {
    switch (step) {
      case "company-details": return 20;
      case "signatory": return 40;
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
            <h1 className="text-xl font-bold text-foreground">Company KYC</h1>
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
                {step === "company-details" && "Company Details"}
                {step === "signatory" && "Authorized Signatory"}
                {step === "aadhaar-otp" && "Aadhaar Verification"}
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
              <Building2 className="w-5 h-5 text-primary" />
              Company KYC Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "company-details" && (
              <form onSubmit={handleCompanyDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPan" className="text-foreground/90">
                    Company PAN
                  </Label>
                  <div className="relative">
                    <Input
                      id="companyPan"
                      type="text"
                      placeholder="ABCDE1234F"
                      value={formData.companyPan}
                      onChange={(e) => updateFormData("companyPan", e.target.value.toUpperCase())}
                      className={`${formData.isPanPrefilled ? 'bg-muted/50 cursor-not-allowed' : 'bg-input/50'} border-border/50 focus:border-primary transition-colors`}
                      maxLength={10}
                      disabled={formData.isPanPrefilled}
                    />
                    {formData.isPanPrefilled && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-safety" />
                      </div>
                    )}
                  </div>
                  {formData.isPanPrefilled && (
                    <p className="text-xs text-muted-foreground bg-safety/10 p-2 rounded border">
                      ✓ Company PAN verified and prefilled
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst" className="text-foreground/90">
                    GST Number
                  </Label>
                  <Input
                    id="gst"
                    type="text"
                    placeholder="27AAPFU0939F1ZV"
                    value={formData.gst}
                    onChange={(e) => updateFormData("gst", e.target.value.toUpperCase())}
                    className="bg-input/50 border-border/50 focus:border-primary transition-colors"
                    maxLength={15}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cin" className="text-foreground/90">
                    CIN (Corporate Identification Number)
                  </Label>
                  <Input
                    id="cin"
                    type="text"
                    placeholder="U12345DL2018PTC123456"
                    value={formData.cin}
                    onChange={(e) => updateFormData("cin", e.target.value.toUpperCase())}
                    className="bg-input/50 border-border/50 focus:border-primary transition-colors"
                    maxLength={21}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/30"
                  disabled={formData.companyPan.length !== 10 || formData.gst.length !== 15 || formData.cin.length < 15}
                >
                  Continue
                </Button>
              </form>
            )}

            {step === "signatory" && (
              <form onSubmit={handleSignatorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signatoryPan" className="text-foreground/90">
                    Authorized Signatory PAN
                  </Label>
                  <div className="relative">
                    <Input
                      id="signatoryPan"
                      type="text"
                      placeholder="ABCDE1234F"
                      value={formData.signatoryPan}
                      onChange={(e) => updateFormData("signatoryPan", e.target.value.toUpperCase())}
                      className={`${formData.isPanPrefilled ? 'bg-muted/50 cursor-not-allowed' : 'bg-input/50'} border-border/50 focus:border-primary transition-colors`}
                      maxLength={10}
                      disabled={formData.isPanPrefilled}
                    />
                    {formData.isPanPrefilled && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-safety" />
                      </div>
                    )}
                  </div>
                  {formData.isPanPrefilled && (
                    <p className="text-xs text-muted-foreground bg-safety/10 p-2 rounded border">
                      ✓ PAN verified and prefilled from your profile
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signatoryAadhaar" className="text-foreground/90">
                    Authorized Signatory Aadhaar Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="signatoryAadhaar"
                      type="text"
                      placeholder="123456789012"
                      value={formData.signatoryAadhaar}
                      onChange={(e) => updateFormData("signatoryAadhaar", e.target.value)}
                      className={`${formData.isAadhaarPrefilled ? 'bg-muted/50 cursor-not-allowed' : 'bg-input/50'} border-border/50 focus:border-primary transition-colors`}
                      maxLength={12}
                      disabled={formData.isAadhaarPrefilled}
                    />
                    {formData.isAadhaarPrefilled && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-safety" />
                      </div>
                    )}
                  </div>
                  {formData.isAadhaarPrefilled && (
                    <p className="text-xs text-muted-foreground bg-safety/10 p-2 rounded border">
                      ✓ Aadhaar verified and prefilled from your profile
                    </p>
                  )}
                </div>

                {showErrorFlow && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Document Mismatch Detected</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      The PAN and Aadhaar details don't match our records. Please contact customer support for assistance.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => {
                        toast({
                          title: "Support Request Initiated",
                          description: "Our team will contact you within 24 hours to resolve this issue.",
                        });
                      }}
                    >
                      Contact Customer Support
                    </Button>
                  </div>
                )}

                <div className="mt-3 p-3 bg-muted/50 rounded-md border border-border/50">
                  <p className="text-xs text-muted-foreground">
                    I consent to use my Aadhaar number and OTP for identity verification as per UIDAI guidelines.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="nre-toggle" className="text-foreground/90">
                      NRE Account Holder
                    </Label>
                    <Switch
                      id="nre-toggle"
                      checked={formData.isNRE}
                      onCheckedChange={(checked) => updateFormData("isNRE", checked)}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="declaration"
                      checked={formData.declarationAccepted}
                      onCheckedChange={(checked) => updateFormData("declarationAccepted", checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="declaration" className="text-sm text-foreground/90 leading-relaxed">
                      I declare that all the information provided is true and accurate. I understand that 
                      providing false information may result in legal action.
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("company-details")}
                    className="flex-1 border-border/50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={formData.signatoryPan.length !== 10 || formData.signatoryAadhaar.length !== 12 || !formData.declarationAccepted}
                  >
                    Continue
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowErrorFlow(!showErrorFlow)}
                  className="w-full border-border/50 text-xs"
                >
                  Report Issue with Documents
                </Button>
              </form>
            )}

            {step === "aadhaar-otp" && (
              <form onSubmit={handleAadhaarOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground/90">
                    Enter Aadhaar OTP (Signatory)
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={formData.aadhaarOtp}
                      onChange={(value) => updateFormData("aadhaarOtp", value)}
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
                    OTP sent to authorized signatory's Aadhaar registered mobile
                  </p>
                  <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      By proceeding, I consent to the use of authorized signatory's Aadhaar number for KYC verification as per the regulations of UIDAI and RBI guidelines for international fund transfers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("signatory")}
                    className="flex-1 border-border/50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-lg shadow-accent/30"
                    disabled={formData.aadhaarOtp.length !== 6}
                  >
                    Verify & Complete
                  </Button>
                </div>
              </form>
            )}

            {step === "processing" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-neon-pulse">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verifying Company KYC</h3>
                  <p className="text-sm text-muted-foreground">Processing company documents and signatory verification...</p>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            )}

            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-green">Company KYC Verification Successful!</h3>
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
                  <h3 className="font-semibold text-destructive">Company KYC Verification Failed</h3>
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
                      setStep("company-details");
                      setFormData({
                        companyPan: "ABCDE1234F",
                        gst: "",
                        cin: "",
                        signatoryPan: "FGHIJ5678K",
                        signatoryAadhaar: "123456789012",
                        aadhaarOtp: "",
                        isNRE: false,
                        declarationAccepted: false,
                        isPanPrefilled: true,
                        isAadhaarPrefilled: true
                      });
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

export default CompanyKYC;